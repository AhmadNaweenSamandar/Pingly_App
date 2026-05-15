// project-join-request.controller.ts
import { 
  Controller, 
  Post, 
  Get, 
  Patch, 
  Param, 
  Body, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { ProjectJoinRequestService } from './project-join-req.service';
import { CreateJoinRequestDto } from './dto/project-join-req.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Adjust path

@Controller('projects')
@UseGuards(JwtAuthGuard) // Secures every route in this controller
export class ProjectJoinRequestController {
  constructor(private readonly joinRequestService: ProjectJoinRequestService) {}

  // =========================================================================
  // 1. APPLY TO A PROJECT
  // POST /projects/join
  // =========================================================================
  @Post('join')
  async createRequest(
    @Request() req: any, // 🔐 Extracts the verified user from the JWT
    @Body() dto: CreateJoinRequestDto
  ) {
    // req.user.id comes directly from our JWT payload, not the frontend body
    return this.joinRequestService.createRequest(req.user.id, dto);
  }
}