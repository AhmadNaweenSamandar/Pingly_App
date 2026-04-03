// server/src/modules/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

// Helper function to force single strings into an array
const ensureArray = (value: any): string[] | undefined => {
  if (value === undefined || value === null) return undefined;
  if (Array.isArray(value)) return value;
  return [String(value)]; // Added String() to guarantee it is typed correctly
};


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

  async updateProfile(userId: string, updateData: UpdateProfileDto, filePaths: any) {


    // 1. Merge the text data and the new image paths into one object
    const baseData = {
      ...updateData,
      ...filePaths, 
    };


    // 1. Normalize all array fields from the incoming text data
    // This catches single selections that FormData sends as strings and wraps them in arrays
    const dataToSave = {
      ...baseData,
      matchWithDisciplines: ensureArray(baseData.matchWithDisciplines),
      matchWithYears: ensureArray(baseData.matchWithYears),
      skills: ensureArray(baseData.skills),
      industriesOfInterest: ensureArray(baseData.industriesOfInterest),
      professionalGoals: ensureArray(baseData.professionalGoals),
      hobbies: ensureArray(baseData.hobbies),
      campusInvolvement: ensureArray(baseData.campusInvolvement),
      socialGoals: ensureArray(baseData.socialGoals),
      lookingFor: ensureArray(baseData.lookingFor),
    };


    // 2. The Pending "Gotcha": Handle Date formatting
    // If the frontend sent a Date of Birth, convert the string (e.g., "2002-05-14") 
    // into a proper JavaScript Date object so Prisma doesn't crash.
    if (dataToSave.dob) {
      dataToSave.dob = new Date(dataToSave.dob);
    }

    // 3. Update the database
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: dataToSave,
    });

    // 4. Strip out the password for security before sending it back to React
    const { password, ...safeUserData } = updatedUser;
    
    return safeUserData;

  }
}