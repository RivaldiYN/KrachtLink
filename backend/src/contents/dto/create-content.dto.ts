import {
      IsString,
      IsEnum,
      IsOptional,
      IsArray,
      IsObject,
      MaxLength,
} from 'class-validator';
import { ContentType, ContentStatus } from '../entities/content.entity';

export class CreateContentDto {
      @IsEnum(ContentType)
      type: ContentType;

      @IsString()
      @MaxLength(300)
      title: string;

      @IsString()
      body: string;

      @IsString()
      @IsOptional()
      excerpt?: string;

      @IsString()
      @IsOptional()
      mediaUrl?: string;

      @IsArray()
      @IsString({ each: true })
      @IsOptional()
      images?: string[];

      @IsArray()
      @IsString({ each: true })
      @IsOptional()
      tags?: string[];

      @IsEnum(ContentStatus)
      @IsOptional()
      status?: ContentStatus = ContentStatus.DRAFT;

      @IsObject()
      @IsOptional()
      seoMeta?: {
            metaTitle?: string;
            metaDescription?: string;
            keywords?: string[];
            ogImage?: string;
      };
}