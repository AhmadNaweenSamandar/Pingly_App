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
   * @Post('dev-login') listens for POST requests at "/auth/dev-login".
   * @Body() automatically extracts the JSON sent by our React app.
   */
  @Post('dev-login')
  async devLogin(@Body() body: { email: string; name?: string }) {
    
    // The controller is just a middleman. It takes the email and name from React
    // and passes it to the Service to do the actual hard work.
    // We provide 'Dev User' as a fallback if React forgets to send a name.
    return this.authService.devLogin(
      body.email, 
      body.name || 'Dev User'
    );
  }
}