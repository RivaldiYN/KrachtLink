import {
      IsString,
      IsEnum,
      IsDateString,
      IsOptional,
      IsNumber,
      IsArray,
      IsObject,
      Min,
      MaxLength,
} from 'class-validator';
import { EventType, EventStatus } from '../entities/event.entity';

export class CreateEventDto {
      @IsString()
      @MaxLength(200)
      title: string;

      @IsString()
      description: string;

      @IsEnum(EventType)
      type: EventType;

      @IsDateString()
      date: string;

      @IsDateString()
      @IsOptional()
      endDate?: string;

      @IsString()
      @IsOptional()
      location?: string;

      @IsString()
      @IsOptional()
      onlineLink?: string;

      @IsNumber()
      @IsOptional()
      @Min(1)
      maxParticipants?: number;

      @IsNumber()
      @IsOptional()
      @Min(0)
      price?: number;

      @IsEnum(EventStatus)
      @IsOptional()
      status?: EventStatus;

      @IsString()
      @IsOptional()
      bannerImage?: string;

      @IsArray()
      @IsString({ each: true })
      @IsOptional()
      tags?: string[];

      @IsArray()
      @IsObject({ each: true })
      @IsOptional()
      agenda?: Array<{
            time: string;
            title: string;
            description?: string;
            speaker?: string;
      }>;

      @IsArray()
      @IsObject({ each: true })
      @IsOptional()
      speakers?: Array<{
            name: string;
            title: string;
            bio: string;
            photo?: string;
      }>;

      @IsObject()
      @IsOptional()
      requirements?: {
            memberLevel?: string;
            skills?: string[];
            experience?: string;
      };
}