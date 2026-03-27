// server/src/modules/user/dto/update-profile.dto.ts
import { IsString, IsArray, IsOptional } from 'class-validator';

// for now profile picture and social images and avatar is skipped because we need to use another tool to store the images first somewhere in database
// and then generate the link and store it in the schema
// the id, name and password is already saved by auth module
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