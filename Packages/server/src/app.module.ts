import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

//prisma module import 
import { PrismaModule } from 'prisma/prisma.module';

//nestjs.config import to solve the env reading bug
import { ConfigModule } from '@nestjs/config';

/* we need to wire this into the main entry point of our backend so NestJS knows it exists and it can be availabe in whole app */

@Module({
  imports: [
    //config.module to read the env file explicitly
    ConfigModule.forRoot({
      isGlobal: true, // Makes the variables available everywhere in your app
      envFilePath: '.env', // Explicitly tells NestJS to look for this file
    }),
    AuthModule, UsersModule, PrismaModule], // Importing the PrismaModule here makes the PrismaService available throughout the app
  /* Because we used the @Global() decorator, we will never need to import PrismaModule into your ProjectsModule or UsersModule.
  When we start writing our business logic, we simply inject it into the constructor of any service, like this:
  constructor(private readonly prisma: PrismaService) {}
  Then use it: await this.prisma.user.findMany(); */
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
