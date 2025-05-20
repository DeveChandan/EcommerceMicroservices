import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqService } from './rmq.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'ECOMMERCE_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>('rabbitmq.uri') || 'amqp://localhost:5672'
            ],
            queue: configService.get<string>('rabbitmq.queues.customerUpdated') || 'customer_updated_queue',
            queueOptions: {
              durable: true,
            },
            exchange: configService.get<string>('rabbitmq.exchange') || 'ecommerce_exchange',
            noAck: true,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {}
