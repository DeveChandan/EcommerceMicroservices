import { ClientProxy } from '@nestjs/microservices';
import { Order } from '../orders/entities/order.entity';
export declare class RmqService {
    private readonly client;
    constructor(client: ClientProxy);
    getClient(): ClientProxy;
    publishOrderCreated(order: Order): Promise<void>;
}
