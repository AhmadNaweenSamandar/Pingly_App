import { Module } from '@nestjs/common';
import { ProjectIdeasController } from './project-ideas.controller';
import { ProjectIdeasService } from './project-ideas.service';
//primsa module is needed to access the database through PrismaService in our service layer
import { PrismaModule } from '../../../prisma/prisma.module'; 

// 1. Import the new controller and service
import { ProjectJoinRequestController } from './project-join-request.controller';
import { ProjectJoinRequestService } from './project-join-req.service';

@Module({
  imports: [PrismaModule], // Injects database access

  controllers: [
    ProjectIdeasController,      // Handles routes related to project ideas
    ProjectJoinRequestController //join request controller to handle join requests related routes
  ], 


  providers: [
    ProjectIdeasService,         // Contains the business logic for project ideas
    ProjectJoinRequestService   // Contains the business logic for handling join requests
  ], 


  exports: [
    ProjectIdeasService,         // Optional: Allows other modules to use this service if needed
    ProjectJoinRequestService    // Optional: Allows other modules to use this service if needed
  ], // Optional: Allows other modules to use these services later
})

export class ProjectIdeasModule {}