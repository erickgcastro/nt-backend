import { IsString, IsNumber, IsEnum, IsNotEmpty, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum BillingInterval {
  MONTHLY = 'month',
  YEARLY = 'year',
}

export class CreatePlanDto {
  @ApiProperty({ example: 'Premium International Plan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Unlimited calls and data in 100+ countries' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 29.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ enum: BillingInterval, example: BillingInterval.MONTHLY })
  @IsEnum(BillingInterval)
  billingInterval: BillingInterval;

  @ApiProperty({ example: ['Unlimited calls', '10GB data', 'No roaming fees'], required: false })
  @IsOptional()
  @IsString({ each: true })
  features?: string[];
}
