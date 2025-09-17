import { PartialType } from '@nestjs/mapped-types';
import { CreateContentDto } from './create-content.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateContentDto extends PartialType(CreateContentDto) {
      @IsString()
      @IsOptional()
      slug?: string;
}