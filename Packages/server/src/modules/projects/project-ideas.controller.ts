// project-ideas.controller.ts
import { Controller, Post, Body, UseGuards, Req, Get, Query } from '@nestjs/common';
import { ProjectIdeasService } from './project-ideas.service';
import { CreateProjectIdeaDto } from './dto/create-project-idea.dto';
// Replace with your actual auth guard implementation
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetProjectIdeasDto } from './dto/get-project-ideas.dto';

@Controller('project-ideas')
export class ProjectIdeasController {
  constructor(private readonly projectIdeasService: ProjectIdeasService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // Protects the route, ensures user is logged in
  async createProjectIdea(
    @Body() createIdeaDto: CreateProjectIdeaDto,
    @Req() req: any, // The request object containing the user context
  ) {
    // Extract the user ID from the authenticated request
    const userId = req.user.id; 

    // Pass data to the service layer
    const result = await this.projectIdeasService.createIdea(userId, createIdeaDto);
    
    return {
      message: 'Project idea posted successfully',
      data: result,
    };
  }

  // === NEW GET ROUTE FOR FETCHING PROJECT IDEAS WITH CURSOR PAGINATION AND "FOR YOU" FILTER ===
  @Get()
  @UseGuards(JwtAuthGuard) // Ensure only authenticated users can access the feed
  async getProjectIdeas(
    @Query() queryDto: GetProjectIdeasDto,
    @Req() req: any, 
  ) {
    const userId = req.user.id; 

    const result = await this.projectIdeasService.getIdeas(userId, queryDto); // result contains both the ideas and the nextCursor for pagination
    
    return {
      message: 'Feed retrieved successfully',
      data: result.ideas,
      meta: result.meta, // Contains the nextCursor for infinite scroll
    };
  }
}