# Exercise 3-1: NestJS Architecture

## User Story
As a developer, I want to understand NestJS architecture by tracing a request through the Products module.

## Acceptance Criteria
- [ ] Trace GET /api/products from controller to database
- [ ] Understand Module, Controller, Service roles
- [ ] Identify how dependency injection works
- [ ] Read and explain the Products module code

## Concepts to Apply
This is primarily a **reading and understanding** exercise:
- Module organization (@Module decorator)
- Controller routing (@Controller, @Get, @Post)
- Service pattern (@Injectable)
- Repository pattern (@InjectRepository)

## Exercise: Trace the Request

Given a request: `GET /api/products?category=electronics`

Answer these questions by reading the existing code:

1. **Which file handles the route?**
   - Look in `products.controller.ts`
   - What decorator defines the base route?
   - What method handles GET requests?

2. **How does data flow?**
   - Controller receives request → calls Service method
   - Service uses Repository → queries database
   - Data returns through the same chain

3. **What is Dependency Injection?**
   - Look at controller constructor
   - How does `productsService` get its value?
   - NestJS creates instances automatically

4. **What validates the request?**
   - Look at DTOs in `dto/` folder
   - What decorators validate fields?
   - When does validation happen?

## Files to Study

```ts
// Start here - trace the request flow:
apps/backend/src/products/products.controller.ts
apps/backend/src/products/products.service.ts
apps/backend/src/products/product.entity.ts
apps/backend/src/products/dto/create-product.dto.ts
```

## Bonus: Add a New Endpoint

After understanding the pattern, add this endpoint:

```ts
// GET /api/products/category/:category
// Returns products filtered by category

@Get('category/:category')
findByCategory(@Param('category') category: string) {
  // Call appropriate service method
}
```
