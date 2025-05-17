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
            urls: [configService.get<string>('rabbitmq.uri')],
            queue: configService.get<string>('rabbitmq.queues.customerUpdated'),
            queueOptions: {
              durable: true,
            },
            exchange: configService.get<string>('rabbitmq.exchange'),
            noAck: false,
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
