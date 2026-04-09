import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/users.module';

// ServeStaticModule is used to serve the uploaded images back to the frontend
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

//prisma module import 
import { PrismaModule } from 'prisma/prisma.module';

//nestjs.config import to solve the env reading bug
import { ConfigModule } from '@nestjs/config';
// Import the DiscussionModule to make it available in the app
import { DiscussionModule } from './modules/discussions/discussion.module';

/* we need to wire this into the main entry point of our backend so NestJS knows it exists and it can be availabe in whole app */

@Module({
  imports: [
    //config.module to read the env file explicitly
    ConfigModule.forRoot({
      isGlobal: true, // Makes the variables available everywhere in your app
      envFilePath: '.env', // Explicitly tells NestJS to look for this file
    }),

    // --- NEW: ServeStaticModule to serve uploaded images ---
    ServeStaticModule.forRoot({
      // Change __dirname to process.cwd()
      // This tells NestJS to serve files from the "uploads" directory at the root of your project, which is where Multer saves them.
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads', // This means URLs will start with localhost:3000/uploads/
    }),

    // --- Sends actual images not text/html ---
    ServeStaticModule.forRoot({
      // This tells NestJS where the physical folder is located.
      // __dirname is usually /src, so we go up one level (..) to the root, then into /uploads
      rootPath: join(__dirname, '..', 'uploads'), 
      
      // This maps the URL path to the folder. 
      // So http://localhost:3000/uploads/.... maps to the folder above.
      serveRoot: '/uploads', 
    }),
    // -----------------------

    AuthModule, UserModule, PrismaModule, DiscussionModule], // Importing the PrismaModule here makes the PrismaService available throughout the app
  /* Because we used the @Global() decorator, we will never need to import PrismaModule into your ProjectsModule or UsersModule.
  When we start writing our business logic, we simply inject it into the constructor of any service, like this:
  constructor(private readonly prisma: PrismaService) {}
  Then use it: await this.prisma.user.findMany(); */
  controllers: [AppController],
  providers: [AppService],

  
})
export class AppModule {}
