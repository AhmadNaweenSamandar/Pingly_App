import { Module } from '@nestjs/common';
import { DiscussionController } from './discussion.controller';
import { DiscussionService } from './discussions.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  // Controllers handle the incoming HTTP requests
  controllers: [DiscussionController],
  
  // Providers handle the business logic and database connections
  providers: [DiscussionService, PrismaService], 
})
export class DiscussionModule {}