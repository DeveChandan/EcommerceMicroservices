import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';

class CreateProductDto {
  name!: string;
  description!: string;
  price!: number;
  inventory!: number;
  imageUrl?: string;
}

class UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  inventory?: number;
  isActive?: boolean;
  imageUrl?: string;
}

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query('active') active?: string): Promise<Product[]> {
    if (active !== undefined) {
      // Convert query param to boolean
      const isActive = active === 'true' || active === '1';
      return this.productsService.findAllActive(isActive);
    }
    return this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Product> {
    const product = await this.productsService.findOne(id);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.productsService.remove(id);
  }
}
