// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

/**
 * The @Controller('auth') decorator tells NestJS that any HTTP request 
 * starting with "http://localhost:3000/auth" belongs to this file.
 */
@Controller('auth')
export class AuthController {

  // We "inject" the AuthService here so the controller can call its functions.
  constructor(private readonly authService: AuthService) {}

  /**
   * =========================================
   * SIGN UP ROUTE
   * =========================================
   * Listens for POST requests at "http://localhost:3000/auth/signup".
   * Expects the React frontend to send an email and a password.
   */
  @Post('signup')
  async signup(@Body() body: { email: string; password: string }) {
    // Passes the extracted email and password to the Service to create the user
    return this.authService.signup(body.email, body.password);
  }

  /**
   * =========================================
   * LOGIN ROUTE
   * =========================================
   * Listens for POST requests at "http://localhost:3000/auth/login".
   * Expects the React frontend to send an email and a password.
   */
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    // Passes the extracted email and password to the Service to verify credentials
    return this.authService.login(body.email, body.password);
  }
}