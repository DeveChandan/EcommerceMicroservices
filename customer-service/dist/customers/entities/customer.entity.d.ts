import { CustomerOrder } from './customer-order.entity';
export declare class Customer {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    address?: string;
    phoneNumber?: string;
    createdAt: Date;
    updatedAt: Date;
    orders: CustomerOrder[];
}
