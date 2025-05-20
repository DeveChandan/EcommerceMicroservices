import { OrderItem } from './order-item.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export declare class Order {
    id: number;
    customerId: number;
    totalAmount: number;
    status: OrderStatus;
    shippingAddress?: string;
    createdAt: Date;
    updatedAt: Date;
    items: OrderItem[];
}
