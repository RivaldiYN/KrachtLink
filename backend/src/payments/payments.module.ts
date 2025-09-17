import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { MidtransService } from './integrations/midtrans.service';
import { XenditService } from './integrations/xendit.service';
import { StripeService } from './integrations/stripe.service';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
      imports: [ConfigModule, TransactionsModule],
      controllers: [PaymentsController],
      providers: [
            PaymentsService,
            MidtransService,
            XenditService,
            StripeService,
      ],
      exports: [PaymentsService],
})
export class PaymentsModule { }