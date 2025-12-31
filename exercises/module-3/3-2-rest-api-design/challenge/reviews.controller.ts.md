# Exercise 3-2: REST API Design - Product Reviews

## User Story
As a shopper, I want to read and write product reviews.

## Acceptance Criteria
- [ ] GET /api/reviews/product/:productId returns reviews
- [ ] GET /api/reviews/product/:productId/average returns average rating
- [ ] POST /api/reviews creates a new review
- [ ] DELETE /api/reviews/:id removes a review
- [ ] Rating must be 1-5
- [ ] Comment must be at least 10 characters

## Concepts to Apply
- Entity with @ManyToOne relationship
- DTO with validation decorators
- Service with repository injection
- Controller with REST methods

## Starter Code

```ts
// reviews/review.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // TODO: Add productId column
  // TODO: Add ManyToOne relationship to Product
  // TODO: Add authorName, rating, comment columns
  // TODO: Add createdAt timestamp
}
```

```ts
// reviews/dto/create-review.dto.ts
import { IsString, IsInt, Min, Max } from 'class-validator';

export class CreateReviewDto {
  // TODO: Add validation for productId, authorName, rating (1-5), comment
}
```

```ts
// reviews/reviews.controller.ts
import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';

@Controller('reviews')
export class ReviewsController {
  // TODO: Inject ReviewsService
  // TODO: Implement findByProduct, getAverageRating, create, delete
}
```

## Hints
- Use `@ManyToOne(() => Product, { onDelete: 'CASCADE' })` for relationship
- `@Min(1) @Max(5)` for rating validation
- `@MinLength(10)` for comment validation
- Import ProductsModule in ReviewsModule to use ProductsService
