import { Injectable, InternalServerErrorException, NotFoundException, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service'; // Adjust path as needed
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import * as DOMPurify from 'isomorphic-dompurify'; // For backend HTML sanitization

@Injectable()
export class DiscussionService {
  constructor(private prisma: PrismaService) {}

  // --- 1. Create a New Discussion ---
  async createDiscussion(
    userId: string, 
    dto: CreateDiscussionDto, 
    files: Express.Multer.File[]
  ) {
    try {
      // 1. Map the saved files to URL strings for the database
      // If no files, it defaults to an empty array
      const imageUrls = files?.map(file => `/uploads/discussion/${file.filename}`) || [];

      // 2. Sanitize HTML on the backend (Zero Trust - never trust the frontend)
      const cleanContent = DOMPurify.sanitize(dto.content);

      // 3. Save to database
      const discussion = await this.prisma.discussion.create({
        data: {
          title: dto.title,
          content: cleanContent,
          images: imageUrls,
          authorId: userId,
        },
        // Return the author info so the frontend can immediately render it
        include: {
          author: {
            select: { id: true, name: true, profilePicture: true }
          }
        }
      });

      return discussion;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create discussion');
    }
  }

  // --- 2. Create a Reply (The Scalability Win) ---
  async createReply(userId: string, discussionId: number, dto: CreateReplyDto) {
    // We use a Prisma Transaction to ensure data integrity.
    // If the reply fails to save, the count won't increment.
    try {
      return await this.prisma.$transaction(async (tx) => {
        
        // 1. Verify the discussion actually exists
        const discussion = await tx.discussion.findUnique({
          where: { id: discussionId }
        });

        if (!discussion) {
          throw new NotFoundException('Discussion not found');
        }

        // 2. Sanitize the reply content
        const cleanContent = DOMPurify.sanitize(dto.content);

        // 3. Create the reply
        const reply = await tx.discussionReply.create({
          data: {
            content: cleanContent,
            discussionId: discussionId,
            authorId: userId,
            parentId: dto.parentId || null, // Handles Level 1 vs Level 2 logic
          },
          include: {
            author: {
              select: { id: true, name: true, profilePicture: true }
            }
          }
        });

        // 4. Increment the denormalized reply count on the parent discussion
        await tx.discussion.update({
          where: { id: discussionId },
          data: { replyCount: { increment: 1 } }
        });

        return reply;
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to post reply');
    }
  }
}