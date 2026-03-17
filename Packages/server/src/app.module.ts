import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

//prisma module import 
import { PrismaModule } from 'prisma/prisma.module';

/* we need to wire this into the main entry point of our backend so NestJS knows it exists and it can be availabe in whole app */

@Module({
  imports: [AuthModule, UsersModule, PrismaModule], // Importing the PrismaModule here makes the PrismaService available throughout the app
  /* Because we used the @Global() decorator, we will never need to import PrismaModule into your ProjectsModule or UsersModule.
  When we start writing our business logic, we simply inject it into the constructor of any service, like this:
  constructor(private readonly prisma: PrismaService) {}
  Then use it: await this.prisma.user.findMany(); */
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
