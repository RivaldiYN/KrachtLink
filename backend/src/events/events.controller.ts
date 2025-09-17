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
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { EventStatus, EventType } from './entities/event.entity';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
      constructor(private readonly eventsService: EventsService) { }

      @Post()
      @UseGuards(RolesGuard)
      @Roles(UserRole.SUPER_ADMIN)
      create(@Body() createEventDto: CreateEventDto, @Request() req) {
            return this.eventsService.create(createEventDto, req.user.id);
      }

      @Get()
      findAll(
            @Query('page') page: string = '1',
            @Query('limit') limit: string = '10',
            @Query('status') status?: EventStatus,
            @Query('type') type?: EventType,
      ) {
            return this.eventsService.findAll(+page, +limit, status, type);
      }

      @Get('upcoming')
      findUpcoming(@Query('limit') limit: string = '10') {
            return this.eventsService.findUpcoming(+limit);
      }

      @Get('stats')
      @UseGuards(RolesGuard)
      @Roles(UserRole.SUPER_ADMIN)
      getStats() {
            return this.eventsService.getEventStats();
      }

      @Get(':id')
      findOne(@Param('id') id: string) {
            return this.eventsService.findOne(id);
      }

      @Patch(':id')
      @UseGuards(RolesGuard)
      @Roles(UserRole.SUPER_ADMIN)
      update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
            return this.eventsService.update(id, updateEventDto);
      }

      @Post(':id/join')
      joinEvent(@Param('id') id: string, @Request() req) {
            return this.eventsService.joinEvent(id, req.user.id);
      }

      @Delete(':id/leave')
      leaveEvent(@Param('id') id: string, @Request() req) {
            return this.eventsService.leaveEvent(id, req.user.id);
      }

      @Patch(':id/status')
      @UseGuards(RolesGuard)
      @Roles(UserRole.SUPER_ADMIN)
      updateStatus(
            @Param('id') id: string,
            @Body('status') status: EventStatus,
      ) {
            return this.eventsService.updateStatus(id, status);
      }

      @Post(':id/banner')
      @UseGuards(RolesGuard)
      @Roles(UserRole.SUPER_ADMIN)
      @UseInterceptors(
            FileInterceptor('banner', {
                  storage: diskStorage({
                        destination: './uploads/events',
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
            }),
      )
      async uploadBanner(
            @Param('id') id: string,
            @UploadedFile() file: Express.Multer.File,
      ) {
            const bannerUrl = `/uploads/events/${file.filename}`;
            return this.eventsService.update(id, { bannerImage: bannerUrl });
      }

      @Delete(':id')
      @UseGuards(RolesGuard)
      @Roles(UserRole.SUPER_ADMIN)
      remove(@Param('id') id: string) {
            return this.eventsService.remove(id);
      }
}