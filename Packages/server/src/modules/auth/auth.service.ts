// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service'; 

/**
 * @Injectable() means this class can be "injected" into other files (like our controller).
 */
@Injectable()

// We need Prisma to talk to the database, and JwtService to create tokens.
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async devLogin(email: string, name: string) {

    // ---------------------------------------------------------
    // RULE 1: THE DOMAIN CHECK
    // ---------------------------------------------------------
    // We immediately reject anyone who doesn't belong to uottawa.ca.
    // This protects our app from outsiders.
    // later we will implement Microsoft SSO entra ID auth in accordance with uottawa IT team requirements 
    if (!email.endsWith('@uottawa.ca')) {
      throw new UnauthorizedException('Only uottawa.ca emails are allowed.');
    }

    // ---------------------------------------------------------
    // RULE 2: FIND OR CREATE THE USER
    // ---------------------------------------------------------
    // We ask Prisma: "Does a user with this email already exist?"
    let user = await this.prisma.user.findUnique({
      where: { email },
    });


    // If they do not exist, this is their first time logging in. We must create them.
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

    // ---------------------------------------------------------
    // RULE 3: MINT THE JSON WEB TOKEN (JWT)
    // ---------------------------------------------------------
    // The payload is the public information hidden inside the token.
    // 'sub' (Subject) is the industry-standard term for the User ID.
    const payload = { sub: user.id, email: user.email };

    // We sign the token using our secret key. React will save this token.
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
  }
}
}