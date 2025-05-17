import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  HttpStatus, 
  HttpException,
  UseGuards,
  Req,
  EventPattern,
  Payload
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { CustomerOrder } from './entities/customer-order.entity';

class CreateCustomerDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address?: string;
  phoneNumber?: string;
}

class UpdateCustomerDto {
  firstName?: string;
  lastName?: string;
  address?: string;
  phoneNumber?: string;
}

class LoginDto {
  email: string;
  password: string;
}

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  async findAll(): Promise<Customer[]> {
    return this.customersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Customer> {
    const customer = await this.customersService.findOne(id);
    if (!customer) {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }
    return customer;
  }

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    try {
      return await this.customersService.create(createCustomerDto);
    } catch (error) {
      if (error.code === '23505') { // Unique violation in PostgreSQL
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ customer: Customer; token: string }> {
    try {
      return await this.customersService.validateCustomer(loginDto.email, loginDto.password);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Get(':id/orders')
  async getCustomerOrders(@Param('id') id: number): Promise<CustomerOrder[]> {
    return this.customersService.getCustomerOrders(id);
  }

  // RabbitMQ event handler
  @EventPattern('order.created')
  async handleOrderCreatedEvent(@Payload() data: any) {
    await this.customersService.createCustomerOrder(data);
  }
}
