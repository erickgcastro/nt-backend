import { Injectable } from '@nestjs/common';
import type { PrismaService } from '../../../infra/database/prisma.service';
import type { Invoice } from '../entities/invoice.entity';

@Injectable()
export class InvoicesRepository {
  constructor(public prisma: PrismaService) {}

  async create(data: {
    userId: string;
    paymentId: string;
    subscriptionId: string;
    invoiceNumber: string;
    amount: number;
    status: string;
    issuedAt: Date;
    dueDate: Date;
  }): Promise<Invoice> {
    return this.prisma.invoice.create({
      data,
    });
  }

  async findOne(id: string): Promise<Invoice | null> {
    return this.prisma.invoice.findUnique({
      where: { id },
    });
  }

  async findByUser(userId: string): Promise<Invoice[]> {
    return this.prisma.invoice.findMany({
      where: { userId },
      orderBy: { issuedAt: 'desc' },
    });
  }

  async update(id: string, data: Partial<Invoice>): Promise<Invoice> {
    return this.prisma.invoice.update({
      where: { id },
      data,
    });
  }
}
