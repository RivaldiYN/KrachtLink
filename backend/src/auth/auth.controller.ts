import {
      Controller,
      Post,
      Body,
      UseGuards,
      Get,
      Request,
      Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
      constructor(private readonly authService: AuthService) { }

      @Post('register')
      register(@Body() registerDto: RegisterDto) {
            return this.authService.register(registerDto);
      }

      @Post('login')
      login(@Body() loginDto: LoginDto) {
            return this.authService.login(loginDto);
      }

      @Get('google')
      @UseGuards(AuthGuard('google'))
      googleAuth() {
            // Initiates Google OAuth flow
      }

      @Get('google/callback')
      @UseGuards(AuthGuard('google'))
      googleAuthCallback(@Request() req) {
            return this.authService.googleLogin(req.user);
      }

      @Post('refresh-token')
      refreshToken(@Body('refreshToken') refreshToken: string) {
            return this.authService.refreshToken(refreshToken);
      }

      @Get('me')
      @UseGuards(JwtAuthGuard)
      getProfile(@Request() req) {
            return req.user;
      }

      @Patch('change-password')
      @UseGuards(JwtAuthGuard)
      changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
            return this.authService.changePassword(
                  req.user.id,
                  changePasswordDto.oldPassword,
                  changePasswordDto.newPassword,
            );
      }
}