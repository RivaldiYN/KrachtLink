import {
      IsString,
      IsEnum,
      IsOptional,
      IsArray,
      IsBoolean,
      MaxLength,
} from 'class-validator';
import { ForumCategory } from '../entities/forum.entity';

export class CreateForumDto {
      @IsString()
      @MaxLength(300)
      title: string;

      @IsString()
      content: string;

      @IsEnum(ForumCategory)
      @IsOptional()
      category?: ForumCategory = ForumCategory.GENERAL;

      @IsArray()
      @IsString({ each: true })
      @IsOptional()
      tags?: string[];

      @IsBoolean()
      @IsOptional()
      isPinned?: boolean = false;

      @IsBoolean()
      @IsOptional()
      isLocked?: boolean = false;
}