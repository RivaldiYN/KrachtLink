import { IsOptional, IsObject } from 'class-validator';

export class UploadMediaDto {
      @IsObject()
      @IsOptional()
      metadata?: {
            width?: number;
            height?: number;
            duration?: number;
            alt?: string;
            caption?: string;
      };
}