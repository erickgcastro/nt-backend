import { Injectable } from '@nestjs/common';
import type { PrismaService } from '../../../infra/database/prisma.service';
import type { Payment } from '../entities/payment.entity';

@Injectable()
export class PaymentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    userId: string;
    stripePaymentIntentId: string;
    amount: number;
    status: string;
    description?: string;
    subscriptionId?: string;
  }): Promise<Payment> {
    return this.prisma.payment.create({
      data,
    });
  }

  async findOne(id: string): Promise<Payment | null> {
    return this.prisma.payment.findUnique({
      where: { id },
    });
  }

  async findByStripePaymentIntentId(stripePaymentIntentId: string): Promise<Payment | null> {
    return this.prisma.payment.findUnique({
      where: { stripePaymentIntentId },
    });
  }

  async findByUserId(userId: string): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: Partial<Payment>): Promise<Payment> {
    return this.prisma.payment.update({
      where: { id },
      data,
    });
  }
}
