import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// We pass 'jwt' to tell the AuthGuard to specifically use the JwtStrategy we built
export class JwtAuthGuard extends AuthGuard('jwt') {}