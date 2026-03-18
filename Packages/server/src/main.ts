import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allows our React app to make requests to this backend
  app.enableCors();

  // our front end localhost
  await app.listen(5173);
}
bootstrap();
