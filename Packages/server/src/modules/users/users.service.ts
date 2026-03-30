// server/src/modules/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // === NEW METHOD ===
  async getUserProfile(userId: string) {
    // 1. Ask Prisma for the user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    // 2. Safety check
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 3. Strip out the password for security
    const { password, ...safeUserData } = user;
    
    // 4. Send the rest of the data back to React
    return safeUserData;
  }

  async updateProfile(userId: string, data: UpdateProfileDto, filePaths: any) {
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