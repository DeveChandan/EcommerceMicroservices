import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerOrder } from './entities/customer-order.entity';
import { RmqService } from '../rmq/rmq.service';
export declare class CustomersService {
    private customerRepository;
    private customerOrderRepository;
    private rmqService;
    constructor(customerRepository: Repository<Customer>, customerOrderRepository: Repository<CustomerOrder>, rmqService: RmqService);
    findAll(): Promise<Customer[]>;
    findOne(id: number): Promise<Customer>;
    findByEmail(email: string): Promise<Customer>;
    create(customerData: Partial<Customer>): Promise<Customer>;
    update(id: number, customerData: Partial<Customer>): Promise<Customer>;
    validateCustomer(email: string, password: string): Promise<{
        customer: Customer;
        token: string;
    }>;
    getCustomerOrders(customerId: number): Promise<CustomerOrder[]>;
    createCustomerOrder(orderData: any): Promise<CustomerOrder>;
    remove(id: number): Promise<boolean>;
}
