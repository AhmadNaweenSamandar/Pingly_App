// server/src/modules/auth/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({

        // 1. Tell Passport to look for the token in the Authorization header as a Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // 2. Reject tokens that have expired
      ignoreExpiration: false,

      // 3. The secret key used to sign the token (MUST match what JwtModule uses)
      // Pull the JWT_SECRET securely from our .env file
      secretOrKey: configService.get<string>('JWT_SECRET') || '', 
    });
  }


  // 4. If the token is valid, Passport automatically calls this validate method.
  // The 'payload' is the exact object we created in our AuthService: { sub: userId, email: email }
  async validate(payload: any) {
    // Whatever we return here gets automatically attached to the request object as `req.user`
    return { 
      id: payload.sub, 
      email: payload.email 
    };
  }
}