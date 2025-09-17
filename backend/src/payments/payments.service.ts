import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MidtransService } from './integrations/midtrans.service';
import { XenditService } from './integrations/xendit.service';
import { StripeService } from './integrations/stripe.service';
import { TransactionsService } from '../transactions/transactions.service';
import { PaymentMethod } from '../transactions/entities/transaction.entity';

export interface PaymentRequest {
  amount: number;
  currency: string;
  method: PaymentMethod;
  userId: string;
  orderId: string;
  description: string;
  metadata?: any;
}

export interface PaymentResponse {
  paymentId: string;
  paymentUrl?: string;
  status: string;
  method: PaymentMethod;
  gateway: string;
}

@Injectable()
export class PaymentsService {
  constructor(
    private readonly midtransService: MidtransService,
    private readonly xenditService: XenditService,
    private readonly stripeService: StripeService,
    private readonly transactionsService: TransactionsService,
    private readonly configService: ConfigService,
  ) {}
}