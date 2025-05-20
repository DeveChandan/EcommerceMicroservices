import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerOrder, OrderStatus } from './entities/customer-order.entity';
import { RmqService } from '../rmq/rmq.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(CustomerOrder)
    private customerOrderRepository: Repository<CustomerOrder>,
    private rmqService: RmqService,
  ) {}

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find({ select: ['id', 'firstName', 'lastName', 'email', 'address', 'phoneNumber', 'createdAt'] });
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ 
      where: { id }, 
      select: ['id', 'firstName', 'lastName', 'email', 'address', 'phoneNumber', 'createdAt'] 
    });
    
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    
    return customer;
  }

  async findByEmail(email: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { email } });
    
    if (!customer) {
      throw new NotFoundException(`Customer with email ${email} not found`);
    }
    
    return customer;
  }

  async create(customerData: Partial<Customer>): Promise<Customer> {
    // Check if email already exists
    const existingCustomer = await this.customerRepository.findOne({ where: { email: customerData.email } });
    if (existingCustomer) {
      throw new ConflictException('Email already exists');
    }
    
    // In a real app, you would hash the password here
    const newCustomer = this.customerRepository.create(customerData);
    const savedCustomer = await this.customerRepository.save(newCustomer);
    
    // Remove password from response
    const { password, ...result } = savedCustomer;
    return result as Customer;
  }

  async update(id: number, customerData: Partial<Customer>): Promise<Customer> {
    await this.findOne(id); // Validate that customer exists
    await this.customerRepository.update(id, customerData);
    return this.findOne(id);
  }

  async validateCustomer(email: string, password: string): Promise<{ customer: Customer; token: string }> {
    const customer = await this.customerRepository.findOne({ where: { email } });
    
    if (!customer) {
      throw new Error('Invalid credentials');
    }
    
    // In a real app, you would compare hashed passwords
    if (customer.password !== password) {
      throw new Error('Invalid credentials');
    }
    
    // Generate JWT token (in a real app, use a proper secret and expiration)
    const token = jwt.sign(
      { sub: customer.id, email: customer.email },
      'your-secret-key',
      { expiresIn: '1h' }
    );
    
    // Remove password from response
    const { password: _, ...customerWithoutPassword } = customer;
    
    return {
      customer: customerWithoutPassword as Customer,
      token,
    };
  }

  async getCustomerOrders(customerId: number): Promise<CustomerOrder[]> {
    await this.findOne(customerId); // Validate that customer exists
    
    return this.customerOrderRepository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    });
  }

  async createCustomerOrder(orderData: any): Promise<CustomerOrder> {
    // Check if customer exists
    await this.findOne(orderData.customerId);
    
    // Create customer order
    const customerOrder = this.customerOrderRepository.create({
      orderId: orderData.id,
      customerId: orderData.customerId,
      totalAmount: orderData.totalAmount,
      status: orderData.status,
      createdAt: new Date(orderData.createdAt),
    });
    
    return this.customerOrderRepository.save(customerOrder);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.customerRepository.delete(id);
    return result.affected !== 0;
  }
}
