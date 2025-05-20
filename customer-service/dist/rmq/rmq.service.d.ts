import { ClientProxy } from '@nestjs/microservices';
import { Customer } from '../customers/entities/customer.entity';
export declare class RmqService {
    private readonly client;
    constructor(client: ClientProxy);
    publishCustomerUpdated(customer: Customer): Promise<void>;
}
