import { 
  Injectable, 
  NotFoundException, 
  BadRequestException, 
  ForbiddenException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateJoinRequestDto } from './dto/project-join-req.dto';

@Injectable()
export class ProjectJoinRequestService {
  constructor(private prisma: PrismaService) {}

  // =========================================================================
  // 1. APPLY TO A PROJECT
  // =========================================================================
  async createRequest(userId: string, dto: CreateJoinRequestDto) {
    // 1. Verify Idea exists and is OPEN
    const idea = await this.prisma.projectIdea.findUnique({
      where: { id: dto.projectIdeaId },
      select: { id: true, userId: true, status: true },
    });

    if (!idea) throw new NotFoundException('Project idea not found');
    if (idea.status !== 'OPEN') throw new BadRequestException('This project is no longer accepting members');
    if (idea.userId === userId) throw new BadRequestException('You cannot apply to your own project');

    // 2. Prevent duplicate applications (Idempotency)
    const existingRequest = await this.prisma.projectJoinRequest.findUnique({
      where: {
        userId_projectIdeaId: {
          userId: userId,
          projectIdeaId: dto.projectIdeaId,
        },
      },
    });

    if (existingRequest) {
      throw new BadRequestException('You have already applied to this project');
    }

    // 3. Create the Request
    const request = await this.prisma.projectJoinRequest.create({
      data: {
        userId: userId,
        projectIdeaId: dto.projectIdeaId,
        userSkills: dto.skills,
        userMessage: dto.motivation,
        status: 'PENDING',
      },
    });

    // TODO: [NOTIFICATION HOOK] 
    // Alert the owner (idea.userId) that a new request was made by applicant (userId).

    return { message: 'Join request submitted successfully', request };
  }
  
  
  // =========================================================================
  // 2. GET PENDING REQUESTS (For the Owner's Dashboard)
  // =========================================================================
  async getPendingRequests(ownerId: string, projectIdeaId: string) {
    // Ensure the user requesting this data actually owns the idea
    const idea = await this.prisma.projectIdea.findUnique({
      where: { id: projectIdeaId },
      select: { userId: true },
    });

    if (!idea || idea.userId !== ownerId) {
      throw new ForbiddenException('You do not have permission to view these requests');
    }

    return this.prisma.projectJoinRequest.findMany({
      where: {
        projectIdeaId: projectIdeaId,
        status: 'PENDING',
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, profilePicture: true, university: true },
        },
      },
    });
  }


// =========================================================================
  // 3. ACCEPT REQUEST (The Core Workflow Transaction)
  // =========================================================================
  async acceptRequest(ownerId: string, requestId: string) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // 1. Fetch Request with all necessary relational data
        const request = await tx.projectJoinRequest.findUnique({
          where: { id: requestId },
          include: {
            projectIdea: {
              include: { project: true }, // We need the workspace ID
            },
          },
        });

        if (!request) throw new NotFoundException('Join request not found');
        if (request.projectIdea.userId !== ownerId) throw new ForbiddenException('Unauthorized action');
        if (request.status !== 'PENDING') throw new BadRequestException('This request is already processed');
        
        const workspaceId = request.projectIdea.project?.id;
        if (!workspaceId) throw new InternalServerErrorException('Critical Error: Linked workspace not found');

        // 2. Count current members (including the owner)
        const currentMemberCount = await tx.projectMember.count({
          where: { projectId: workspaceId },
        });

        if (currentMemberCount >= request.projectIdea.maxMembers) {
          throw new BadRequestException('Project has already reached maximum capacity');
        }

        // 3. Update Request Status
        const updatedRequest = await tx.projectJoinRequest.update({
          where: { id: requestId },
          data: { status: 'ACCEPTED' },
        });

        // 4. Add User to the Workspace (ProjectMember)
        await tx.projectMember.create({
          data: {
            userId: request.userId,
            projectId: workspaceId,
            role: 'MEMBER',
          },
        });

        // 5. Check if project is now full. If so, hide it from the feed.
        if (currentMemberCount + 1 >= request.projectIdea.maxMembers) {
          await tx.projectIdea.update({
            where: { id: request.projectIdeaId },
            data: { status: 'FILLED' },
          });
        }

        // TODO: [NOTIFICATION HOOK] 
        // Alert the applicant (request.userId) that they were accepted into the project!

        return { message: 'Request accepted successfully' };
      });
    } catch (error) {
      // Re-throw known HTTP exceptions
      if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ForbiddenException) {
        throw error;
      }
      console.error('Error accepting request:', error);
      throw new InternalServerErrorException('Failed to process acceptance');
    }
  }

    // =========================================================================
  // 4. REJECT REQUEST
  // =========================================================================
  async rejectRequest(ownerId: string, requestId: string) {
    const request = await this.prisma.projectJoinRequest.findUnique({
      where: { id: requestId },
      include: { projectIdea: true },
    });

    if (!request) throw new NotFoundException('Join request not found');
    if (request.projectIdea.userId !== ownerId) throw new ForbiddenException('Unauthorized action');

    await this.prisma.projectJoinRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' },
    });

    // Note: Usually, we don't send notifications for rejections to avoid a negative UX, 

    return { message: 'Request dismissed' };
  }


}