import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReplyDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  // [MAINTAINABILITY WIN] Because FormData sends numbers as strings (e.g., "1"), 
  // @Type safely transforms it into an Integer before validation runs.
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  parentId?: number; 
}