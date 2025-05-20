import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { ProductsService } from '../products/products.service';
import { RmqService } from '../rmq/rmq.service';
interface OrderItemInput {
    productId: number;
    quantity: number;
}
interface CreateOrderInput {
    customerId: number;
    items: OrderItemInput[];
    shippingAddress: string;
}
export declare class OrdersService {
    private orderRepository;
    private orderItemRepository;
    private productsService;
    private rmqService;
    constructor(orderRepository: Repository<Order>, orderItemRepository: Repository<OrderItem>, productsService: ProductsService, rmqService: RmqService);
    findAll(): Promise<Order[]>;
    findOne(id: number): Promise<Order>;
    findByCustomer(customerId: number): Promise<Order[]>;
    create(createOrderInput: CreateOrderInput): Promise<Order>;
    updateStatus(id: number, status: OrderStatus): Promise<Order>;
}
export {};
