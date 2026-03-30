// server/src/modules/user/user.controller.ts
import { Controller, Patch, Body, Request, UseGuards, Get, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { UserService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // === NEW GET ROUTE ===
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    // req.user.id comes directly from your decoded JWT token!
    return this.userService.getUserProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'socialPictures', maxCount: 3 },
  ], {
    // This configuration tells Multer where and how to save the files
    storage: diskStorage({
      destination: './uploads', 
      filename: (req, file, cb) => {
        // Generate a unique string using the current timestamp and a random number
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        // Combine it with the original file extension (e.g., .jpg, .png)
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      }
    })
  }))
  async updateProfile(
    @Request() req, 
    @Body() updateData: any, // We will handle validation in the service since we have both text and files coming in,
    @UploadedFiles() files: { profilePicture?: Express.Multer.File[], socialPictures?: Express.Multer.File[] }
  ) {
    const userId = req.user.id;
    
    // We will build an object to hold the file paths for Prisma
    const filePaths: any = {};

    // If a profile picture was uploaded, extract its new local path
    if (files?.profilePicture?.[0]) {
      // e.g., "uploads/profilePicture-123456789.jpg"
      filePaths.profilePicture = files.profilePicture[0].path; 
    }

    // If social pictures were uploaded, extract an array of their paths
    if (files?.socialPictures?.length) {
      filePaths.socialPictures = files.socialPictures.map(file => file.path);
    }

    // Pass BOTH the text data and the new image paths to your service
    return this.userService.updateProfile(userId, updateData, filePaths); 
  }
}
