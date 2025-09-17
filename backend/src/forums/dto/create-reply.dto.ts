import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateReplyDto {
      @IsString()
      replyContent: string;

      @IsBoolean()
      @IsOptional()
      isAnswer?: boolean = false;
}