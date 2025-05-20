import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
declare class CreateProductDto {
    name: string;
    description: string;
    price: number;
    inventory: number;
    imageUrl?: string;
}
declare class UpdateProductDto {
    name?: string;
    description?: string;
    price?: number;
    inventory?: number;
    isActive?: boolean;
    imageUrl?: string;
}
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(active?: string): Promise<Product[]>;
    findOne(id: number): Promise<Product>;
    create(createProductDto: CreateProductDto): Promise<Product>;
    update(id: number, updateProductDto: UpdateProductDto): Promise<Product>;
    remove(id: number): Promise<void>;
}
export {};
