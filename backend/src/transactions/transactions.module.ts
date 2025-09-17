import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity';
import { Wallet } from './entities/wallet.entity';
import { PaymentsModule } from '../payments/payments.module';

@Module({
      imports: [
            TypeOrmModule.forFeature([Transaction, Wallet]),
            PaymentsModule,
      ],
      controllers: [TransactionsController],
      providers: [TransactionsService],
      exports: [TransactionsService],
})
export class TransactionsModule { }