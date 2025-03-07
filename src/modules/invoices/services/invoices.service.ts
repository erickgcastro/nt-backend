import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { InvoicesRepository } from '../repositories/invoices.repository';
import type { EmailService } from '../../../infra/email/email.service';
import type { InvoiceResponseDto } from '../dto/invoice-response.dto';
import { generateInvoicePdf } from '../utils/invoice-generator';
import type { Invoice } from '../entities/invoice.entity';
import type { PrismaService } from '../../../infra/database/prisma.service';

@Injectable()
export class InvoicesService {
  constructor(
    private invoicesRepository: InvoicesRepository,
    private emailService: EmailService,
    private prisma: PrismaService,
  ) {}

  async findOne(id: string, userId: string): Promise<InvoiceResponseDto> {
    const invoice = await this.invoicesRepository.findOne(id);

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    if (invoice.userId !== userId) {
      throw new ForbiddenException('You do not have access to this invoice');
    }

    return invoice;
  }

  async findByUser(userId: string): Promise<InvoiceResponseDto[]> {
    return this.invoicesRepository.findByUser(userId);
  }

  async createInvoice(data: {
    userId: string;
    paymentId: string;
    subscriptionId: string;
    amount: number;
  }): Promise<Invoice> {
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const issuedAt = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    return this.invoicesRepository.create({
      userId: data.userId,
      paymentId: data.paymentId,
      subscriptionId: data.subscriptionId,
      invoiceNumber,
      amount: data.amount,
      status: 'pending',
      issuedAt,
      dueDate,
    });
  }

  async markAsPaid(id: string): Promise<Invoice> {
    const invoice = await this.invoicesRepository.findOne(id);

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return this.invoicesRepository.update(id, {
      status: 'paid',
      paidAt: new Date(),
    });
  }

  async sendInvoice(id: string, userId: string): Promise<void> {
    const invoice = await this.findOne(id, userId);

    const pdfBuffer = await generateInvoicePdf(invoice);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.emailService.sendInvoiceEmail(user.email, `Invoice #${invoice.invoiceNumber}`, {
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.amount,
      issuedAt: invoice.issuedAt,
      dueDate: invoice.dueDate,
      status: invoice.status,
      pdfBuffer,
    });
  }
}
