// project-ideas.controller.ts
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ProjectIdeasService } from './project-ideas.service';
import { CreateProjectIdeaDto } from './dto/create-project-idea.dto';
// Replace with your actual auth guard implementation
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
}