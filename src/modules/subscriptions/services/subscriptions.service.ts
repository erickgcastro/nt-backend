import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { SubscriptionsRepository } from '../repositories/subscriptions.repository';
import type { PlansService } from '../../plans/services/plans.service';
import type { StripeService } from '../../../infra/stripe/stripe.service';
import type { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import type { SubscriptionResponseDto } from '../dto/subscription-response.dto';
import type { UsersRepository } from '../../auth/repositories/users.repository';

@Injectable()
export class SubscriptionsService {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private plansService: PlansService,
    private stripeService: StripeService,
    private usersRepository: UsersRepository,
  ) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
    userId: string,
  ): Promise<SubscriptionResponseDto> {
    const plan = await this.plansService.findOne(createSubscriptionDto.planId);

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.stripeCustomerId) {
      throw new ForbiddenException('User does not have a Stripe customer ID');
    }

    const stripeSubscription = await this.stripeService.createSubscription(
      user.stripeCustomerId,
      plan.stripePriceId,
    );

    const subscription = await this.subscriptionsRepository.create({
      userId,
      planId: plan.id,
      stripeSubscriptionId: stripeSubscription.id,
      status: stripeSubscription.status,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
    });

    const clientSecret = stripeSubscription.latest_invoice?.payment_intent?.client_secret;

    return {
      ...subscription,
      clientSecret,
    };
  }

  async findOne(id: string, userId: string): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionsRepository.findOne(id);

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    if (subscription.userId !== userId) {
      throw new ForbiddenException('You do not have access to this subscription');
    }

    return subscription;
  }

  async cancel(id: string, userId: string): Promise<void> {
    const subscription = await this.subscriptionsRepository.findOne(id);

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    if (subscription.userId !== userId) {
      throw new ForbiddenException('You do not have access to this subscription');
    }

    await this.stripeService.cancelSubscription(subscription.stripeSubscriptionId);

    await this.subscriptionsRepository.update(id, {
      status: 'canceled',
      canceledAt: new Date(),
    });
  }

  async updateSubscriptionStatus(stripeSubscriptionId: string, status: string): Promise<void> {
    const subscription =
      await this.subscriptionsRepository.findByStripeSubscriptionId(stripeSubscriptionId);

    if (!subscription) {
      throw new NotFoundException(`Subscription with Stripe ID ${stripeSubscriptionId} not found`);
    }

    await this.subscriptionsRepository.update(subscription.id, { status });
  }
}
