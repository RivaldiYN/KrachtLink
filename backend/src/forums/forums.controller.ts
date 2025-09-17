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
} from '@nestjs/common';
import { ForumsService } from './forums.service';
import { CreateForumDto } from './dto/create-forum.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ForumCategory } from './entities/forum.entity';

@Controller('forums')
@UseGuards(JwtAuthGuard)
export class ForumsController {
      constructor(private readonly forumsService: ForumsService) { }

      @Post()
      createForum(@Body() createForumDto: CreateForumDto, @Request() req) {
            return this.forumsService.createForum(createForumDto, req.user.id);
      }

      @Get()
      findAll(
            @Query('page') page: string = '1',
            @Query('limit') limit: string = '10',
            @Query('category') category?: ForumCategory,
            @Query('search') search?: string,
      ) {
            return this.forumsService.findAllForums(+page, +limit, category, search);
      }

      @Get('stats')
      @UseGuards(RolesGuard)
      @Roles(UserRole.SUPER_ADMIN)
      getStats() {
            return this.forumsService.getForumStats();
      }

      @Get(':id')
      findOne(@Param('id') id: string) {
            return this.forumsService.findOneForum(id);
      }

      @Post(':id/replies')
      createReply(
            @Param('id') id: string,
            @Body() createReplyDto: CreateReplyDto,
            @Request() req,
      ) {
            return this.forumsService.createReply(id, createReplyDto, req.user.id);
      }

      @Patch(':id')
      updateForum(
            @Param('id') id: string,
            @Body() updateData: any,
            @Request() req,
      ) {
            return this.forumsService.updateForum(id, updateData, req.user.id);
      }

      @Delete(':id')
      deleteForum(@Param('id') id: string, @Request() req) {
            return this.forumsService.deleteForum(id, req.user.id);
      }

      @Delete('replies/:id')
      deleteReply(@Param('id') id: string, @Request() req) {
            return this.forumsService.deleteReply(id, req.user.id);
      }

      @Post(':id/like')
      likeForum(@Param('id') id: string) {
            return this.forumsService.likeForum(id);
      }

      @Post('replies/:id/like')
      likeReply(@Param('id') id: string) {
            return this.forumsService.likeReply(id);
      }

      @Patch(':id/pin')
      @UseGuards(RolesGuard)
      @Roles(UserRole.SUPER_ADMIN)
      pinForum(@Param('id') id: string) {
            return this.forumsService.pinForum(id);
      }

      @Patch(':id/lock')
      @UseGuards(RolesGuard)
      @Roles(UserRole.SUPER_ADMIN)
      lockForum(@Param('id') id: string) {
            return this.forumsService.lockForum(id);
      }
}