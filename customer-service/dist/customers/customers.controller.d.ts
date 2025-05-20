import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { CustomerOrder } from './entities/customer-order.entity';
declare class CreateCustomerDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    address?: string;
    phoneNumber?: string;
}
declare class UpdateCustomerDto {
    firstName?: string;
    lastName?: string;
    address?: string;
    phoneNumber?: string;
}
declare class LoginDto {
    email: string;
    password: string;
}
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    findAll(): Promise<Customer[]>;
    findOne(id: number): Promise<Customer>;
    create(createCustomerDto: CreateCustomerDto): Promise<Customer>;
    update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer>;
    login(loginDto: LoginDto): Promise<{
        customer: Customer;
        token: string;
    }>;
    getCustomerOrders(id: number): Promise<CustomerOrder[]>;
    remove(id: number): Promise<{
        message: string;
    }>;
    handleOrderCreatedEvent(data: any): Promise<void>;
}
export {};
