import {
      IsString,
      IsDateString,
      IsNumber,
      IsEnum,
      IsOptional,
      IsObject,
      IsArray,
      Min,
      Max,
      MaxLength,
} from 'class-validator';
import { CampaignStatus } from '../entities/campaign.entity';

export class CreateCampaignDto {
      @IsString()
      @MaxLength(200)
      title: string;

      @IsString()
      description: string;

      @IsDateString()
      startDate: string;

      @IsDateString()
      endDate: string;

      @IsNumber()
      @Min(1)
      target: number;

      @IsNumber()
      @Min(0)
      reward: number;

      @IsEnum(CampaignStatus)
      @IsOptional()
      status?: CampaignStatus = CampaignStatus.DRAFT;

      @IsObject()
      @IsOptional()
      requirements?: {
            minFollowers?: number;
            platforms?: string[];
            skills?: string[];
            location?: string[];
      };

      @IsObject()
      @IsOptional()
      socialMediaTracking?: {
            hashtags?: string[];
            mentions?: string[];
            trackingUrls?: string[];
      };

      @IsString()
      @IsOptional()
      coverImage?: string;

      @IsArray()
      @IsString({ each: true })
      @IsOptional()
      tags?: string[];
}