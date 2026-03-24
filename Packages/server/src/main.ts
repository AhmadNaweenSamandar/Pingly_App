import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  // Log the variable to see if NestJS can actually read it
  console.log("THE DATABASE URL IS: ", process.env.DATABASE_URL); 


  const app = await NestFactory.create(AppModule);

  // 1. THE CORS FIX: Tell the backend to ONLY trust our React frontend
  app.enableCors({
    origin: 'http://localhost:5173', // The frontend's address
    credentials: true, // Allows cookies/tokens to be sent back and forth
  });

  // 2. THE PORT FIX: Give your backend its own dedicated port
  await app.listen(3000); 
  console.log('Backend server is running on: http://localhost:3000');
}
bootstrap();