# Backend Guide: NestJS & TypeORM

## Overview

The backend is built with NestJS, a progressive Node.js framework that uses TypeScript and follows enterprise-grade patterns. This guide covers the core concepts and patterns used.

## NestJS Fundamentals

### Architecture Pattern

NestJS follows a modular, layered architecture:

```
Request → Controller → Service → Repository → Database
```

Each layer has specific responsibilities:
- **Controllers**: Handle HTTP requests
- **Services**: Business logic
- **Repositories**: Database operations
- **Entities**: Data models

### Module System

Every feature is organized as a module:

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],  // Available to other modules
})
export class ProductsModule {}
```

**Key Points:**
- Modules encapsulate features
- `imports`: Dependencies from other modules
- `controllers`: HTTP endpoint handlers
- `providers`: Services and dependencies
- `exports`: Make services available to other modules

## Controllers

Controllers handle incoming HTTP requests and return responses.

### Example: ProductsController

```typescript
@Controller('products')  // Base route: /products
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService
  ) {}

  @Get()  // GET /products
  findAll() {
    return this.productsService.findAll()
  }

  @Get(':id')  // GET /products/:id
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id)
  }

  @Post()  // POST /products
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto)
  }

  @Patch(':id')  // PATCH /products/:id
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update(id, updateProductDto)
  }

  @Delete(':id')  // DELETE /products/:id
  remove(@Param('id') id: string) {
    return this.productsService.remove(id)
  }
}
```

### Decorators Explained

**Route Decorators:**
- `@Get()`: Handle GET requests
- `@Post()`: Handle POST requests
- `@Patch()`: Handle PATCH requests
- `@Put()`: Handle PUT requests
- `@Delete()`: Handle DELETE requests

**Parameter Decorators:**
- `@Param('id')`: Extract route parameter
- `@Body()`: Extract request body
- `@Query()`: Extract query parameters
- `@Headers()`: Extract headers

**Example Usage:**
```typescript
@Get(':id')  // /products/123
findOne(@Param('id') id: string) { }

@Get()  // /products?category=electronics
findAll(@Query('category') category: string) { }

@Post()  // Body: { name: "Phone", price: 999 }
create(@Body() dto: CreateProductDto) { }
```

## Services

Services contain business logic and interact with the database.

### Example: ProductsService

```typescript
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(dto)
    return await this.productRepository.save(product)
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      order: { createdAt: 'DESC' }
    })
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id }
    })

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`)
    }

    return product
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id)
    Object.assign(product, dto)
    return await this.productRepository.save(product)
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id)
    await this.productRepository.remove(product)
  }
}
```

### Key Concepts

**Dependency Injection:**
```typescript
constructor(
  @InjectRepository(Product)
  private readonly productRepository: Repository<Product>,
) {}
```
- Repository is automatically injected
- Enables loose coupling
- Easy to test (can inject mocks)

**Async/Await:**
```typescript
async findAll(): Promise<Product[]> {
  return await this.productRepository.find()
}
```
- All database operations are async
- Use `async/await` for clean code
- Return Promises with types

**Error Handling:**
```typescript
if (!product) {
  throw new NotFoundException(`Product ${id} not found`)
}
```
- NestJS automatically catches exceptions
- Returns proper HTTP status codes
- Built-in exception types

## DTOs (Data Transfer Objects)

DTOs define the shape and validation rules for data.

### Create DTO

```typescript
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
  category: string

  @IsNumber()
  @Min(0)
  stock: number

  @IsString()
  @IsOptional()  // Field is optional
  imageUrl?: string
}
```

### Validation Decorators

Common validators from `class-validator`:

```typescript
@IsString()          // Must be string
@IsNumber()          // Must be number
@IsEmail()           // Must be valid email
@IsBoolean()         // Must be boolean
@IsOptional()        // Field is optional
@MinLength(5)        // String min length
@MaxLength(100)      // String max length
@Min(0)              // Number minimum
@Max(1000)           // Number maximum
@IsIn(['a', 'b'])    // Must be one of values
@IsUUID()            // Must be valid UUID
@IsDate()            // Must be date
```

### Update DTO

```typescript
export class UpdateProductDto extends PartialType(CreateProductDto) {}
```

`PartialType` makes all fields optional - perfect for updates!

### Validation Pipeline

Validation happens automatically:

```typescript
// In main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,        // Strip unknown properties
    forbidNonWhitelisted: true,  // Reject if unknown properties
    transform: true,        // Transform to DTO instance
  })
)
```

If validation fails, NestJS returns:
```json
{
  "statusCode": 400,
  "message": [
    "name must be longer than 3 characters",
    "price must not be less than 0"
  ],
  "error": "Bad Request"
}
```

## TypeORM & Database

### Entities

Entities define database tables:

```typescript
@Entity('products')  // Table name
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column('text')
  description: string

  @Column('decimal', { precision: 10, scale: 2 })
  price: number

  @Column()
  category: string

  @Column('int', { default: 0 })
  stock: number

  @Column({ nullable: true })
  imageUrl: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
```

### Column Types

```typescript
@Column()                          // varchar(255)
@Column('text')                    // text
@Column('int')                     // integer
@Column('decimal', { precision: 10, scale: 2 })  // decimal
@Column('boolean')                 // boolean
@Column('timestamp')               // timestamp
@Column({ nullable: true })        // can be NULL
@Column({ default: 0 })           // default value
@Column({ unique: true })          // unique constraint
```

