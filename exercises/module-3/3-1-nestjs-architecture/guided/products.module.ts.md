# Exercise 3-1 Guided: NestJS Architecture

## Learning Goals
Understand NestJS architecture: Modules, Controllers, Services, and Dependency Injection.

## NestJS Architecture Overview

```
Request
   │
   ▼
┌─────────────────┐
│   Controller    │  ← Handles HTTP requests, routes
│   @Controller() │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Service      │  ← Business logic, data access
│  @Injectable()  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Repository    │  ← Database operations (TypeORM)
│  @InjectRepo()  │
└─────────────────┘
```

## Step 1: Understanding Modules

Modules organize related functionality:

```ts
// products/products.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],  // Database entities
  controllers: [ProductsController],                // HTTP handlers
  providers: [ProductsService],                     // Injectable services
  exports: [ProductsService],                       // Share with other modules
})
export class ProductsModule {}
```

## Step 2: Entity (Database Model)

```ts
// products/product.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  category: string;

  @Column({ default: 0 })
  stock: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## Step 3: Service (Business Logic)

```ts
// products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(category?: string): Promise<Product[]> {
    if (category) {
      return this.productRepository.find({ where: { category } });
    }
    return this.productRepository.find();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
```

## Step 4: Controller (HTTP Routes)

```ts
// products/products.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')  // Base route: /api/products
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()  // GET /api/products
  findAll(@Query('category') category?: string) {
    return this.productsService.findAll(category);
  }

  @Get(':id')  // GET /api/products/:id
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()  // POST /api/products
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')  // PUT /api/products/:id
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')  // DELETE /api/products/:id
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
```

## Step 5: DTOs (Data Transfer Objects)

```ts
// products/dto/create-product.dto.ts
import { IsString, IsNumber, IsOptional, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  category: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;
}
```

```ts
// products/dto/update-product.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
```

## Key Concepts

1. **@Module()**: Groups related controllers and services
2. **@Controller()**: Defines route prefix, handles HTTP methods
3. **@Injectable()**: Marks class for dependency injection
4. **@InjectRepository()**: Injects TypeORM repository
5. **DTOs**: Validate and type request bodies
6. **Dependency Injection**: NestJS auto-creates and wires services
