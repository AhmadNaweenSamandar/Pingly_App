import { IsOptional, IsEnum, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export enum FeedTab {
  LATEST = 'latest',
  FOR_YOU = 'forYou',
}

export class GetProjectIdeasDto {
  @IsOptional()
  @IsEnum(FeedTab)
  tab?: FeedTab = FeedTab.LATEST; // Defaults to the chronological feed

  // --- ARCHITECTURAL UPDATE: Cursor Pagination ---
  // We removed 'page' (Offset Pagination) and replaced it with 'cursor'.
  // This will accept the CUID of the last project idea the user saw on their screen.
  // the cursor pagination works as follows: suppose user currently scrolling random 20 project ideas
  // when they reach the last project idea on the screen, the frontend will take the CUID of that last project idea and sendit as the 'cursor' in the next API request. 
  // The backend will then use that cursor to fetch the next set of project ideas that come after it in the database, ensuring a smooth and efficient infinite scrolling experience without the pitfalls of offset pagination.
  @IsOptional()
  @IsString()
  cursor?: string; 

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20; // We keep a strict limit to protect database memory
}