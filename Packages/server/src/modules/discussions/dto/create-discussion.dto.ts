import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateDiscussionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255) // [SECURITY WIN] Prevents database overflow attacks on the VARCHAR column
  title: string;

  @IsString()
  @IsNotEmpty()
  // Note: We will sanitize this HTML string in the Service layer (Zero Trust policy)
  content: string; 

  // We do not include 'images' here because Multer handles the binary files separately
  // We do not include 'authorId' here because we will extract it securely from the JWT token
}