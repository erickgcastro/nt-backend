import { IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ example: 29.99 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: 'One-time payment for international plan', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  @IsString()
  @IsOptional()
  subscriptionId?: string;
}
