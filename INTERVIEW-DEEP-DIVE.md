# 🎓 7-Day Technical Interview Deep Dive

**Total Time Available**: 15-20 hours over 7 days
**Interview**: Next week (more technical depth expected)
**Strategy**: Comprehensive preparation with hands-on practice

---

## 🎯 Goals

By interview day, you'll be able to:
- ✅ Architect complex e-commerce systems end-to-end
- ✅ Code live during interviews (with Claude's help for practice)
- ✅ Debug and optimize existing code
- ✅ Discuss trade-offs at every level
- ✅ Handle behavioral + technical questions
- ✅ Lead system design discussions
- ✅ Ask intelligent questions

---

## 📅 7-Day Schedule

### Day 1: Foundation & Architecture (2-3 hours)

**Session 1: E-Commerce System Architecture (90 min)**

**Deep Dive Topics:**

1. **Architecture Evolution** (30 min)
   ```
   MVP (Month 1-6):
   ┌─────────────────────┐
   │   Next.js Frontend  │
   │   + API Routes      │
   │   + PostgreSQL      │
   └─────────────────────┘

   Growing (Month 6-12):
   ┌──────────────┐      ┌──────────────┐
   │  Next.js     │ ───► │  Backend API │
   │  Frontend    │      │  (NestJS)    │
   └──────────────┘      └──────┬───────┘
                                │
                         ┌──────▼───────┐
                         │  PostgreSQL  │
                         │  + Redis     │
                         └──────────────┘

   Enterprise (Year 2+):
   ┌──────────┐
   │ Next.js  │
   └────┬─────┘
        │
   ┌────▼──────────┐
   │  API Gateway  │
   └───┬─────┬─────┘
       │     │
   ┌───▼─┐ ┌▼────┐  ┌──────┐
   │User │ │Order│  │Search│
   │Svc  │ │Svc  │  │ Svc  │
   └─────┘ └─────┘  └──────┘
   ```

2. **Database Design Deep Dive** (40 min)
   - Normalization vs denormalization
   - Indexing strategies
   - Partitioning large tables
   - Read replicas
   - Connection pooling

3. **API Design Patterns** (20 min)
   - REST maturity model
   - GraphQL use cases
   - gRPC for inter-service communication
   - Versioning strategies

**Interactive Exercise:**
```
Practice with Claude:

"Let's design an e-commerce platform for 1M users. Walk me through:
1. Database schema
2. Service boundaries
3. Caching strategy
4. Deployment architecture"

I'll ask probing questions like:
- "How would you handle a viral product?"
- "What if payment service is down?"
- "How do you ensure data consistency?"
```

**Session 2: Code Review & Patterns (60-90 min)**

**Exercise: Review This Code**
```typescript
// Bad shopping cart implementation
class ShoppingCart {
  items: any[] = [];

  addItem(product: any) {
    this.items.push(product);
  }

  getTotal() {
    let total = 0;
    for (let i = 0; i < this.items.length; i++) {
      total = total + this.items[i].price * this.items[i].quantity;
    }
    return total;
  }
}

// What's wrong? How would you improve it?
```

**Practice with Claude:**
```
"Claude, let's review this code. What issues do you see?"

Issues to identify:
1. No TypeScript types (any)
2. Direct array manipulation
3. No error handling
4. No validation
5. Inefficient loop
6. Missing features (remove item, update quantity)
7. No persistence
8. No business logic (max quantity, stock check)
```

**Improved Version:**
```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

class ShoppingCart {
  private items: Map<string, CartItem> = new Map();
  private readonly MAX_QUANTITY = 99;

  addItem(product: Product, quantity: number = 1): Result<void> {
    // Validation
    if (quantity <= 0 || quantity > this.MAX_QUANTITY) {
      return Result.error('Invalid quantity');
    }

    if (quantity > product.stock) {
      return Result.error('Insufficient stock');
    }

    // Check existing
    const existing = this.items.get(product.id);
    if (existing) {
      const newQuantity = existing.quantity + quantity;
      if (newQuantity > product.stock) {
        return Result.error('Exceeds available stock');
      }
      existing.quantity = newQuantity;
    } else {
      this.items.set(product.id, { product, quantity });
    }

    return Result.ok();
  }

  removeItem(productId: string): Result<void> {
    if (!this.items.has(productId)) {
      return Result.error('Item not in cart');
    }
    this.items.delete(productId);
    return Result.ok();
  }

  updateQuantity(productId: string, quantity: number): Result<void> {
    if (quantity === 0) {
      return this.removeItem(productId);
    }

    const item = this.items.get(productId);
    if (!item) {
      return Result.error('Item not in cart');
    }

    if (quantity > item.product.stock) {
      return Result.error('Insufficient stock');
    }

    item.quantity = quantity;
    return Result.ok();
  }

  getTotal(): number {
    return Array.from(this.items.values())
      .reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  getItems(): CartItem[] {
    return Array.from(this.items.values());
  }

  getTotalItems(): number {
    return Array.from(this.items.values())
      .reduce((sum, item) => sum + item.quantity, 0);
  }

  clear(): void {
    this.items.clear();
  }
}

// Result type for error handling
class Result<T> {
  private constructor(
    public readonly value?: T,
    public readonly error?: string,
  ) {}

  static ok<T>(value?: T): Result<T> {
    return new Result(value);
  }

  static error<T>(error: string): Result<T> {
    return new Result(undefined, error);
  }

  isOk(): boolean {
    return this.error === undefined;
  }
}
```

**Day 1 Deliverables:**
- [ ] Can draw architecture diagrams
- [ ] Can explain database design decisions
- [ ] Can review code for improvements
- [ ] Understand Result/Either pattern for errors

---

### Day 2: React & Frontend Deep Dive (3 hours)

**Session 1: React Advanced Patterns (90 min)**

**Topics:**

1. **Custom Hooks** (30 min)
```typescript
// Practice: Implement useCart hook
function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product, quantity: number) => {
    // Implementation
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    // Implementation
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    // Implementation
  }, []);

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [items]);

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
  };
}
```

2. **Performance Optimization** (30 min)
```typescript
// Problem: ProductList re-renders all items when one changes

// Bad:
function ProductList({ products }: { products: Product[] }) {
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// Better: Memoize ProductCard
const ProductCard = memo(({ product }: { product: Product }) => {
  console.log('Rendering:', product.name); // Debug
  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <AddToCartButton product={product} />
    </div>
  );
});

// Even Better: Virtualization for long lists
import { FixedSizeList } from 'react-window';

function VirtualizedProductList({ products }: { products: Product[] }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={products.length}
      itemSize={200}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <ProductCard product={products[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

3. **Error Boundaries** (30 min)
```typescript
class ProductErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  state = { hasError: false, error: undefined };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error tracking service
    console.error('ProductErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong loading products</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage:
<ProductErrorBoundary>
  <ProductList products={products} />
</ProductErrorBoundary>
```

**Session 2: Next.js Deep Dive (90 min)**

**Topics:**

1. **Server vs Client Components** (40 min)
```typescript
// app/products/[id]/page.tsx (Server Component)
export default async function ProductPage({ params }: { params: { id: string } }) {
  // This runs on the server!
  const product = await fetchProduct(params.id);
  const relatedProducts = await fetchRelatedProducts(product.category);

  return (
    <div>
      {/* Server Component - no JS shipped */}
      <ProductDetails product={product} />

      {/* Client Component - interactive */}
      <AddToCartButton product={product} />

      {/* Server Component */}
      <RelatedProducts products={relatedProducts} />
    </div>
  );
}

// components/AddToCartButton.tsx (Client Component)
'use client';

export function AddToCartButton({ product }: { product: Product }) {
  const [isAdding, setIsAdding] = useState(false);

  const handleClick = async () => {
    setIsAdding(true);
    try {
      await addToCart(product.id);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={isAdding}>
      {isAdding ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

2. **Data Fetching Patterns** (30 min)
```typescript
// Pattern 1: Server Component (recommended)
async function ProductPage() {
  const products = await fetch('...', { cache: 'no-store' }); // Dynamic
  // or
  const products = await fetch('...', { next: { revalidate: 3600 } }); // Revalidate hourly
  // or
  const products = await fetch('...', { cache: 'force-cache' }); // Static
}

// Pattern 2: Client Component with SWR
'use client';
function ProductList() {
  const { data, error, isLoading } = useSWR('/api/products', fetcher);

  if (isLoading) return <Skeleton />;
  if (error) return <Error />;
  return <div>{data.map(...)}</div>;
}

// Pattern 3: Parallel Data Fetching
async function ProductPage({ params }) {
  // These run in parallel!
  const [product, reviews, related] = await Promise.all([
    fetchProduct(params.id),
    fetchReviews(params.id),
    fetchRelatedProducts(params.id),
  ]);

  return <div>...</div>;
}
```

3. **Streaming & Suspense** (20 min)
```typescript
// app/products/[id]/page.tsx
export default function ProductPage({ params }) {
  return (
    <div>
      <Suspense fallback={<ProductDetailsSkeleton />}>
        <ProductDetails id={params.id} />
      </Suspense>

      <Suspense fallback={<ReviewsSkeleton />}>
        <ProductReviews id={params.id} />
      </Suspense>

      <Suspense fallback={<RelatedSkeleton />}>
        <RelatedProducts id={params.id} />
      </Suspense>
    </div>
  );
}

// Each suspense boundary loads independently!
// User sees content progressively
```

**Day 2 Deliverables:**
- [ ] Can implement custom hooks
- [ ] Can optimize React performance
- [ ] Can explain Server vs Client Components
- [ ] Can use Suspense for streaming

---

### Day 3: Backend & NestJS Deep Dive (3 hours)

**Session 1: NestJS Architecture (90 min)**

**Topics:**

1. **Dependency Injection Deep Dive** (40 min)
```typescript
// products/products.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CacheModule.register(),
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: 'CACHE_TTL',
      useValue: 3600,
    },
    {
      provide: 'PRODUCT_REPOSITORY',
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(Product);
      },
      inject: [DataSource],
    },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}

// products/products.service.ts
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private cacheManager: Cache,
    @Inject('CACHE_TTL')
    private cacheTTL: number,
  ) {}

  async findAll(): Promise<Product[]> {
    const cached = await this.cacheManager.get<Product[]>('products:all');
    if (cached) return cached;

    const products = await this.productRepository.find();
    await this.cacheManager.set('products:all', products, this.cacheTTL);

    return products;
  }
}
```

2. **Guards, Interceptors, Pipes** (30 min)
```typescript
// auth/jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }
}

// common/interceptors/logging.interceptor.ts
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        console.log(`${request.method} ${request.url} - ${duration}ms`);
      }),
    );
  }
}

// common/pipes/validation.pipe.ts
@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
      return value;
    }

    const object = plainToClass(metadata.metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

// Usage:
@Controller('products')
@UseGuards(JwtAuthGuard)
@UseInterceptors(LoggingInterceptor)
export class ProductsController {
  @Post()
  create(@Body(new ValidationPipe()) createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
}
```

3. **DTOs and Validation** (20 min)
```typescript
// products/dto/create-product.dto.ts
export class CreateProductDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(500)
  description: string;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;

  @IsString()
  @IsIn(['electronics', 'clothing', 'books', 'home'])
  category: string;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}

// products/dto/query-products.dto.ts
export class QueryProductsDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  @IsOptional()
  @IsIn(['price', 'name', 'createdAt'])
  sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
```

**Session 2: Database & TypeORM (90 min)**

**Topics:**

1. **Entity Relationships** (40 min)
```typescript
// users/entities/user.entity.ts
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name: string;

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// orders/entities/order.entity.ts
@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.orders, { eager: true })
  user: User;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @OneToMany(() => OrderItem, item => item.order, { cascade: true, eager: true })
  items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Index()
  @Column()
  userId: string;
}

// orders/entities/order-item.entity.ts
@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, order => order.items)
  order: Order;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number; // Snapshot price at order time
}
```

2. **Query Optimization** (30 min)
```typescript
// Bad: N+1 query problem
async getOrders() {
  const orders = await this.orderRepository.find();

  for (const order of orders) {
    // N additional queries!
    order.items = await this.orderItemRepository.find({
      where: { orderId: order.id },
    });
  }

  return orders;
}

// Good: Use relations
async getOrders() {
  return this.orderRepository.find({
    relations: ['items', 'items.product', 'user'],
  });
}

// Better: Use query builder for complex queries
async getOrders(userId: string, status?: OrderStatus) {
  const query = this.orderRepository
    .createQueryBuilder('order')
    .leftJoinAndSelect('order.items', 'items')
    .leftJoinAndSelect('items.product', 'product')
    .leftJoinAndSelect('order.user', 'user')
    .where('order.userId = :userId', { userId });

  if (status) {
    query.andWhere('order.status = :status', { status });
  }

  return query
    .orderBy('order.createdAt', 'DESC')
    .getMany();
}

// Even Better: Use QueryBuilder with pagination
async getOrdersPaginated(
  userId: string,
  page: number = 1,
  limit: number = 20,
) {
  const [orders, total] = await this.orderRepository
    .createQueryBuilder('order')
    .leftJoinAndSelect('order.items', 'items')
    .leftJoinAndSelect('items.product', 'product')
    .where('order.userId = :userId', { userId })
    .orderBy('order.createdAt', 'DESC')
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return {
    data: orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
```

3. **Transactions** (20 min)
```typescript
async createOrder(userId: string, items: OrderItemDto[]) {
  return this.dataSource.transaction(async (manager) => {
    // 1. Check and reserve stock
    for (const item of items) {
      const product = await manager.findOne(Product, {
        where: { id: item.productId },
        lock: { mode: 'pessimistic_write' }, // Lock row
      });

      if (!product || product.stock < item.quantity) {
        throw new BadRequestException('Insufficient stock');
      }

      // Reduce stock
      product.stock -= item.quantity;
      await manager.save(product);
    }

    // 2. Create order
    const order = manager.create(Order, {
      userId,
      status: OrderStatus.PENDING,
    });

    await manager.save(order);

    // 3. Create order items
    for (const item of items) {
      const product = await manager.findOne(Product, {
        where: { id: item.productId },
      });

      const orderItem = manager.create(OrderItem, {
        order,
        product,
        quantity: item.quantity,
        price: product.price, // Snapshot price
      });

      await manager.save(orderItem);
    }

    // 4. Calculate total
    const total = items.reduce(
      (sum, item, index) => sum + item.quantity * items[index].price,
      0,
    );

    order.total = total;
    await manager.save(order);

    return order;
  });
  // If anything fails, entire transaction rolls back
}
```

**Day 3 Deliverables:**
- [ ] Can implement NestJS modules with DI
- [ ] Can use Guards, Interceptors, Pipes
- [ ] Can design entity relationships
- [ ] Can optimize database queries
- [ ] Can use transactions properly

---

### Day 4: System Design & Scalability (3 hours)

**Session 1: Caching Strategies (90 min)**

**Topics:**

1. **Multi-Layer Caching** (40 min)
```typescript
// Layer 1: Browser Cache (HTTP headers)
@Get('products/:id')
async getProduct(@Param('id') id: string, @Res() res: Response) {
  const product = await this.productsService.findOne(id);

  // Cache for 1 hour, can serve stale for 24 hours while revalidating
  res.set('Cache-Control', 'max-age=3600, stale-while-revalidate=86400');
  res.set('ETag', `"${product.updatedAt.getTime()}"`);

  return res.json(product);
}

// Layer 2: CDN Cache (Cloudflare, CloudFront)
// Set via headers or CDN-specific headers
res.set('CDN-Cache-Control', 'max-age=7200');

// Layer 3: Application Cache (Redis)
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async findOne(id: string): Promise<Product> {
    // Try cache first
    const cacheKey = `product:${id}`;
    const cached = await this.cacheManager.get<Product>(cacheKey);

    if (cached) {
      console.log('Cache hit:', cacheKey);
      return cached;
    }

    // Fetch from database
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Cache for 1 hour
    await this.cacheManager.set(cacheKey, product, 3600);

    return product;
  }

  async update(id: string, updateDto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.save({
      id,
      ...updateDto,
    });

    // Invalidate cache
    await this.cacheManager.del(`product:${id}`);
    await this.cacheManager.del('products:all');

    return product;
  }
}

// Layer 4: Database Query Cache
// Handled by database itself with proper indexing
```

2. **Cache Invalidation Patterns** (30 min)
```typescript
// Pattern 1: Time-based (TTL)
await redis.setex('key', 3600, value); // Expires in 1 hour

// Pattern 2: Event-based
@Injectable()
export class ProductsService {
  constructor(
    private eventEmitter: EventEmitter2,
    private cacheManager: Cache,
  ) {}

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.repository.save({ id, ...dto });

    // Emit event
    this.eventEmitter.emit('product.updated', { productId: id });

    return product;
  }
}

@Injectable()
export class CacheInvalidationService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  @OnEvent('product.updated')
  async handleProductUpdate(payload: { productId: string }) {
    // Invalidate related caches
    await this.cacheManager.del(`product:${payload.productId}`);
    await this.cacheManager.del('products:all');
    await this.cacheManager.del(`products:category:*`);
  }
}

// Pattern 3: Cache Tags
const tags = [`product:${id}`, 'products:all', `category:${category}`];
await this.cacheManager.set(key, value, { tags });

// Invalidate by tag
await this.cacheManager.deleteByTag(`category:${category}`);

// Pattern 4: Write-through cache
async update(id: string, dto: UpdateProductDto) {
  // Update database
  const product = await this.repository.save({ id, ...dto });

  // Update cache immediately
  await this.cacheManager.set(`product:${id}`, product, 3600);

  return product;
}
```

3. **Cache Warming** (20 min)
```typescript
@Injectable()
export class CacheWarmingService {
  constructor(
    private productsService: ProductsService,
    private cacheManager: Cache,
  ) {}

  @Cron('0 */6 * * *') // Every 6 hours
  async warmProductCache() {
    console.log('Warming product cache...');

    // Get top 100 most viewed products
    const topProducts = await this.productsService.getTopViewed(100);

    for (const product of topProducts) {
      await this.cacheManager.set(
        `product:${product.id}`,
        product,
        21600, // 6 hours
      );
    }

    console.log(`Warmed cache for ${topProducts.length} products`);
  }
}
```

**Session 2: Load Balancing & Scaling (90 min)**

**Topics:**

1. **Horizontal Scaling** (40 min)
```
┌──────────────┐
│ Load Balancer│
│  (Nginx/ALB) │
└──────┬───────┘
       │
   ┌───┴────┬────────┬────────┐
   │        │        │        │
┌──▼──┐  ┌──▼──┐  ┌──▼──┐  ┌──▼──┐
│App 1│  │App 2│  │App 3│  │App 4│
└──┬──┘  └──┬──┘  └──┬──┘  └──┬──┘
   │        │        │        │
   └────────┴────────┴────────┘
            │
      ┌─────▼─────┐
      │PostgreSQL │
      │+ Replicas │
      └───────────┘
```

2. **Rate Limiting** (30 min)
```typescript
// rate-limiting.guard.ts
@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(@Inject('REDIS_CLIENT') private redis: Redis) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id || request.ip;
    const key = `rate-limit:${userId}`;

    // Sliding window rate limit: 100 requests per minute
    const now = Date.now();
    const windowStart = now - 60000; // 1 minute ago

    // Use Redis sorted set for sliding window
    await this.redis.zremrangebyscore(key, 0, windowStart);
    const requestCount = await this.redis.zcard(key);

    if (requestCount >= 100) {
      throw new ThrottlerException('Too many requests');
    }

    await this.redis.zadd(key, now, `${now}-${Math.random()}`);
    await this.redis.expire(key, 60);

    return true;
  }
}

// Usage:
@Controller('api')
@UseGuards(RateLimitGuard)
export class AppController {
  // All routes protected by rate limiting
}
```

3. **Database Optimization** (20 min)
```typescript
// Read replicas for scaling reads
@Injectable()
export class ProductsService {
  constructor(
    @InjectDataSource('default')
    private writeDb: DataSource,
    @InjectDataSource('read-replica')
    private readDb: DataSource,
  ) {}

  async findAll(): Promise<Product[]> {
    // Use read replica for queries
    return this.readDb.getRepository(Product).find();
  }

  async create(dto: CreateProductDto): Promise<Product> {
    // Use primary for writes
    return this.writeDb.getRepository(Product).save(dto);
  }
}

// Connection pooling config
TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'ecommerce',
  entities: [Product, Order, User],
  extra: {
    max: 20, // Maximum pool size
    min: 5,  // Minimum pool size
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
}),
```

**Day 4 Deliverables:**
- [ ] Can implement multi-layer caching
- [ ] Can design cache invalidation strategy
- [ ] Can explain horizontal scaling
- [ ] Can implement rate limiting
- [ ] Can optimize database connections

---

### Day 5: Microservices & Advanced Patterns (3 hours)

**Session 1: Event-Driven Architecture (90 min)**

**Practice Scenario:**
```
Design an order processing system with these requirements:
1. When order is created, reserve inventory
2. Process payment asynchronously
3. Send confirmation email
4. Update analytics
5. Handle failures gracefully

Use event-driven architecture with message queues.
```

**Implementation:**
```typescript
// 1. Order Service - Publishes Events
@Injectable()
export class OrdersService {
  constructor(
    @Inject('RABBITMQ_CLIENT')
    private client: ClientProxy,
  ) {}

  async createOrder(dto: CreateOrderDto): Promise<Order> {
    // Create order in database
    const order = await this.repository.save({
      ...dto,
      status: OrderStatus.PENDING,
    });

    // Publish event
    this.client.emit('order.created', {
      orderId: order.id,
      userId: dto.userId,
      items: dto.items,
      total: order.total,
    });

    return order;
  }
}

// 2. Inventory Service - Listens for Events
@Controller()
export class InventoryController {
  @EventPattern('order.created')
  async handleOrderCreated(@Payload() data: OrderCreatedEvent) {
    try {
      // Reserve inventory
      await this.inventoryService.reserve(data.items);

      // Publish success event
      this.client.emit('inventory.reserved', {
        orderId: data.orderId,
      });
    } catch (error) {
      // Publish failure event
      this.client.emit('inventory.reservation.failed', {
        orderId: data.orderId,
        reason: error.message,
      });
    }
  }
}

// 3. Payment Service - Listens for Events
@Controller()
export class PaymentController {
  @EventPattern('inventory.reserved')
  async handleInventoryReserved(@Payload() data: any) {
    try {
      // Process payment
      const payment = await this.paymentService.process(data.orderId);

      // Publish success
      this.client.emit('payment.processed', {
        orderId: data.orderId,
        paymentId: payment.id,
      });
    } catch (error) {
      // Publish failure
      this.client.emit('payment.failed', {
        orderId: data.orderId,
        reason: error.message,
      });

      // Trigger compensation: release inventory
      this.client.emit('inventory.release', {
        orderId: data.orderId,
      });
    }
  }
}

// 4. Notification Service - Listens for Events
@Controller()
export class NotificationController {
  @EventPattern('payment.processed')
  async handlePaymentProcessed(@Payload() data: any) {
    // Send confirmation email
    await this.emailService.sendOrderConfirmation(data.orderId);
  }

  @EventPattern('payment.failed')
  async handlePaymentFailed(@Payload() data: any) {
    // Send failure notification
    await this.emailService.sendPaymentFailedNotification(data.orderId);
  }
}

// 5. Analytics Service - Listens for Events
@Controller()
export class AnalyticsController {
  @EventPattern('order.created')
  async trackOrderCreated(@Payload() data: OrderCreatedEvent) {
    await this.analyticsService.track('order_created', {
      orderId: data.orderId,
      total: data.total,
      itemCount: data.items.length,
    });
  }

  @EventPattern('payment.processed')
  async trackPaymentProcessed(@Payload() data: any) {
    await this.analyticsService.track('payment_processed', {
      orderId: data.orderId,
      paymentId: data.paymentId,
    });
  }
}
```

**Session 2: CQRS Pattern (90 min)**

**Implementation:**
```typescript
// commands/create-order.command.ts
export class CreateOrderCommand {
  constructor(
    public readonly userId: string,
    public readonly items: OrderItemDto[],
  ) {}
}

// commands/handlers/create-order.handler.ts
@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    private repository: OrderRepository,
    private eventBus: EventBus,
  ) {}

  async execute(command: CreateOrderCommand): Promise<Order> {
    const { userId, items } = command;

    // Validate
    await this.validateItems(items);

    // Calculate total
    const total = await this.calculateTotal(items);

    // Create order
    const order = await this.repository.save({
      userId,
      items,
      total,
      status: OrderStatus.PENDING,
    });

    // Publish domain event
    this.eventBus.publish(new OrderCreatedEvent(order));

    return order;
  }
}

// queries/get-user-orders.query.ts
export class GetUserOrdersQuery {
  constructor(
    public readonly userId: string,
    public readonly page: number = 1,
    public readonly limit: number = 20,
  ) {}
}

// queries/handlers/get-user-orders.handler.ts
@QueryHandler(GetUserOrdersQuery)
export class GetUserOrdersHandler implements IQueryHandler<GetUserOrdersQuery> {
  constructor(private repository: OrderReadRepository) {}

  async execute(query: GetUserOrdersQuery) {
    // Query from read model (potentially denormalized)
    return this.repository.findByUserId(
      query.userId,
      query.page,
      query.limit,
    );
  }
}

// Controller using CQRS
@Controller('orders')
export class OrdersController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() dto: CreateOrderDto, @User() user: any) {
    return this.commandBus.execute(
      new CreateOrderCommand(user.id, dto.items),
    );
  }

  @Get('my-orders')
  async getMyOrders(@User() user: any, @Query() query: PaginationDto) {
    return this.queryBus.execute(
      new GetUserOrdersQuery(user.id, query.page, query.limit),
    );
  }
}
```

**Day 5 Deliverables:**
- [ ] Can design event-driven workflows
- [ ] Can implement compensation logic
- [ ] Can implement CQRS pattern
- [ ] Can explain saga pattern

---

### Day 6: Performance & Optimization (2-3 hours)

**Session 1: Frontend Performance (90 min)**

**Topics covered:**
- Bundle analysis and optimization
- Image optimization strategies
- Code splitting patterns
- Lazy loading implementation
- Web Workers for heavy computation

**Session 2: Backend Performance (60-90 min)**

**Topics covered:**
- Query optimization and explain plans
- Indexing strategies
- Connection pooling
- API response optimization
- Profiling and monitoring

**Day 6 Deliverables:**
- [ ] Can optimize bundle size
- [ ] Can implement lazy loading
- [ ] Can optimize database queries
- [ ] Can use profiling tools

---

### Day 7: Mock Interview & Review (2-3 hours)

**Session 1: System Design Practice (90 min)**

Practice these scenarios with Claude:

1. **"Design a flash sale system"** (30 min)
2. **"Design a product recommendation engine"** (30 min)
3. **"Design a distributed shopping cart"** (30 min)

**Session 2: Code & Behavioral (90 min)**

1. **Live Coding** (45 min)
   - Implement cart functionality
   - Debug a performance issue
   - Review and refactor code

2. **Behavioral Questions** (45 min)
   - "Tell me about a challenging project"
   - "How do you handle conflicts?"
   - "Describe a time you optimized performance"

**Day 7 Deliverables:**
- [ ] Confident in system design
- [ ] Can code live
- [ ] Ready for behavioral questions
- [ ] Have questions for interviewer

---

## 🎯 Key Interview Questions (50 Total)

### System Design (10 questions)
1. Design an e-commerce checkout flow
2. Design a product search system
3. Design a flash sale system
4. Design a recommendation engine
5. Design a distributed cart
6. Design a payment processing system
7. Design an inventory management system
8. Design a notification system
9. Design an order tracking system
10. Design a review/rating system

### Architecture (10 questions)
11. Monolith vs Microservices trade-offs
12. Event-driven architecture pros/cons
13. CQRS pattern use cases
14. API Gateway pattern
15. Database sharding strategies
16. CAP theorem in practice
17. Saga pattern for distributed transactions
18. Circuit breaker pattern
19. Service mesh benefits
20. GraphQL vs REST trade-offs

### Frontend (10 questions)
21. Server vs Client Components
22. React performance optimization
23. State management approaches
24. Form handling and validation
25. Error boundary implementation
26. Code splitting strategies
27. Image optimization techniques
28. SSR vs SSG vs CSR
29. Custom hooks best practices
30. Testing React components

### Backend (10 questions)
31. NestJS dependency injection
32. Guards vs Interceptors vs Pipes
33. TypeORM query optimization
34. N+1 query prevention
35. Transaction handling
36. DTOs and validation
37. Authentication strategies
38. Authorization patterns
39. Error handling approaches
40. Logging best practices

### Performance (10 questions)
41. Core Web Vitals optimization
42. Caching strategies
43. Database indexing
44. Bundle size optimization
45. Rate limiting implementation
46. Load balancing approaches
47. CDN configuration
48. Query optimization
49. Connection pooling
50. Monitoring and alerting

---

## 💡 How to Use This Guide with Claude

### Daily Study Pattern

**Start of session:**
```
"Hey Claude, I'm on Day X of interview prep. Let's start with
[topic]. Can you quiz me on this?"
```

**During study:**
```
"Claude, here's my approach to [problem]. What am I missing?"

"Can you give me a code review scenario?"

"Let's do a mock system design: [scenario]"
```

**End of session:**
```
"Claude, summarize what I learned today and what to focus on tomorrow"
```

### Mock Interview Format

```
"Claude, let's do a 45-minute mock interview covering:
- 15 min: System design
- 15 min: Coding
- 15 min: Behavioral

Start with the system design question"
```

---

## 🚀 Final Preparation

### Day Before Interview

**Review Checklist (2 hours):**
- [ ] Review all 50 key questions
- [ ] Practice drawing architecture diagrams
- [ ] Review your strongest projects
- [ ] Prepare questions for interviewer
- [ ] Get good sleep!

### Morning of Interview

**30-Minute Warm-up:**
- [ ] Review one system design
- [ ] Code one simple feature
- [ ] Review behavioral answers
- [ ] Deep breaths!

---

## 🎯 Questions to Ask Interviewer

**Technical:**
1. "What's your current architecture?"
2. "What are your biggest technical challenges?"
3. "How do you handle deployment?"
4. "What's your testing strategy?"
5. "How do you monitor production?"

**Team:**
6. "How is the team structured?"
7. "What's the code review process?"
8. "How do you handle technical debt?"
9. "What's a typical sprint like?"
10. "How do you onboard new engineers?"

**Growth:**
11. "What would success look like in 6 months?"
12. "What learning opportunities exist?"
13. "How do you support career growth?"

---

**You're ready! Go crush that interview! 🚀**
