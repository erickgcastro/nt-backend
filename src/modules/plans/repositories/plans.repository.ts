import { Injectable } from '@nestjs/common';
import type { PrismaService } from '../../../infra/database/prisma.service';
import type { Plan } from '../entities/plan.entity';
import type { CreatePlanDto } from '../dto/create-plan.dto';

@Injectable()
export class PlansRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    createPlanDto: CreatePlanDto,
    stripeProductId: string,
    stripePriceId: string,
  ): Promise<Plan> {
    return this.prisma.plan.create({
      data: {
        name: createPlanDto.name,
        description: createPlanDto.description,
        price: createPlanDto.price,
        billingInterval: createPlanDto.billingInterval,
        stripeProductId,
        stripePriceId,
        features: createPlanDto.features || [],
      },
    });
  }

  async findAll(): Promise<Plan[]> {
    return this.prisma.plan.findMany({
      orderBy: { price: 'asc' },
    });
  }

  async findOne(id: string): Promise<Plan | null> {
    return this.prisma.plan.findUnique({
      where: { id },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.plan.delete({
      where: { id },
    });
  }
}
