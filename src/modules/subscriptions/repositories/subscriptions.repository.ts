import { Injectable } from '@nestjs/common';
import type { PrismaService } from '../../../infra/database/prisma.service';
import type { Subscription } from '../entities/subscription.entity';

@Injectable()
export class SubscriptionsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    userId: string;
    planId: string;
    stripeSubscriptionId: string;
    status: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
  }): Promise<Subscription> {
    return this.prisma.subscription.create({
      data,
    });
  }

  async findOne(id: string): Promise<Subscription | null> {
    return this.prisma.subscription.findUnique({
      where: { id },
    });
  }

  async findByStripeSubscriptionId(stripeSubscriptionId: string): Promise<Subscription | null> {
    return this.prisma.subscription.findUnique({
      where: { stripeSubscriptionId },
    });
  }

  async findByUserId(userId: string): Promise<Subscription[]> {
    return this.prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: Partial<Subscription>): Promise<Subscription> {
    return this.prisma.subscription.update({
      where: { id },
      data,
    });
  }
}
