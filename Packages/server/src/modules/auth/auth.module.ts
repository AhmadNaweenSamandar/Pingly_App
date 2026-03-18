import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
// IMPORTANT: Import PrismaModule from Step 1 here so AuthService can use it!
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [
    PrismaModule, // Import PrismaModule here
    // In production, we'd use ConfigModule, but this is fine for dev
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback-dev-secret', 
      signOptions: { expiresIn: '7d' }, // Token lasts 7 days
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
