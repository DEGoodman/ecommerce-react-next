/**
 * Create Product DTO (Data Transfer Object)
 *
 * Defines the shape and validation rules for creating a product.
 * Demonstrates:
 * - class-validator decorators
 * - Input validation
 * - Type safety
 */

import { IsString, IsNumber, IsOptional, Min, MinLength } from 'class-validator'

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  name: string

  @IsString()
  @MinLength(10)
  description: string

  @IsNumber()
  @Min(0)
  price: number

  @IsString()
  @IsOptional()
  imageUrl?: string

  @IsString()
  category: string

  @IsNumber()
  @Min(0)
  stock: number
}
