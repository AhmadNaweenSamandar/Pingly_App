import { IsString, IsArray, IsNotEmpty, ArrayNotEmpty } from 'class-validator';

export class CreateJoinRequestDto {
  @IsString()
  @IsNotEmpty()
  projectIdeaId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  skills: string[];

  @IsString()
  @IsNotEmpty()
  motivation: string;
}