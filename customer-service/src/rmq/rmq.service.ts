import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Customer } from '../customers/entities/customer.entity';

@Injectable()
export class RmqService {
  constructor(
    @Inject('ECOMMERCE_SERVICE') private readonly client: ClientProxy,
  ) {}

  async publishCustomerUpdated(customer: Customer): Promise<void> {
    const { password, ...customerData } = customer;
    
    await this.client.emit('customer.updated', customerData);
  }
}
