import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findAllActive(isActive: boolean): Promise<Product[]> {
    return this.productRepository.find({ where: { isActive } });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async create(productData: Partial<Product>): Promise<Product> {
    const newProduct = this.productRepository.create(productData);
    return this.productRepository.save(newProduct);
  }

  async update(id: number, productData: Partial<Product>): Promise<Product> {
    await this.findOne(id); // Validate that product exists
    await this.productRepository.update(id, productData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async decreaseInventory(id: number, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    
    if (product.inventory < quantity) {
      throw new Error('Insufficient inventory');
    }
    
    product.inventory -= quantity;
    return this.productRepository.save(product);
  }
}
