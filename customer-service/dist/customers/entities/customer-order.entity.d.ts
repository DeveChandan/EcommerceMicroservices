import { Customer } from './customer.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export declare class CustomerOrder {
    id: number;
    orderId: number;
    customerId: number;
    totalAmount: number;
    status: OrderStatus;
    createdAt: Date;
    customer: Customer;
}
