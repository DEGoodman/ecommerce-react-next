# Exercise 3-2 Guided: REST API Design - Product Reviews

## Learning Goals
Create a new REST API endpoint following NestJS patterns.

## The Feature

Add product reviews to the API:
- Users can review products
- Reviews have rating (1-5) and comment
- Reviews belong to products

## Step 1: Create Review Entity

```ts
// reviews/review.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '../products/product.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  authorName: string;

  @Column('int')
  rating: number;  // 1-5

  @Column('text')
  comment: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

## Step 2: Create DTOs

```ts
// reviews/dto/create-review.dto.ts
import { IsString, IsInt, Min, Max, MinLength } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @MinLength(1)
  productId: string;

  @IsString()
  @MinLength(1)
  authorName: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @MinLength(10, { message: 'Comment must be at least 10 characters' })
  comment: string;
}
```

## Step 3: Create Service

```ts
// reviews/reviews.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly productsService: ProductsService,
  ) {}

  async findByProduct(productId: string): Promise<Review[]> {
    // Verify product exists
    await this.productsService.findOne(productId);

    return this.reviewRepository.find({
      where: { productId },
      order: { createdAt: 'DESC' },
    });
  }

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    // Verify product exists
    await this.productsService.findOne(createReviewDto.productId);

    const review = this.reviewRepository.create(createReviewDto);
    return this.reviewRepository.save(review);
  }

  async getAverageRating(productId: string): Promise<number> {
    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'average')
      .where('review.productId = :productId', { productId })
      .getRawOne();

    return result?.average ? parseFloat(result.average) : 0;
  }

  async delete(id: string): Promise<void> {
    const result = await this.reviewRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
  }
}
```

## Step 4: Create Controller

```ts
// reviews/reviews.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // GET /api/reviews/product/:productId
  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.reviewsService.findByProduct(productId);
  }

  // GET /api/reviews/product/:productId/average
  @Get('product/:productId/average')
  async getAverageRating(@Param('productId') productId: string) {
    const average = await this.reviewsService.getAverageRating(productId);
    return { productId, averageRating: average };
  }

  // POST /api/reviews
  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  // DELETE /api/reviews/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.reviewsService.delete(id);
  }
}
```

## Step 5: Create Module

```ts
// reviews/reviews.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { Review } from './review.entity';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    ProductsModule,  // Import to use ProductsService
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
```

## Step 6: Register in App Module

```ts
// app.module.ts
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    // ... other imports
    ProductsModule,
    ReviewsModule,  // Add this
  ],
})
export class AppModule {}
```

## Key Concepts

1. **Entity relationships**: @ManyToOne for review → product
2. **DTO validation**: class-validator for input validation
3. **Service injection**: Using ProductsService in ReviewsService
4. **Module imports**: Import ProductsModule to access its exports
5. **REST conventions**: GET for read, POST for create, DELETE for remove
6. **HTTP status codes**: 204 No Content for successful DELETE
