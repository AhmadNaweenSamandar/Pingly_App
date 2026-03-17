// packages/server/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/* Now, we wrap that service in a module and decorate it with @Global(). 
This tells NestJS that the PrismaService should be available everywhere in our app automatically. */

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Exporting it makes it available to other modules
})
export class PrismaModule {}