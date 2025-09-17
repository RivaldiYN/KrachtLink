import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { MediaLibrary } from './entities/media-library.entity';

@Module({
      imports: [TypeOrmModule.forFeature([MediaLibrary])],
      controllers: [MediaController],
      providers: [MediaService],
      exports: [MediaService],
})
export class MediaModule { }