import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner, DataSource } from 'typeorm';
import { Transaction, TransactionType, TransactionStatus } from './entities/transaction.entity';
import { Wallet } from './entities/wallet.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { WithdrawDto } from './dto/withdraw.dto';

@Injectable()
export class TransactionsService {
      constructor(
            @InjectRepository(Transaction)
            private readonly transactionRepository: Repository<Transaction>,
            @InjectRepository(Wallet)
            private readonly walletRepository: Repository<Wallet>,
            private readonly dataSource: DataSource,
      ) { }

      async createTransaction(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            try {
                  const transaction = queryRunner.manager.create(Transaction, createTransactionDto);
                  const savedTransaction = await queryRunner.manager.save(transaction);

                  // Update wallet balance
                  if (createTransactionDto.type === TransactionType.INCOME) {
                        await this.updateWalletBalance(
                              queryRunner,
                              createTransactionDto.userId,
                              createTransactionDto.amount,
                              'add',
                        );
                  }

                  await queryRunner.commitTransaction();
                  return savedTransaction;
            } catch (error) {
                  await queryRunner.rollbackTransaction();
                  throw error;
            } finally {
                  await queryRunner.release();
            }
      }

      async requestWithdraw(userId: string, withdrawDto: WithdrawDto): Promise<Transaction> {
            const wallet = await this.walletRepository.findOne({
                  where: { user: { id: userId } },
            });

            if (!wallet) {
                  throw new NotFoundException('Wallet not found');
            }

            if (wallet.balance < withdrawDto.amount) {
                  throw new BadRequestException('Insufficient balance');
            }

            const minWithdraw = 50000; // Minimum 50k IDR
            if (withdrawDto.amount < minWithdraw) {
                  throw new BadRequestException(`Minimum withdraw amount is ${minWithdraw}`);
            }

            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            try {
                  // Create withdraw transaction
                  const transaction = queryRunner.manager.create(Transaction, {
                        user: { id: userId },
                        type: TransactionType.WITHDRAW,
                        amount: withdrawDto.amount,
                        status: TransactionStatus.PENDING,
                        paymentMethod: withdrawDto.paymentMethod,
                        paymentDetails: withdrawDto.paymentDetails,
                        description: 'Withdraw request',
                  });

                  const savedTransaction = await queryRunner.manager.save(transaction);

                  // Update wallet pending withdraw
                  wallet.pendingWithdraw += withdrawDto.amount;
                  wallet.balance -= withdrawDto.amount;
                  await queryRunner.manager.save(wallet);

                  await queryRunner.commitTransaction();
                  return savedTransaction;
            } catch (error) {
                  await queryRunner.rollbackTransaction();
                  throw error;
            } finally {
                  await queryRunner.release();
            }
      }

      async processWithdraw(transactionId: string, status: TransactionStatus): Promise<Transaction> {
            const transaction = await this.transactionRepository.findOne({
                  where: { id: transactionId },
                  relations: ['user', 'user.wallet'],
            });

            if (!transaction) {
                  throw new NotFoundException('Transaction not found');
            }

            if (transaction.type !== TransactionType.WITHDRAW) {
                  throw new BadRequestException('Transaction is not a withdraw request');
            }

            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            try {
                  transaction.status = status;
                  transaction.processedAt = new Date();

                  const wallet = transaction.user.wallet;

                  if (status === TransactionStatus.SUCCESS) {
                        wallet.totalWithdrawn += transaction.amount;
                        wallet.pendingWithdraw -= transaction.amount;
                  } else if (status === TransactionStatus.FAILED || status === TransactionStatus.CANCELLED) {
                        // Return balance to user
                        wallet.balance += transaction.amount;
                        wallet.pendingWithdraw -= transaction.amount;
                  }

                  await queryRunner.manager.save(transaction);
                  await queryRunner.manager.save(wallet);

                  await queryRunner.commitTransaction();
                  return transaction;
            } catch (error) {
                  await queryRunner.rollbackTransaction();
                  throw error;
            } finally {
                  await queryRunner.release();
            }
      }

      async findUserTransactions(
            userId: string,
            page: number = 1,
            limit: number = 10,
      ): Promise<{ transactions: Transaction[]; total: number }> {
            const [transactions, total] = await this.transactionRepository.findAndCount({
                  where: { user: { id: userId } },
                  take: limit,
                  skip: (page - 1) * limit,
                  order: { createdAt: 'DESC' },
            });

            return { transactions, total };
      }

      async findAll(
            page: number = 1,
            limit: number = 10,
            type?: TransactionType,
            status?: TransactionStatus,
      ): Promise<{ transactions: Transaction[]; total: number }> {
            const queryBuilder = this.transactionRepository
                  .createQueryBuilder('transaction')
                  .leftJoinAndSelect('transaction.user', 'user');

            if (type) {
                  queryBuilder.andWhere('transaction.type = :type', { type });
            }

            if (status) {
                  queryBuilder.andWhere('transaction.status = :status', { status });
            }

            const [transactions, total] = await queryBuilder
                  .skip((page - 1) * limit)
                  .take(limit)
                  .orderBy('transaction.createdAt', 'DESC')
                  .getManyAndCount();

            return { transactions, total };
      }

      async getUserWallet(userId: string): Promise<Wallet> {
            const wallet = await this.walletRepository.findOne({
                  where: { user: { id: userId } },
                  relations: ['user'],
            });

            if (!wallet) {
                  throw new NotFoundException('Wallet not found');
            }

            return wallet;
      }

      private async updateWalletBalance(
            queryRunner: QueryRunner,
            userId: string,
            amount: number,
            operation: 'add' | 'subtract',
      ): Promise<void> {
            const wallet = await queryRunner.manager.findOne(Wallet, {
                  where: { user: { id: userId } },
            });

            if (!wallet) {
                  throw new NotFoundException('Wallet not found');
            }

            if (operation === 'add') {
                  wallet.balance += amount;
                  wallet.totalEarned += amount;
            } else {
                  wallet.balance -= amount;
            }

            await queryRunner.manager.save(wallet);
      }

      async getFinancialStats(): Promise<any> {
            const [
                  totalIncome,
                  totalWithdrawn,
                  pendingWithdraws,
                  totalTransactions,
            ] = await Promise.all([
                  this.transactionRepository
                        .createQueryBuilder('transaction')
                        .select('SUM(transaction.amount)', 'total')
                        .where('transaction.type = :type AND transaction.status = :status', {
                              type: TransactionType.INCOME,
                              status: TransactionStatus.SUCCESS,
                        })
                        .getRawOne(),
                  this.transactionRepository
                        .createQueryBuilder('transaction')
                        .select('SUM(transaction.amount)', 'total')
                        .where('transaction.type = :type AND transaction.status = :status', {
                              type: TransactionType.WITHDRAW,
                              status: TransactionStatus.SUCCESS,
                        })
                        .getRawOne(),
                  this.transactionRepository
                        .createQueryBuilder('transaction')
                        .select('SUM(transaction.amount)', 'total')
                        .where('transaction.type = :type AND transaction.status = :status', {
                              type: TransactionType.WITHDRAW,
                              status: TransactionStatus.PENDING,
                        })
                        .getRawOne(),
                  this.transactionRepository.count(),
            ]);

            return {
                  totalIncome: parseFloat(totalIncome.total) || 0,
                  totalWithdrawn: parseFloat(totalWithdrawn.total) || 0,
                  pendingWithdraws: parseFloat(pendingWithdraws.total) || 0,
                  currentBalance: (parseFloat(totalIncome.total) || 0) - (parseFloat(totalWithdrawn.total) || 0),
                  totalTransactions,
            };
      }
}