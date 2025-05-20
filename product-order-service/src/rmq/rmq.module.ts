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
            queue: configService.get<string>('rabbitmq.queues.orderCreated') || 'order_created_queue',
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
export class RmqModule {
  constructor(private readonly rmqService: RmqService) {}

  async onModuleInit() {
    this.rmqService.getClient().connect();
  }

  async onModuleDestroy() {
    this.rmqService.getClient().close();
  }
}
