import { 
  Controller, 
  Post, 
  Body, 
  Request, 
  UseGuards, 
  UseInterceptors, 
  UploadedFiles, 
  Param, 
  ParseIntPipe, 
  Get,
  Query
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DiscussionService } from './discussions.service';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Adjust path as needed

@Controller('discussions')
export class DiscussionController {
  constructor(private readonly discussionService: DiscussionService) {}

  // =======================================================================
  // 1. CREATE A NEW DISCUSSION (With up to 3 Image Attachments)
  // =======================================================================
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images', 3, {
    storage: diskStorage({
        // in uploads/discussions in our server directory
      destination: '../../../uploads/discussions', 
      filename: (req, file, cb) => {
        // Generates: images-1680000000000-123456789.jpg
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      }
    })
  }))
  async createDiscussion(
    @Request() req,
    @Body() createDiscussionDto: CreateDiscussionDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    // req.user.id is securely extracted from the JWT token
    const userId = req.user.id;
    
    // Hand off to the Service layer
    return this.discussionService.createDiscussion(userId, createDiscussionDto, files);
  }

  // =======================================================================
  // 2. CREATE A REPLY (Handles both Level 1 and Level 2)
  // =======================================================================
  @UseGuards(JwtAuthGuard)
  @Post(':id/replies')
  async createReply(
    @Request() req,
    @Param('id', ParseIntPipe) discussionId: number, // Ensures the ID from the URL is an integer
    @Body() createReplyDto: CreateReplyDto
  ) {
    const userId = req.user.id;
    
    // Pass the userId, the ID of the discussion from the URL, and the parsed DTO payload
    return this.discussionService.createReply(userId, discussionId, createReplyDto);
  }

  // =======================================================================
  // 3. GET DISCUSSIONS (For our "Hot Discussions" Feed)
  // =======================================================================
  // Note: we added this route because our frontend needs a way to fetch the feed!
  @UseGuards(JwtAuthGuard)
  @Get()
  async getDiscussions(@Query('sortBy') sortBy: 'trending' | 'newest' = 'trending') {
    // You can implement this in our service:
    // It should use Prisma's `orderBy` mapped to those @@index tags we created!
    return this.discussionService.getDiscussions(sortBy);
  }

  // =======================================================================
  // 4. GET SINGLE DISCUSSION (With Nested Replies)
  // =======================================================================
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getDiscussionDetail(@Param('id', ParseIntPipe) discussionId: number) {
    // Fetches the specific discussion, including the Level 1 and Level 2 replies
    return this.discussionService.getDiscussionDetail(discussionId);
  }
}