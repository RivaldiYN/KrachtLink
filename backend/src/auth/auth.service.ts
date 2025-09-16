import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
      constructor(
            private readonly usersService: UsersService,
            private readonly jwtService: JwtService,
            private readonly configService: ConfigService,
      ) { }

      async register(registerDto: RegisterDto): Promise<{ user: User; token: string }> {
            const user = await this.usersService.create(registerDto);
            const token = this.generateToken(user);

            return { user, token };
      }

      async login(loginDto: LoginDto): Promise<{ user: User; token: string }> {
            const { email, password } = loginDto;

            const user = await this.usersService.findByEmail(email);
            if (!user) {
                  throw new UnauthorizedException('Invalid credentials');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                  throw new UnauthorizedException('Invalid credentials');
            }

            if (user.status !== 'active') {
                  throw new UnauthorizedException('Account is suspended');
            }

            // Update last login
            await this.usersService.updateLastLogin(user.id);

            const token = this.generateToken(user);
            return { user, token };
      }

      async googleLogin(googleUser: any): Promise<{ user: User; token: string }> {
            let user = await this.usersService.findByGoogleId(googleUser.googleId);

            if (!user) {
                  // Check if user exists with same email
                  user = await this.usersService.findByEmail(googleUser.email);

                  if (user) {
                        // Link Google account to existing user
                        user.googleId = googleUser.googleId;
                        await this.usersService.update(user.id, { googleId: googleUser.googleId });
                  } else {
                        // Create new user
                        user = await this.usersService.create({
                              name: googleUser.name,
                              email: googleUser.email,
                              password: Math.random().toString(36), // Random password for Google users
                              googleId: googleUser.googleId,
                        });
                  }
            }

            if (user.status !== 'active') {
                  throw new UnauthorizedException('Account is suspended');
            }

            // Update last login
            await this.usersService.updateLastLogin(user.id);

            const token = this.generateToken(user);
            return { user, token };
      }

      async validateUser(userId: string): Promise<User> {
            const user = await this.usersService.findOne(userId);
            if (!user || user.status !== 'active') {
                  throw new UnauthorizedException('User not found or inactive');
            }
            return user;
      }

      private generateToken(user: User): string {
            const payload = {
                  sub: user.id,
                  email: user.email,
                  role: user.role,
            };

            return this.jwtService.sign(payload);
      }

      async refreshToken(refreshToken: string): Promise<{ token: string }> {
            try {
                  const payload = this.jwtService.verify(refreshToken, {
                        secret: this.configService.get('JWT_REFRESH_SECRET'),
                  });

                  const user = await this.usersService.findOne(payload.sub);
                  const newToken = this.generateToken(user);

                  return { token: newToken };
            } catch (error) {
                  throw new UnauthorizedException('Invalid refresh token');
            }
      }

      async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
            const user = await this.usersService.findOne(userId);

            const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
            if (!isOldPasswordValid) {
                  throw new BadRequestException('Current password is incorrect');
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 12);
            await this.usersService.update(userId, { password: hashedNewPassword });
      }
}