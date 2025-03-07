import { Injectable, NotFoundException } from '@nestjs/common';
import type { PlansRepository } from '../repositories/plans.repository';
import type { StripeService } from '../../../infra/stripe/stripe.service';
import type { CreatePlanDto } from '../dto/create-plan.dto';
import type { PlanResponseDto } from '../dto/plan-response.dto';

@Injectable()
export class PlansService {
  constructor(
    private plansRepository: PlansRepository,
    private stripeService: StripeService,
  ) {}

  async create(createPlanDto: CreatePlanDto): Promise<PlanResponseDto> {
    const stripeProduct = await this.stripeService.createProduct(
      createPlanDto.name,
      createPlanDto.description,
    );

    const stripePrice = await this.stripeService.createPrice(
      stripeProduct.id,
      createPlanDto.price,
      createPlanDto.billingInterval as 'month' | 'year',
    );

    const plan = await this.plansRepository.create(createPlanDto, stripeProduct.id, stripePrice.id);

    return plan;
  }

  async findAll(): Promise<PlanResponseDto[]> {
    return this.plansRepository.findAll();
  }

  async findOne(id: string): Promise<PlanResponseDto> {
    const plan = await this.plansRepository.findOne(id);
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }
    return plan;
  }

  async remove(id: string): Promise<void> {
    const plan = await this.plansRepository.findOne(id);
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }

    // Note: We're not deleting the product/price in Stripe as they might be
    // associated with existing subscriptions. Instead, we're just removing
    // from our database.
    await this.plansRepository.remove(id);
  }
}
