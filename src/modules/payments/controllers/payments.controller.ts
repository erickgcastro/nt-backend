import { Controller, Post, Get, Body, Param, UseGuards, RawBodyRequest, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { PaymentsService } from '../services/payments.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { PaymentResponseDto } from '../dto/payment-response.dto';
import { Request } from 'express';
import { User } from '@prisma/client';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new payment intent for bank transfer' })
  @ApiResponse({
    status: 201,
    description: 'Payment intent created successfully',
    type: PaymentResponseDto,
  })
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
    @Req() req: Request & { user: User },
  ): Promise<PaymentResponseDto> {
    return this.paymentsService.createPaymentIntent(createPaymentDto, req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment status' })
  @ApiResponse({
    status: 200,
    description: 'Payment status retrieved successfully',
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async findOne(
    @Param('id') id: string,
    @Req() req: Request & { user: User },
  ): Promise<PaymentResponseDto> {
    return this.paymentsService.getPaymentStatus(id, req.user.id);
  }

  @Post('webhooks/stripe')
  @ApiOperation({ summary: 'Webhook for Stripe events' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async handleStripeWebhook(
    @Req() request: RawBodyRequest<Request>,
  ): Promise<{ received: boolean }> {
    const signature = request.headers['stripe-signature'] as string;
    await this.paymentsService.handleStripeWebhook(request.rawBody!, signature);
    return { received: true };
  }
}
