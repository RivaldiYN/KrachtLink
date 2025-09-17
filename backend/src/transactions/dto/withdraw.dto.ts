import {
      IsNumber,
      IsEnum,
      IsObject,
      Min,
} from 'class-validator';
import { PaymentMethod } from '../entities/transaction.entity';

export class WithdrawDto {
      @IsNumber()
      @Min(50000) // Minimum 50k IDR
      amount: number;

      @IsEnum(PaymentMethod)
      paymentMethod: PaymentMethod;

      @IsObject()
      paymentDetails: {
            bankName?: string;
            accountNumber?: string;
            accountName?: string;
            ewalletType?: string;
            ewalletNumber?: string;
            paypalEmail?: string;
            cryptoAddress?: string;
            cryptoType?: string;
      };
}