### Special Columns

```typescript
@PrimaryGeneratedColumn('uuid')    // Auto-generated UUID primary key
@CreateDateColumn()                // Auto-set on create
@UpdateDateColumn()                // Auto-update on change
```

### Repository Methods

```typescript
// Find all
await repository.find()

// Find with conditions
await repository.find({
  where: { category: 'electronics' },
  order: { price: 'ASC' },
  take: 10,  // Limit
  skip: 0,   // Offset
})

// Find one
await repository.findOne({ where: { id } })

// Create
const product = repository.create(data)
await repository.save(product)

// Update
await repository.update(id, data)

// Delete
await repository.delete(id)
await repository.remove(product)

// Count
await repository.count({ where: { category } })
```

### Relationships

**One-to-Many:**
```typescript
@Entity()
export class User {
  @OneToMany(() => Order, order => order.user)
  orders: Order[]
}

@Entity()
export class Order {
  @ManyToOne(() => User, user => user.orders)
  user: User
}
```

**Many-to-Many:**
```typescript
@Entity()
export class Product {
  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[]
}
```

## Dependency Injection

### How It Works

1. **Mark as Injectable:**
```typescript
@Injectable()
export class ProductsService { }
```

2. **Inject Dependencies:**
```typescript
constructor(
  private readonly productsService: ProductsService,
  private readonly usersService: UsersService,
) {}
```

3. **Register in Module:**
```typescript
@Module({
  providers: [ProductsService, UsersService],
})
```

### Benefits

- **Loose Coupling**: Easy to swap implementations
- **Testability**: Inject mocks in tests
- **Lifecycle Management**: NestJS handles creation/destruction
- **Singleton by Default**: Same instance shared everywhere

## Error Handling

### Built-in Exceptions

```typescript
throw new NotFoundException('Product not found')
throw new BadRequestException('Invalid data')
throw new UnauthorizedException('Not logged in')
throw new ForbiddenException('No permission')
throw new ConflictException('Already exists')
throw new InternalServerErrorException('Server error')
```

### Custom Exception Filters

```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const status = exception.getStatus()

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message,
    })
  }
}
```

## Configuration

### Environment Variables

```typescript
// .env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce
```

### ConfigModule

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
})
```

### Using Configuration

```typescript
constructor(private configService: ConfigService) {}

const dbHost = this.configService.get('DB_HOST')
const dbPort = this.configService.get<number>('DB_PORT', 5432)
```

## Testing

### Unit Tests

```typescript
describe('ProductsService', () => {
  let service: ProductsService
  let repository: Repository<Product>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile()

    service = module.get<ProductsService>(ProductsService)
    repository = module.get(getRepositoryToken(Product))
  })

  it('should find all products', async () => {
    const products = [{ id: '1', name: 'Test' }]
    jest.spyOn(repository, 'find').mockResolvedValue(products)

    expect(await service.findAll()).toEqual(products)
  })
})
```

### E2E Tests

```typescript
describe('ProductsController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/products (GET)', () => {
    return request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect('Content-Type', /json/)
  })
})
```

## Best Practices

### 1. Single Responsibility
Each service should handle one domain:
```typescript
✅ ProductsService - Product operations
✅ UsersService - User operations
❌ ProductsService - Products + Orders + Users
```

### 2. Dependency Injection
Always use DI, never create instances manually:
```typescript
✅ constructor(private service: ProductsService) {}
❌ const service = new ProductsService()
```

### 3. DTOs for Validation
Always validate input with DTOs:
```typescript
✅ create(@Body() dto: CreateProductDto)
❌ create(@Body() data: any)
```

### 4. Error Handling
Use appropriate HTTP exceptions:
```typescript
✅ throw new NotFoundException()
❌ return { error: 'not found' }
```

### 5. Async/Await
Use async/await for cleaner code:
```typescript
✅ const products = await repository.find()
❌ repository.find().then(products => ...)
```

## Common Patterns

### Pagination

```typescript
@Get()
async findAll(
  @Query('page') page = 1,
  @Query('limit') limit = 10,
) {
  const [items, total] = await this.repository.findAndCount({
    skip: (page - 1) * limit,
    take: limit,
  })

  return {
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}
```

### Filtering

```typescript
@Get()
async findAll(@Query() query: FilterProductDto) {
  const where: any = {}

  if (query.category) where.category = query.category
  if (query.minPrice) where.price = MoreThan(query.minPrice)

  return await this.repository.find({ where })
}
```

### Transactions

```typescript
async createOrder(dto: CreateOrderDto) {
  return await this.dataSource.transaction(async (manager) => {
    const order = manager.create(Order, dto)
    await manager.save(order)

    // Update product stock
    await manager.decrement(
      Product,
      { id: dto.productId },
      'stock',
      dto.quantity
    )

    return order
  })
}
```

## Exercises

### Beginner
1. ✏️ Add a new field to Product entity
2. ✏️ Create a DTO with validation
3. ✏️ Add a new endpoint to filter products by price

### Intermediate
4. ✏️ Implement pagination
5. ✏️ Add relationships (Product → Reviews)
6. ✏️ Create a custom exception filter

### Advanced
7. ✏️ Implement full-text search
8. ✏️ Add caching with Redis
9. ✏️ Create a custom decorator

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Class Validator](https://github.com/typestack/class-validator)

## Next Steps

- Review [Database Design](03-database.md)
- Try the exercises above
- Build authentication module
- Add more complex features
