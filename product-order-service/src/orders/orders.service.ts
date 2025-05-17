import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private productsService: ProductsService,
    private rmqService: RmqService,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['items', 'items.product'] });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ 
      where: { id },
      relations: ['items', 'items.product'] 
    });
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    
    return order;
  }

  async findByCustomer(customerId: number): Promise<Order[]> {
    return this.orderRepository.find({ 
      where: { customerId },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' }
    });
  }

  async create(createOrderInput: CreateOrderInput): Promise<Order> {
    // Calculate order total and prepare order items
    let totalAmount = 0;
    const orderItems: Partial<OrderItem>[] = [];

    for (const item of createOrderInput.items) {
      const product = await this.productsService.findOne(item.productId);
      
      // Check inventory
      if (product.inventory < item.quantity) {
        throw new Error(`Insufficient inventory for product: ${product.name}`);
      }
      
      // Calculate item price and total
      const itemPrice = product.price;
      totalAmount += itemPrice * item.quantity;
      
      // Add to order items
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: itemPrice,
      });
      
      // Decrease inventory
      await this.productsService.decreaseInventory(product.id, item.quantity);
    }

    // Create order
    const newOrder = this.orderRepository.create({
      customerId: createOrderInput.customerId,
      totalAmount,
      shippingAddress: createOrderInput.shippingAddress,
      status: OrderStatus.PENDING,
    });
    
    const savedOrder = await this.orderRepository.save(newOrder);
    
    // Save order items
    for (const item of orderItems) {
      await this.orderItemRepository.save({
        ...item,
        orderId: savedOrder.id,
      });
    }
    
    // Fetch complete order with items
    const completeOrder = await this.findOne(savedOrder.id);
    
    // Send message to RabbitMQ
    await this.rmqService.publishOrderCreated(completeOrder);
    
    return completeOrder;
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    return this.orderRepository.save(order);
  }
}
