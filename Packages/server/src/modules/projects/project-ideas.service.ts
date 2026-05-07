// project-ideas.service.ts
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service'; // path to our PrismaService
import { CreateProjectIdeaDto } from './dto/create-project-idea.dto';
import { FeedTab, GetProjectIdeasDto } from './dto/get-project-ideas.dto';

@Injectable()
export class ProjectIdeasService {
  constructor(private prisma: PrismaService) {}

  async createIdea(userId: string, dto: CreateProjectIdeaDto) {
    try {
      // SCALABILITY & INTEGRITY: Interactive Transaction
      // We use a transaction because if the Project creation fails, 
      // we want to rollback the Idea creation too. No orphaned data.
      const newIdea = await this.prisma.$transaction(async (tx) => {

        // 1. Create the Idea (The Pitch)
        const idea = await tx.projectIdea.create({
          data: {
            title: dto.title,
            idea: dto.description, // Mapping frontend 'description' to DB 'idea'
            skills: dto.skills,
            userId: userId,
            maxMembers: dto.maxMembers,
            status: 'OPEN',             // Explicitly set to OPEN for feed visibility
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

      // 2. Auto-Provision the Workspace (The Execution)
        // Creates an empty project workspace linked to this idea
        await tx.project.create({
          data: {
            title: dto.title,        // Inherit title from the idea
            description: dto.description, 
            projectIdeaId: idea.id,  // Link back to the parent idea
            ownerId: userId,         // Assumes your Project model tracks the owner
            // Note: We do NOT create any ProjectMember records yet. 
            // It stays at 0 members until requests are accepted.
          },
        });

      return newIdea;

      });

      return newIdea;
    } catch (error) {
      console.error('Error creating project idea and auto-provisioning workspace:', error);
      throw new InternalServerErrorException('Failed to post project idea');
    }
  }

  async getIdeas(userId: string, queryDto: GetProjectIdeasDto) {
    try {
      const { tab, cursor, limit = 20 } = queryDto;
      
      let whereClause: any = {};

    
      // --------------------------------------
      // ForYou Algorithmic Filter (The personalized project idea feed based on user skills)
      // Scalability in mind
      // --------------------------------------
      if (tab === FeedTab.FOR_YOU) {
        // Fetch the current user's skills
        const currentUser = await this.prisma.user.findUnique({
          where: { id: userId },
          select: { skills: true },
        });

        // If the user has skills, filter ideas that overlap with their skills
        if (currentUser && currentUser.skills.length > 0) {
          whereClause = {
            skills: { hasSome: currentUser.skills },
          };
        }
      }

      // EFFICIENCY: Cursor-based pagination query
      const ideas = await this.prisma.projectIdea.findMany({
        where: whereClause,
        take: limit + 1, // Fetch one extra to check if there is a next page
        ...(cursor && {
          cursor: { id: cursor },
          skip: 1, // Skip the cursor itself so we don't return duplicates
        }),
        orderBy: [
          { createdAt: 'desc' },
          { id: 'desc' } // Tie-breaker for deterministic sorting
        ],
        include: {
          user: {
            select: {
              name: true,
              profilePicture: true,
            },
          },

          // EFFICIENCY: Only fetch the wish if it belongs to the requesting user.
          // We only select the ID because we just need to know if the record exists.
          wishes: {
            where: { userId: userId },
            select: { id: true },
          },
        },
      });

      let nextCursor: string | null = null;
      
      // If we got more items than the limit, we have a next page
      if (ideas.length > limit) {
        const nextItem = ideas.pop(); // Remove the extra item
        if (nextItem) {
          nextCursor = nextItem.id; // Set the cursor for the next frontend request
        }
      }

      // MAINTAINABILITY: Flatten the payload for the frontend
      // Convert the array of wishes into a simple boolean and strip out the raw array
      const formattedIdeas = ideas.map((idea) => {
        const hasWished = idea.wishes.length > 0;
        const { wishes, ...ideaData } = idea; 
        return {
          ...ideaData,
          hasWished,
        };
      });

      return {
        data: formattedIdeas, // Changed to match our frontend expectation of page.data
        ideas,
        meta: {
          nextCursor, // Frontend will use this in its next fetch call
          hasMore: nextCursor !== null,
        },
      };
    } catch (error) {
      console.error('Error fetching project ideas:', error);
      throw new InternalServerErrorException('Failed to retrieve the feed');
    }
  }

  // --------------------------------------
  // SCALABILITY: Atomic Toggle Endpoint
  // --------------------------------------
  async toggleWish(userId: string, ideaId: string) {
    try {
      // 1. Verify the idea actually exists first
      const ideaExists = await this.prisma.projectIdea.findUnique({
        where: { id: ideaId },
        select: { id: true },
      });

      if (!ideaExists) {
        throw new NotFoundException('Project idea not found');
      }

      // 2. Check if the user has already wished for this idea
      const existingWish = await this.prisma.projectIdeaWish.findUnique({
        where: {
          userId_projectIdeaId: {
            userId: userId,
            projectIdeaId: ideaId,
          },
        },
      });

      if (existingWish) {
        // UN-WISH: User already wished, so we remove it and decrement
        await this.prisma.$transaction([
          this.prisma.projectIdeaWish.delete({
            where: { id: existingWish.id },
          }),
          this.prisma.projectIdea.update({
            where: { id: ideaId },
            data: { wishesCount: { decrement: 1 } },
          }),
        ]);

        return { message: 'Wish removed', hasWished: false };
      } else {
        // WISH: User hasn't wished, so we create it and increment
        await this.prisma.$transaction([
          this.prisma.projectIdeaWish.create({
            data: {
              userId: userId,
              projectIdeaId: ideaId,
            },
          }),
          this.prisma.projectIdea.update({
            where: { id: ideaId },
            data: { wishesCount: { increment: 1 } },
          }),
        ]);

        return { message: 'Wish added', hasWished: true };
      }
    } catch (error) {
      // Rethrow NestJS HTTP exceptions (like NotFoundException) so they aren't swallowed
      if (error instanceof NotFoundException) throw error;
      
      console.error('Error toggling wish:', error);
      throw new InternalServerErrorException('Failed to toggle wish');
    }
  }

}