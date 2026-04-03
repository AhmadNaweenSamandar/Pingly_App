// server/src/modules/user/user.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

    // --- DEBUGGING: Print exactly what NestJS received from the frontend ---
    console.log("Raw incoming updateData:", updateData);
    console.log("Raw incoming filePaths:", filePaths);




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

    // 2. The Date Formatting & Age Verification
    if (dataToSave.dob !== undefined) {
      if (dataToSave.dob === '' || dataToSave.dob === 'null') {
        dataToSave.dob = null; 
      } else {
        const parsedDate = new Date(dataToSave.dob);
        
        if (!isNaN(parsedDate.getTime())) {
          
          // --- NEW: 18+ Age Restriction Logic ---
          const today = new Date();
          let age = today.getFullYear() - parsedDate.getFullYear();
          const monthDifference = today.getMonth() - parsedDate.getMonth();
          
          // If the current month is before their birth month, or it's the birth month but the day hasn't happened yet, subtract 1 from age
          if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < parsedDate.getDate())) {
            age--;
          }

          if (age < 18) {
            throw new BadRequestException('You must be at least 18 years old to use Pingly.');
          }
          // --------------------------------------

          dataToSave.dob = parsedDate; 
        } else {
          delete dataToSave.dob; 
        }
      }
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