import { Module } from '@nestjs/common';
import { InvoicesController } from './controllers/invoices.controller';
import { InvoicesService } from './services/invoices.service';
import { InvoicesRepository } from './repositories/invoices.repository';
import { EmailModule } from '../../infra/email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [InvoicesController],
  providers: [InvoicesService, InvoicesRepository],
  exports: [InvoicesService],
})
export class InvoicesModule {}
