// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('dev-login')
  async devLogin(@Body() body: { email: string; name?: string }) {
    
    // Pass the email and name to the service. 
    // We provide 'Dev User' as a fallback just in case React forgets to send it.
    return this.authService.devLogin(
      body.email, 
      body.name || 'Dev User'
    );
  }
}