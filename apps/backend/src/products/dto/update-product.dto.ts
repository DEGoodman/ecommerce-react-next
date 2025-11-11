import { PartialType } from '@nestjs/mapped-types'
import { CreateProductDto } from './create-product.dto'

/**
 * Update Product DTO
 *
 * Extends CreateProductDto but makes all fields optional using PartialType.
 * This is a NestJS best practice for update operations.
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {}
