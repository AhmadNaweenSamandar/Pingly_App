// server/src/modules/user/dto/update-profile.dto.ts
import { IsString, IsArray, IsOptional } from 'class-validator';

// for now profile picture and social images and avatar is skipped
// and we do not need to include them in the DTO because they are handled separately by Multer and not sent as part of the JSON body.
// when ever the POST data is send by API calls from the front end, the data is filtered to text data and images
// the text data is sent as JSON and validated against this DTO, while the images are processed by Multer and their paths are sent separately to the service layer by @UploadedFiles() decorator in the controller. 
// This separation allows us to keep our DTO focused on validating just the text fields, while still being able to handle file uploads effectively.
export class UpdateProfileDto {
  // --- STEP 1: Identity ---
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  dob?: string; 

  @IsOptional()
  @IsString()
  university?: string;

  @IsOptional()
  @IsString()
  discipline?: string;

  @IsOptional()
  @IsString()
  expectedGraduationYear?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  matchWithDisciplines?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  matchWithYears?: string[];

  // --- STEP 2: Professional ---
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  industriesOfInterest?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  professionalGoals?: string[];

  @IsOptional()
  @IsString()
  linkedin?: string;

  @IsOptional()
  @IsString()
  github?: string;

  @IsOptional()
  @IsString()
  portfolioWebsite?: string;

  // --- STEP 3: Social ---
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hobbies?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  campusInvolvement?: string[];

  @IsOptional()
  @IsString()
  personalityType?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  lookingFor?: string[]; 

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  socialGoals?: string[];
}