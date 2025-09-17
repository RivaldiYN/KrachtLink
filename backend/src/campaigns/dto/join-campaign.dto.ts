import { IsString, IsOptional } from 'class-validator';

export class JoinCampaignDto {
      @IsString()
      @IsOptional()
      notes?: string;
}