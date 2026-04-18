// create-project-idea.dto.ts
import { IsString, IsArray, IsNotEmpty, MaxLength, ArrayNotEmpty } from 'class-validator';

export class CreateProjectIdeaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100) // Prevent malicious massive text blocks
  title: string;  // we map this to 'title' in the database

  @IsString()
  @IsNotEmpty()
  @MaxLength(3000)
  description: string; // We map this to 'idea' in the database

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  skills: string[]; // Validates that it's an array of strings
}