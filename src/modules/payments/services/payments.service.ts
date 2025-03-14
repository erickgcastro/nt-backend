import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PaymentsRepository } from '../repositories/payments.repository';
import { StripeService } from '../../../infra/stripe/stripe.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { PaymentResponseDto } from '../dto/payment-response.dto';
import { SubscriptionsService } from '../../subscriptions/services/subscriptions.service';

@Injectable()
export class PaymentsService {
  constructor(
    private paymentsRepository: PaymentsRepository,
    private stripeService: StripeService,
    private subscriptionsService: SubscriptionsService,
  ) {}

  async createPaymentIntent(
    createPaymentDto: CreatePaymentDto,
    userId: string,
  ): Promise<PaymentResponseDto> {
    const metadata: Record<string, string> = {
      userId,
    };

    if (createPaymentDto.description) {
      metadata.description = createPaymentDto.description;
    }

    if (createPaymentDto.subscriptionId) {
      metadata.subscriptionId = createPaymentDto.subscriptionId;
    }

    const paymentIntent = await this.stripeService.createBankTransferPaymentIntent(
      createPaymentDto.amount,
      metadata,
    );

    const payment = await this.paymentsRepository.create({
      userId,
      stripePaymentIntentId: paymentIntent.id,
      amount: createPaymentDto.amount,
      status: paymentIntent.status,
      description: createPaymentDto.description,
      subscriptionId: createPaymentDto.subscriptionId,
    });

    return {
      ...payment,
      description: payment.description || undefined,
      subscriptionId: payment.subscriptionId || undefined,
      clientSecret: paymentIntent.client_secret || undefined,
    };
  }

  async getPaymentStatus(id: string, userId: string): Promise<PaymentResponseDto> {
    const payment = await this.paymentsRepository.findOne(id);

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    if (payment.userId !== userId) {
      throw new ForbiddenException('You do not have access to this payment');
    }

    const paymentIntent = await this.stripeService.getPaymentIntent(payment.stripePaymentIntentId);

    if (payment.status !== paymentIntent.status) {
      await this.paymentsRepository.update(id, { status: paymentIntent.status });
      payment.status = paymentIntent.status;
    }

    return {
      ...payment,
      description: payment.description || undefined,
      subscriptionId: payment.subscriptionId || undefined,
      clientSecret: paymentIntent.client_secret || undefined,
    };
  }

  async handleStripeWebhook(payload: Buffer, signature: string): Promise<void> {
    const event = this.stripeService.constructEvent(payload, signature);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentIntentSucceeded(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await this.handlePaymentIntentFailed(event.data.object);
        break;

      case 'subscription_schedule.updated':
        await this.handleSubscriptionUpdated(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await this.handleInvoicePaymentSucceeded(event.data.object);
        break;

      default:
        break;
    }
  }

  private async handlePaymentIntentSucceeded(paymentIntent): Promise<void> {
    const payment = await this.paymentsRepository.findByStripePaymentIntentId(paymentIntent.id);

    if (payment) {
      await this.paymentsRepository.update(payment.id, { status: 'succeeded' });

      if (payment.subscriptionId) {
        // Logic to update subscription status
      }
    }
  }

  private async handlePaymentIntentFailed(paymentIntent): Promise<void> {
    const payment = await this.paymentsRepository.findByStripePaymentIntentId(paymentIntent.id);

    if (payment) {
      await this.paymentsRepository.update(payment.id, { status: 'failed' });
    }
  }

  private async handleSubscriptionUpdated(subscription): Promise<void> {
    await this.subscriptionsService.updateSubscriptionStatus(subscription.id, subscription.status);
  }

  private async handleInvoicePaymentSucceeded(data): Promise<void> {
    console.log(data);
  }
}
