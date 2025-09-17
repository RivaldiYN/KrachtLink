import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumsController } from './forums.controller';
import { ForumsService } from './forums.service';
import { Forum } from './entities/forum.entity';
import { ForumReply } from './entities/forum-reply.entity';

@Module({
      imports: [TypeOrmModule.forFeature([Forum, ForumReply])],
      controllers: [ForumsController],
      providers: [ForumsService],
      exports: [ForumsService],
})
export class ForumsModule { }