// src/auth/auth.service.ts
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service'; 
import * as bcrypt from 'bcrypt'; // bcrypt for password hashing

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

  // =========================================
  // 1. SIGN UP ROUTE
  // =========================================
  async signup(email: string, password: string) {
    // RULE 1: Domain check
    if (!email.endsWith('@uottawa.ca')) {
      throw new UnauthorizedException('Only @uottawa.ca emails are allowed.');
    }

    // RULE 2: Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // ConflictException (409) is standard for "Resource already exists"
      throw new ConflictException('A user with this email already exists.');
    }

    // RULE 3: Hash the password BEFORE saving to the database
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    // RULE 4: Create the user with the HASHED password
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    console.log(`Created new user: ${email}`);

    // Automatically log them in after signup by returning a token
    return this.generateToken(user.id, user.email);
  }

  // =========================================
  // 2. LOGIN ROUTE
  // =========================================
  async login(email: string, password: string) {
    // RULE 1: Find the user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // RULE 2: Compare the provided password with the hashed password in DB
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // RULE 3: If everything matches, generate and return the token
    return this.generateToken(user.id, user.email);
  }

  // =========================================
  // HELPER FUNCTION
  // =========================================
  // Since both signup and login need to return a JWT, we put it in a helper function
  private generateToken(userId: number, email: string) {
    const payload = { sub: userId, email: email };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: userId,
        email: email,
      },
    };
  }
}