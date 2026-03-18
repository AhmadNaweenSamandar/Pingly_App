import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
// IMPORTANT: Import PrismaModule from Step 1 here so AuthService can use it!
import { PrismaModule } from 'prisma/prisma.module';

/**
 * The @Module decorator bundles everything related to Authentication together.
 * When NestJS starts, it reads this file to understand how to build the Auth feature.
 */
@Module({
  imports: [
    // We import the JwtModule so our AuthService can mint new tokens.
    // We bring the JWT secret from env files, but we also provide a fallback for development.
    PrismaModule, // Import PrismaModule here
    // In production, we'd use ConfigModule, but this is fine for dev
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback-dev-secret', 
      signOptions: { expiresIn: '7d' }, // Token automatically becomes invalid after 7 days
    }),
  ],

  // Providers are the "Brains" (Services) and the "Bouncers" (Strategies). 
  // NestJS will automatically create these and inject them where needed.
  providers: [AuthService],

  // Controllers handle incoming HTTP requests (like POST or GET).
  controllers: [AuthController],

  // By exporting AuthService, we allow other modules in the app to use it if they need to.
  exports: [AuthService],
})
export class AuthModule {}
