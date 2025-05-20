import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
export declare class ProductsService {
    private productRepository;
    constructor(productRepository: Repository<Product>);
    findAll(): Promise<Product[]>;
    findAllActive(isActive: boolean): Promise<Product[]>;
    findOne(id: number): Promise<Product>;
    create(productData: Partial<Product>): Promise<Product>;
    update(id: number, productData: Partial<Product>): Promise<Product>;
    remove(id: number): Promise<void>;
    decreaseInventory(id: number, quantity: number): Promise<Product>;
}
