// project-ideas.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service'; // path to our PrismaService
import { CreateProjectIdeaDto } from './dto/create-project-idea.dto';

@Injectable()
export class ProjectIdeasService {
  constructor(private prisma: PrismaService) {}

  async createIdea(userId: string, dto: CreateProjectIdeaDto) {
    try {
      const newIdea = await this.prisma.projectIdea.create({
        data: {
          title: dto.title,
          idea: dto.description, // Mapping frontend 'description' to DB 'idea'
          skills: dto.skills,
          userId: userId,
          // wishesCount naturally defaults to 0 as defined in our Prisma schema
        },
        // EFFICIENCY: Return the newly created item with the user data attached
        // so the frontend can instantly inject it into the UI feed state.
        include: {
          user: {
            select: {
              name: true, // name from user module
              profilePicture: true, //profile picture from user module
            },
          },
        },
      });

      return newIdea;
    } catch (error) {
      // Log the actual error to our server console for debugging
      console.error('Error creating project idea:', error);
      throw new InternalServerErrorException('Failed to post project idea');
    }
  }
}