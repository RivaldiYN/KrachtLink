import {
      Entity,
      PrimaryGeneratedColumn,
      Column,
      UpdateDateColumn,
      OneToOne,
      JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('wallets')
export class Wallet {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
      balance: number;

      @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
      totalEarned: number;

      @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
      totalWithdrawn: number;

      @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
      pendingWithdraw: number;

      @UpdateDateColumn()
      updatedAt: Date;

      // Relations
      @OneToOne(() => User, (user) => user.wallet)
      @JoinColumn({ name: 'user_id' })
      user: User;
}