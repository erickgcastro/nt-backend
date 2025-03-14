import { Module } from '@nestjs/common';
import { SubscriptionsController } from './controllers/subscriptions.controller';
import { SubscriptionsService } from './services/subscriptions.service';
import { SubscriptionsRepository } from './repositories/subscriptions.repository';
import { PlansModule } from '../plans/plans.module';
import { StripeModule } from '../../infra/stripe/stripe.module';
import { UsersRepository } from '../auth/repositories/users.repository';

@Module({
  imports: [PlansModule, StripeModule],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, SubscriptionsRepository, UsersRepository],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
