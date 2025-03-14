import { Module } from '@nestjs/common';
import { PlansController } from './controllers/plans.controller';
import { PlansService } from './services/plans.service';
import { PlansRepository } from './repositories/plans.repository';
import { StripeModule } from '@/infra/stripe/stripe.module';

@Module({
  imports: [StripeModule],
  controllers: [PlansController],
  providers: [PlansService, PlansRepository],
  exports: [PlansService],
})
export class PlansModule {}
