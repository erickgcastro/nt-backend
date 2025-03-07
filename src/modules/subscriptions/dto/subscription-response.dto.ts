import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  planId: string;

  @ApiProperty()
  stripeSubscriptionId: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  currentPeriodStart: Date;

  @ApiProperty()
  currentPeriodEnd: Date;

  @ApiProperty()
  canceledAt: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false })
  clientSecret?: string;
}
