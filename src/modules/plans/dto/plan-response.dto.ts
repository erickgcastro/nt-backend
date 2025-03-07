import { ApiProperty } from '@nestjs/swagger';

export class PlanResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  billingInterval: string;

  @ApiProperty()
  stripePriceId: string;

  @ApiProperty()
  stripeProductId: string;

  @ApiProperty({ type: [String] })
  features: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
