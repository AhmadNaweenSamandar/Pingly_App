import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProfessionalModule } from './modules/professional/professional.module';
import { SocialModule } from './modules/social/social.module';

@Module({
  imports: [AuthModule, UsersModule, ProfessionalModule, SocialModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
