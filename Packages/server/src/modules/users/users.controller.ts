// server/src/modules/user/user.controller.ts
import { Controller, Patch, Body, Request, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @Request() req, 
    @Body() updateProfileDto: UpdateProfileDto 
  ) {
    // Extract the secure ID from the token payload
    const userId = req.user.id; 
    
    return this.userService.updateProfile(userId, updateProfileDto);
  }
}