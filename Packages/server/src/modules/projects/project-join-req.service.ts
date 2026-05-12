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
}