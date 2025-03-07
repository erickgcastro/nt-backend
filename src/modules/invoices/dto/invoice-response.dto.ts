import { ApiProperty } from '@nestjs/swagger';

export class InvoiceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  paymentId: string;

  @ApiProperty()
  subscriptionId: string;

  @ApiProperty()
  invoiceNumber: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  issuedAt: Date;

  @ApiProperty()
  dueDate: Date;

  @ApiProperty()
  paidAt: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
