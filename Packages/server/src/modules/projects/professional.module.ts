import { Module } from '@nestjs/common';
import { ProjectIdeasController } from './project-ideas.controller';
import { ProjectIdeasService } from './project-ideas.service';
//primsa module is needed to access the database through PrismaService in our service layer
import { PrismaModule } from '../../../prisma/prisma.module'; 

@Module({
  imports: [PrismaModule], // Injects database access
  controllers: [ProjectIdeasController], // Registers your endpoints
  providers: [ProjectIdeasService], // Registers your business logic
  exports: [ProjectIdeasService], // Optional: Allows other modules to use this service later
})
export class ProjectIdeasModule {}