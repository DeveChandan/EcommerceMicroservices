import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  HttpStatus, 
  HttpException 
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order, OrderStatus } from './entities/order.entity';

class OrderItemDto {
  productId!: number;
  quantity!: number;
}

class CreateOrderDto {
  customerId!: number;
  items!: OrderItemDto[];
  shippingAddress!: string;
}

class UpdateOrderStatusDto {
  status!: OrderStatus;
}

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Order> {
    const order = await this.ordersService.findOne(id);
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    return order;
  }

  @Get('customer/:customerId')
  async findByCustomer(@Param('customerId') customerId: number): Promise<Order[]> {
    return this.ordersService.findByCustomer(customerId);
  }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      return await this.ordersService.create(createOrderDto);
    } catch (error) {
      throw new HttpException((error as any).message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    return this.ordersService.updateStatus(id, updateOrderStatusDto.status);
  }
}
