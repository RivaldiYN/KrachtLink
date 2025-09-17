import {
      Entity,
      PrimaryGeneratedColumn,
      Column,
      CreateDateColumn,
      UpdateDateColumn,
      ManyToOne,
      JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TransactionType {
      INCOME = 'income',
      WITHDRAW = 'withdraw',
      BONUS = 'bonus',
      PENALTY = 'penalty',
}

export enum TransactionStatus {
      PENDING = 'pending',
      SUCCESS = 'success',
      FAILED = 'failed',
      CANCELLED = 'cancelled',
}

export enum PaymentMethod {
      BANK_TRANSFER = 'bank_transfer',
      EWALLET = 'ewallet',
      PAYPAL = 'paypal',
      CRYPTO = 'crypto',
}

@Entity('transactions')
export class Transaction {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column({
            type: 'enum',
            enum: TransactionType,
      })
      type: TransactionType;

      @Column({ type: 'decimal', precision: 12, scale: 2 })
      amount: number;

      @Column({
            type: 'enum',
            enum: TransactionStatus,
            default: TransactionStatus.PENDING,
      })
      status: TransactionStatus;

      @Column({
            type: 'enum',
            enum: PaymentMethod,
            nullable: true,
      })
      paymentMethod: PaymentMethod;

      @Column({ nullable: true })
      paymentReference: string;

      @Column({ nullable: true })
      paymentGateway: string; // midtrans, xendit, stripe, etc

      @Column('json', { nullable: true })
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

      @Column({ nullable: true })
      campaignId: string;

      @Column('text', { nullable: true })
      description: string;

      @Column('text', { nullable: true })
      notes: string;

      @Column({ type: 'timestamp', nullable: true })
      processedAt: Date;

      @CreateDateColumn()
      createdAt: Date;

      @UpdateDateColumn()
      updatedAt: Date;

      // Relations
      @ManyToOne(() => User, (user) => user.transactions)
      @JoinColumn({ name: 'user_id' })
      user: User;
}