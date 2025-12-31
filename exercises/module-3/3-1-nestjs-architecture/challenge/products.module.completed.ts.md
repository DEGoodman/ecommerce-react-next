# Exercise 3-1 Solution: Understanding & New Endpoint

## Request Trace Answers

1. **Route Handler**: `products.controller.ts`
   - `@Controller('products')` sets base route `/api/products`
   - `@Get()` with `findAll(@Query('category') category?)` handles GET

2. **Data Flow**:
   ```
   GET /api/products?category=electronics
   → ProductsController.findAll(category: 'electronics')
   → ProductsService.findAll('electronics')
   → ProductRepository.find({ where: { category: 'electronics' } })
   → Database query
   → Product[] returned through each layer
   ```

3. **Dependency Injection**:
   - Controller declares `constructor(private productsService: ProductsService)`
   - NestJS sees ProductsService in module's providers
   - Automatically creates instance and passes to controller

4. **Validation**:
   - DTOs use class-validator decorators (@IsString, @Min, etc.)
   - ValidationPipe in main.ts validates incoming @Body()
   - Rejects invalid data with 400 Bad Request

## Bonus Solution: Category Endpoint

```ts
// products.controller.ts
@Get('category/:category')
findByCategory(@Param('category') category: string) {
  return this.productsService.findAll(category);
}
```

Or with a dedicated service method:

```ts
// products.service.ts
async findByCategory(category: string): Promise<Product[]> {
  return this.productRepository.find({
    where: { category },
    order: { name: 'ASC' },
  });
}

// products.controller.ts
@Get('category/:category')
findByCategory(@Param('category') category: string) {
  return this.productsService.findByCategory(category);
}
```
