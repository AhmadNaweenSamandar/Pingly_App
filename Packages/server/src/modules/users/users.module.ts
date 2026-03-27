// server/src/modules/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { PrismaModule } from '../../../prisma/prisma.module'; 

@Module({
  imports: [PrismaModule], // Required so UserService can use PrismaService
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Exporting allows other modules to use UserService later
})
export class UserModule {}