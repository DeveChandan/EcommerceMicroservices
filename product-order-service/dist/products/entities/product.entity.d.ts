import { OrderItem } from '../../orders/entities/order-item.entity';
export declare class Product {
    id: number;
    name: string;
    description: string;
    price: number;
    inventory: number;
    isActive: boolean;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    orderItems: OrderItem[];
}
