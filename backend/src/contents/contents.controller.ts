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
      UploadedFiles,
      UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ContentsService } from './contents.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ContentType, ContentStatus } from './entities/content.entity';

@Controller('contents')
export class ContentsController {
      constructor(private readonly contentsService: ContentsService) { }

      @Post()
      @UseGuards(JwtAuthGuard, RolesGuard)
      @Roles(UserRole.SUPER_ADMIN)
      create(@Body() createContentDto: CreateContentDto, @Request() req) {
            return this.contentsService.create(createContentDto, req.user.id);
      }

      @Get()
      findAll(
            @Query('page') page: string = '1',
            @Query('limit') limit: string = '10',
            @Query('type') type?: ContentType,
            @Query('status') status?: ContentStatus,
      ) {
            return this.contentsService.findAll(+page, +limit, type, status);
      }

      @Get('published')
      findPublished(
            @Query('page') page: string = '1',
            @Query('limit') limit: string = '10',
            @Query('type') type?: ContentType,
      ) {
            return this.contentsService.findPublished(+page, +limit, type);
      }

      @Get('popular')
      getPopular(@Query('limit') limit: string = '10') {
            return this.contentsService.getPopularContent(+limit);
      }

      @Get('recent-blogs')
      getRecentBlogs(@Query('limit') limit: string = '5') {
            return this.contentsService.getRecentBlogs(+limit);
      }

      @Get('search')
      search(
            @Query('q') query: string,
            @Query('page') page: string = '1',
            @Query('limit') limit: string = '10',
      ) {
            return this.contentsService.searchContent(query, +page, +limit);
      }

      @Get('type/:type')
      findByType(@Param('type') type: ContentType) {
            return this.contentsService.findByType(type);
      }

      @Get(':id')
      findOne(@Param('id') id: string) {
            return this.contentsService.findOne(id);
      }

      @Get('slug/:slug')
      findBySlug(@Param('slug') slug: string) {
            return this.contentsService.findBySlug(slug);
      }

      @Patch(':id')
      @UseGuards(JwtAuthGuard, RolesGuard)
      @Roles(UserRole.SUPER_ADMIN)
      update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
            return this.contentsService.update(id, updateContentDto);
      }

      @Post(':id/images')
      @UseGuards(JwtAuthGuard, RolesGuard)
      @Roles(UserRole.SUPER_ADMIN)
      @UseInterceptors(
            FilesInterceptor('images', 10, {
                  storage: diskStorage({
                        destination: './uploads/contents',
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
                        fileSize: 5 * 1024 * 1024, // 5MB per file
                  },
            }),
      )
      async uploadImages(
            @Param('id') id: string,
            @UploadedFiles() files: Express.Multer.File[],
      ) {
            const imageUrls = files.map(file => `/uploads/contents/${file.filename}`);
            return this.contentsService.update(id, { images: imageUrls });
      }

      @Post(':id/like')
      likeContent(@Param('id') id: string) {
            return this.contentsService.incrementLike(id);
      }

      @Post(':id/share')
      shareContent(@Param('id') id: string) {
            return this.contentsService.incrementShare(id);
      }

      @Delete(':id')
      @UseGuards(JwtAuthGuard, RolesGuard)
      @Roles(UserRole.SUPER_ADMIN)
      remove(@Param('id') id: string) {
            return this.contentsService.remove(id);
      }
}