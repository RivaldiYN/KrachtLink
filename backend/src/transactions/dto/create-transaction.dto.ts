import {
      IsString,
      IsNumber,
      IsEnum,
      IsOptional,
      IsObject,
      Min,
} from 'class-validator';
import {
      TransactionType,
      TransactionStatus,
      PaymentMethod,
} from '../entities/transaction.entity';

export class CreateTransactionDto {
      @IsString()
      userId: string;

      @IsEnum(TransactionType)
      type: TransactionType;

      @IsNumber()
      @Min(0)
      amount: number;

      @IsEnum(TransactionStatus)
      @IsOptional()
      status?: TransactionStatus = TransactionStatus.PENDING;

      @IsEnum(PaymentMethod)
      @IsOptional()
      paymentMethod?: PaymentMethod;

      @IsString()
      @IsOptional()
      paymentReference?: string;

      @IsString()
      @IsOptional()
      paymentGateway?: string;

      @IsObject()
      @IsOptional()
      paymentDetails?: any;

      @IsString()
      @IsOptional()
      campaignId?: string;

      @IsString()
      @IsOptional()
      description?: string;

      @IsString()
      @IsOptional()
      notes?: string;
}