// server/src/modules/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateProfile(userId: string, data: UpdateProfileDto) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...data,
          // Safety net: cast string to Date so Prisma doesn't crash during testing
          ...(data.dob && { dob: new Date(data.dob) }),
        },
      });

      // Never return the password hash to the frontend
      delete updatedUser.password;
      return updatedUser;
      
    } catch (error) {
      throw new NotFoundException('User not found or update failed');
    }
  }
}