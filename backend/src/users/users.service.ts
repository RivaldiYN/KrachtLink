import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole, UserStatus } from './entities/user.entity';
import { Wallet } from '../transactions/entities/wallet.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
      constructor(
            @InjectRepository(User)
            private readonly userRepository: Repository<User>,
            @InjectRepository(Wallet)
            private readonly walletRepository: Repository<Wallet>,
      ) { }

      async create(createUserDto: CreateUserDto): Promise<User> {
            // Check if user already exists
            const existingUser = await this.userRepository.findOne({
                  where: { email: createUserDto.email },
            });

            if (existingUser) {
                  throw new BadRequestException('User with this email already exists');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

            // Create user
            const user = this.userRepository.create({
                  ...createUserDto,
                  password: hashedPassword,
            });

            const savedUser = await this.userRepository.save(user);

            // Create wallet for user
            const wallet = this.walletRepository.create({
                  user: savedUser,
                  balance: 0,
            });
            await this.walletRepository.save(wallet);

            return savedUser;
      }

      async findAll(page: number = 1, limit: number = 10): Promise<{ users: User[]; total: number }> {
            const [users, total] = await this.userRepository.findAndCount({
                  take: limit,
                  skip: (page - 1) * limit,
                  order: { createdAt: 'DESC' },
                  relations: ['wallet'],
            });

            return { users, total };
      }

      async findOne(id: string): Promise<User> {
            const user = await this.userRepository.findOne({
                  where: { id },
                  relations: ['wallet', 'campaignMemberships', 'transactions'],
            });

            if (!user) {
                  throw new NotFoundException('User not found');
            }

            return user;
      }

      async findByEmail(email: string): Promise<User | null> {
            return this.userRepository.findOne({
                  where: { email },
                  relations: ['wallet'],
            });
      }

      async findByGoogleId(googleId: string): Promise<User | null> {
            return this.userRepository.findOne({
                  where: { googleId },
                  relations: ['wallet'],
            });
      }

      async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
            const user = await this.findOne(id);

            if (updateUserDto.password) {
                  updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12);
            }

            Object.assign(user, updateUserDto);
            return this.userRepository.save(user);
      }

      async updateStatus(id: string, status: UserStatus): Promise<User> {
            const user = await this.findOne(id);
            user.status = status;
            return this.userRepository.save(user);
      }

      async updateLastLogin(id: string): Promise<void> {
            await this.userRepository.update(id, {
                  lastLoginAt: new Date(),
            });
      }

      async remove(id: string): Promise<void> {
            const user = await this.findOne(id);
            await this.userRepository.softDelete(id);
      }

      async getStats(): Promise<{
            total: number;
            active: number;
            suspended: number;
            admins: number;
            members: number;
      }> {
            const [total, active, suspended, admins, members] = await Promise.all([
                  this.userRepository.count(),
                  this.userRepository.count({ where: { status: UserStatus.ACTIVE } }),
                  this.userRepository.count({ where: { status: UserStatus.SUSPENDED } }),
                  this.userRepository.count({ where: { role: UserRole.SUPER_ADMIN } }),
                  this.userRepository.count({ where: { role: UserRole.MEMBER } }),
            ]);

            return { total, active, suspended, admins, members };
      }
}