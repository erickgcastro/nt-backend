import { ApiProperty } from '@nestjs/swagger';

export class PaymentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  stripePaymentIntentId: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  status: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  subscriptionId?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false })
  clientSecret?: string;
}
