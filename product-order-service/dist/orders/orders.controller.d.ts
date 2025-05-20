import { OrdersService } from './orders.service';
import { Order, OrderStatus } from './entities/order.entity';
declare class OrderItemDto {
    productId: number;
    quantity: number;
}
declare class CreateOrderDto {
    customerId: number;
    items: OrderItemDto[];
    shippingAddress: string;
}
declare class UpdateOrderStatusDto {
    status: OrderStatus;
}
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    findAll(): Promise<Order[]>;
    findOne(id: number): Promise<Order>;
    findByCustomer(customerId: number): Promise<Order[]>;
    create(createOrderDto: CreateOrderDto): Promise<Order>;
    updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order>;
}
export {};
