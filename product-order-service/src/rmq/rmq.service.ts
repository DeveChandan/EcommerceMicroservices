import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class RmqService {
  constructor(
    @Inject('ECOMMERCE_SERVICE') private readonly client: ClientProxy,
  ) {}

  getClient(): ClientProxy {
    return this.client;
  }

  async publishOrderCreated(order: Order): Promise<void> {
    await this.client.emit('order.created', {
      id: order.id,
      customerId: order.customerId,
      totalAmount: order.totalAmount,
      status: order.status,
      items: order.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      createdAt: order.createdAt,
    }).toPromise();
  }
}
