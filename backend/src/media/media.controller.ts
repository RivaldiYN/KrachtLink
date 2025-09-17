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
import { MediaService } from './media.service';
import { UploadMediaDto } from './dto/upload-media.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { MediaType } from './entities/media-library.entity';

@Controller('media')
@UseGuards(JwtAuthGuard)
export class MediaController {
      constructor(private readonly mediaService: MediaService) { }

      @Post('upload')
      @UseInterceptors(
            FileInterceptor('file', {
                  storage: diskStorage({
                        destination: './uploads',
                        filename: (req, file, cb) => {
                              const randomName = Array(32)
                                    .fill(null)
                                    .map(() => Math.round(Math.random() * 16).toString(16))
                                    .join('');
                              cb(null, `${randomName}${extname(file.originalname)}`);
                        },
                  }),
                  limits: {
                        fileSize: 50 * 1024 * 1024, // 50MB
                  },
            }),
      )
      uploadMedia(
            @UploadedFile() file: Express.Multer.File,
            @Body() uploadMediaDto: UploadMediaDto,
            @Request() req,
      ) {
            return this.mediaService.uploadMedia(file, uploadMediaDto, req.user.id);
      }

      @Get()
      findAll(
            @Query('page') page: string = '1',
            @Query('limit') limit: string = '20',
            @Query('type') type?: MediaType,
            @Query('userId') userId?: string,
      ) {
            return this.mediaService.findAll(+page, +limit, type, userId);
      }

      @Get('stats')
      @UseGuards(RolesGuard)
      @Roles(UserRole.SUPER_ADMIN)
      getStats() {
            return this.mediaService.getStorageStats();
      }

      @Get(':id')
      findOne(@Param('id') id: string) {
            return this.mediaService.findOne(id);
      }

      @Patch(':id/metadata')
      updateMetadata(
            @Param('id') id: string,
            @Body('metadata') metadata: any,
      ) {
            return this.mediaService.updateMetadata(id, metadata);
      }

      @Delete(':id')
      remove(@Param('id') id: string) {
            return this.mediaService.remove(id);
      }
}