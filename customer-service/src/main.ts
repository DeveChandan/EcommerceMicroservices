import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // RabbitMQ Connection with safe fallbacks
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        configService.get<string>('rabbitmq.uri') || 'amqp://localhost:5672'
      ],
      queue: configService.get<string>('rabbitmq.queues.orderCreated') || 'order_created_queue',
      queueOptions: {
        durable: true,
      },
      exchange: configService.get<string>('rabbitmq.exchange') || 'ecommerce_exchange',
      noAck: false,
    },
  });

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  await app.startAllMicroservices();

  const port = configService.get<number>('port') || 8001;
  await app.listen(port, '0.0.0.0');
  console.log(`Customer service is running on port ${port}`);
}
bootstrap();
