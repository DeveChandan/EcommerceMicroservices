import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  
  const port = configService.get('port') || 8000;
  await app.listen(port, '0.0.0.0');
  console.log(`Product & Order service is running on port ${port}`);
}
bootstrap();
