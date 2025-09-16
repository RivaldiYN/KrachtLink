import {
      Controller,
      Get,
      Post,
      Body,
      Patch,
      Param,
      Delete,
      Query,
      UseGuards,
      Request,
      UploadedFile,
      UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole, UserStatus } from './entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
      constructor(private readonly usersService: UsersService) { }

      @Post()
      @UseGuards(RolesGuard)
      @Roles(UserRole.SUPER_ADMIN)
      create(@Body() createUserDto: CreateUserDto) {
            return this.usersService.create(createUserDto);
      }

      @Get()
      @UseGuards(RolesGuard)
      @Roles(UserRole.SUPER_ADMIN)
      findAll(
            @Query('page') page: string = '1',
            @Query('limit') limit: string = '10',
      ) {
            return this.usersService.findAll(+page, +limit);
      }

      @Get('stats')
      @UseGuards(RolesGuard)
      @Roles(UserRole.SUPER_ADMIN)
      getStats() {
            return this.usersService.getStats();
      }

      @Get('profile')
      getProfile(@Request() req) {
            return this.usersService.findOne(req.user.id);
      }

      @Get(':id')
      findOne(@Param('id') id: string) {
            return this.usersService.findOne(id);
      }

      @Patch('profile')
      updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
            return this.usersService.update(req.user.id, updateUserDto);
      }

      @Patch(':id')
      @UseGuards(RolesGuard)
      @Roles(UserRole.SUPER_ADMIN)
      update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
            return this.usersService.update(id, updateUserDto);
      }

      @Patch(':id/status')
      @UseGuards(RolesGuard)
      @Roles(UserRole.SUPER_ADMIN)
      updateStatus(
            @Param('id') id: string,
            @Body('status') status: UserStatus,
      ) {
            return this.usersService.updateStatus(id, status);
      }

      @Post('avatar')
      @UseInterceptors(
            FileInterceptor('avatar', {
                  storage: diskStorage({
                        destination: './uploads/avatars',
                        filename: (req, file, cb) => {
                              const randomName = Array(32)
                                    .fill(null)
                                    .map(() => Math.round(Math.random() * 16).toString(16))
                                    .join('');
                              cb(null, `${randomName}${extname(file.originalname)}`);
                        },
                  }),
                  fileFilter: (req, file, cb) => {
                        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                              return cb(new Error('Only image files are allowed!'), false);
                        }
                        cb(null, true);
                  },
                  limits: {
                        fileSize: 5 * 1024 * 1024, // 5MB
                  },
            }),
      )
      async uploadAvatar(
            @Request() req,
            @UploadedFile() file: Express.Multer.File,
      ) {
            const avatarUrl = `/uploads/avatars/${file.filename}`;
            return this.usersService.update(req.user.id, { avatar: avatarUrl });
      }

      @Delete(':id')
      @UseGuards(RolesGuard)
      @Roles(UserRole.SUPER_ADMIN)
      remove(@Param('id') id: string) {
            return this.usersService.remove(id);
      }
}