// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service'; 

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async devLogin(email: string, name: string) {
    // 1. The Backend Bouncer: Check if the email is from the allowed domain
    if (!email.endsWith('@uottawa.ca')) {
      throw new UnauthorizedException('Only company emails are allowed.');
    }

    // 2. Database Check: Find or Create the user
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name, 
          // since we have password as required in our schema, we will add ? to it and make it optional for dev login
        },
      });
      console.log(`Created new dev user: ${email} with name: ${name}`);
    }

    // 3. Generate the JWT Payload
    const payload = { sub: user.id, email: user.email };

    // 4. Return the Token and User Data to React
    return {
      access_token: this.jwtService.sign(payload),
      user: user, 
    };
  }
}