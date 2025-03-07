import { Module } from '@nestjs/common';
import { PaymentsController } from './controllers/payments.controller';
import { PaymentsService } from './services/payments.service';
import { PaymentsRepository } from './repositories/payments.repository';
import { StripeModule } from '../../infra/stripe/stripe.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [StripeModule, SubscriptionsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsRepository],
  exports: [PaymentsService],
})
export class PaymentsModule {}
