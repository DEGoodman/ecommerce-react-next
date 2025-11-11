# Phase 3: RUN - Enterprise Architecture with NestJS

## Overview

Welcome to the RUN phase - where you build **enterprise-grade, scalable architectures**! You'll migrate to NestJS microservices, implement GraphQL, build event-driven systems, and learn patterns used by companies serving millions of users.

This is where it all comes together. 🚀

---

## 🎓 Learning Objectives

By the end of this phase, you will:
- ✅ Master NestJS architecture and dependency injection
- ✅ Build microservices that communicate effectively
- ✅ Implement GraphQL API with Apollo Server
- ✅ Use event-driven architecture with message queues
- ✅ Implement CQRS pattern
- ✅ Set up Redis caching layers
- ✅ Build real-time features with WebSockets
- ✅ Implement API Gateway pattern
- ✅ Set up monitoring and observability
- ✅ Deploy with Docker orchestration

---

## 🛠️ Technology Stack Evolution

```
WALK → RUN

Next.js API Routes    → NestJS Microservices
Express.js            → NestJS Framework
Single database       → Polyglot persistence (PostgreSQL + Redis + MongoDB)
REST only             → REST + GraphQL + WebSockets
Synchronous           → Event-driven + Message Queues
Simple state          → CQRS + Event Sourcing
Basic monitoring      → Full observability (Prometheus + Grafana)
```

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        API Gateway                          │
│         (NestJS - Routing, Auth, Rate Limiting)            │
└─────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
┌────────▼────────┐ ┌────────▼────────┐ ┌────────▼────────┐
│  Product Service│ │   User Service  │ │  Order Service  │
│    (NestJS)     │ │    (NestJS)     │ │    (NestJS)     │
│   PostgreSQL    │ │   PostgreSQL    │ │   PostgreSQL    │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                  ┌───────────▼───────────┐
                  │   Message Queue       │
                  │   (RabbitMQ / Redis)  │
                  └───────────┬───────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
┌────────▼────────┐ ┌────────▼────────┐ ┌────────▼────────┐
│ Payment Service │ │ Notification    │ │  Search Service │
│    (NestJS)     │ │     Service     │ │   (NestJS)      │
│     Stripe      │ │    (NestJS)     │ │  Elasticsearch  │
└─────────────────┘ └─────────────────┘ └─────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              Shared Infrastructure                          │
│    Redis Cache │ MongoDB │ Prometheus │ Grafana            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
apps/run/
├── api-gateway/
│   ├── src/
│   │   ├── auth/
│   │   ├── graphql/
│   │   ├── rate-limiting/
│   │   └── main.ts
│   └── Dockerfile
├── services/
│   ├── product-service/
│   │   ├── src/
│   │   │   ├── products/
│   │   │   │   ├── dto/
│   │   │   │   ├── entities/
│   │   │   │   ├── products.controller.ts
│   │   │   │   ├── products.service.ts
│   │   │   │   └── products.module.ts
│   │   │   ├── events/
│   │   │   ├── database/
│   │   │   └── main.ts
│   │   └── Dockerfile
│   ├── user-service/
│   ├── order-service/
│   ├── payment-service/
│   ├── notification-service/
│   └── search-service/
├── shared/
│   ├── common/
│   ├── events/
│   └── database/
├── infrastructure/
│   ├── elasticsearch/
│   ├── redis/
│   ├── rabbitmq/
│   └── monitoring/
└── docker-compose.yml
```

---

## 🚀 Core Implementations

### 1. NestJS Microservice Setup

**Product Service:**
```typescript
// services/product-service/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // HTTP API
  const app = await NestFactory.create(AppModule);

  // Microservice (for inter-service communication)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: 'product_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3002);

  console.log('Product Service running on port 3002');
}

bootstrap();

// services/product-service/src/products/products.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    // Setup message queue client
    ClientsModule.register([
      {
        name: 'ORDER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: 'order_queue',
        },
      },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}

// services/product-service/src/products/products.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // HTTP endpoint
  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // Microservice message handler
  @MessagePattern('get_product')
  async handleGetProduct(@Payload() data: { id: string }) {
    return this.productsService.findOne(data.id);
  }

  @MessagePattern('update_stock')
  async handleUpdateStock(@Payload() data: { id: string; quantity: number }) {
    return this.productsService.updateStock(data.id, data.quantity);
  }
}

// services/product-service/src/products/products.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @Inject('ORDER_SERVICE')
    private orderServiceClient: ClientProxy,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOne(id: string): Promise<Product> {
    return this.productRepository.findOne({ where: { id } });
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    const saved = await this.productRepository.save(product);

    // Emit event
    this.orderServiceClient.emit('product_created', {
      productId: saved.id,
      name: saved.name,
      price: saved.price,
    });

    return saved;
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    product.stock -= quantity;
    return this.productRepository.save(product);
  }
}
```

---

### 2. GraphQL API Gateway

```typescript
// api-gateway/src/graphql/schema.graphql
type Product {
  id: ID!
  name: String!
  description: String!
  price: Float!
  category: String!
  stock: Int!
  imageUrl: String
  createdAt: DateTime!
}

type User {
  id: ID!
  email: String!
  name: String
  orders: [Order!]!
}

type Order {
  id: ID!
  user: User!
  items: [OrderItem!]!
  total: Float!
  status: OrderStatus!
  createdAt: DateTime!
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

type OrderItem {
  id: ID!
  product: Product!
  quantity: Int!
  price: Float!
}

type Query {
  products(category: String, search: String): [Product!]!
  product(id: ID!): Product
  me: User
  myOrders: [Order!]!
}

type Mutation {
  createOrder(items: [OrderItemInput!]!): Order!
  updateOrderStatus(orderId: ID!, status: OrderStatus!): Order!
}

type Subscription {
  orderStatusChanged(orderId: ID!): Order!
  productStockChanged(productId: ID!): Product!
}

input OrderItemInput {
  productId: ID!
  quantity: Int!
}

scalar DateTime

// api-gateway/src/graphql/resolvers/product.resolver.ts
import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Product } from '../models/product.model';

@Resolver(() => Product)
export class ProductResolver {
  constructor(
    @Inject('PRODUCT_SERVICE')
    private productService: ClientProxy,
  ) {}

  @Query(() => [Product])
  async products(
    @Args('category', { nullable: true }) category?: string,
    @Args('search', { nullable: true }) search?: string,
  ) {
    return this.productService
      .send('get_products', { category, search })
      .toPromise();
  }

  @Query(() => Product, { nullable: true })
  async product(@Args('id') id: string) {
    return this.productService.send('get_product', { id }).toPromise();
  }
}

// api-gateway/src/graphql/resolvers/order.resolver.ts
import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PubSub } from 'graphql-subscriptions';
import { Order } from '../models/order.model';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { CurrentUser } from '../../auth/current-user.decorator';

const pubSub = new PubSub();

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    @Inject('ORDER_SERVICE')
    private orderService: ClientProxy,
  ) {}

  @Query(() => [Order])
  @UseGuards(GqlAuthGuard)
  async myOrders(@CurrentUser() user: any) {
    return this.orderService
      .send('get_user_orders', { userId: user.id })
      .toPromise();
  }

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard)
  async createOrder(
    @CurrentUser() user: any,
    @Args('items', { type: () => [OrderItemInput] }) items: OrderItemInput[],
  ) {
    const order = await this.orderService
      .send('create_order', { userId: user.id, items })
      .toPromise();

    pubSub.publish('orderCreated', { orderCreated: order });

    return order;
  }

  @Subscription(() => Order)
  orderStatusChanged(@Args('orderId') orderId: string) {
    return pubSub.asyncIterator(`orderStatusChanged_${orderId}`);
  }
}
```

---

### 3. Event-Driven Architecture

```typescript
// shared/events/event.interface.ts
export interface Event {
  eventType: string;
  timestamp: Date;
  aggregateId: string;
  data: any;
}

// shared/events/product.events.ts
export class ProductCreatedEvent implements Event {
  eventType = 'ProductCreated';
  timestamp = new Date();

  constructor(
    public aggregateId: string,
    public data: {
      name: string;
      price: number;
      category: string;
    },
  ) {}
}

export class ProductStockChangedEvent implements Event {
  eventType = 'ProductStockChanged';
  timestamp = new Date();

  constructor(
    public aggregateId: string,
    public data: {
      oldStock: number;
      newStock: number;
    },
  ) {}
}

// services/order-service/src/events/handlers/product-created.handler.ts
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProductCreatedEvent } from '@shared/events/product.events';
import { SearchService } from '../../search/search.service';

@EventsHandler(ProductCreatedEvent)
export class ProductCreatedHandler implements IEventHandler<ProductCreatedEvent> {
  constructor(private searchService: SearchService) {}

  async handle(event: ProductCreatedEvent) {
    console.log(`Product created: ${event.aggregateId}`);

    // Index in Elasticsearch
    await this.searchService.indexProduct({
      id: event.aggregateId,
      ...event.data,
    });

    // Send notification
    // Update cache
    // etc.
  }
}

// services/order-service/src/orders/orders.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { OrderCreatedEvent } from '../events/order.events';

@Injectable()
export class OrdersService {
  constructor(
    private eventBus: EventBus,
    @Inject('PRODUCT_SERVICE')
    private productService: ClientProxy,
    @Inject('PAYMENT_SERVICE')
    private paymentService: ClientProxy,
  ) {}

  async createOrder(userId: string, items: OrderItemInput[]) {
    // 1. Reserve stock (send message to product service)
    const stockReservations = await Promise.all(
      items.map(item =>
        this.productService
          .send('reserve_stock', {
            productId: item.productId,
            quantity: item.quantity,
          })
          .toPromise(),
      ),
    );

    // 2. Calculate total
    const total = stockReservations.reduce(
      (sum, reservation) => sum + reservation.price * reservation.quantity,
      0,
    );

    // 3. Create order
    const order = await this.orderRepository.save({
      userId,
      items,
      total,
      status: OrderStatus.PENDING,
    });

    // 4. Process payment (async via message queue)
    this.paymentService.emit('process_payment', {
      orderId: order.id,
      amount: total,
      userId,
    });

    // 5. Publish event
    this.eventBus.publish(
      new OrderCreatedEvent(order.id, {
        userId,
        items,
        total,
      }),
    );

    return order;
  }
}
```

---

### 4. CQRS Pattern

```typescript
// services/order-service/src/orders/commands/create-order.command.ts
export class CreateOrderCommand {
  constructor(
    public readonly userId: string,
    public readonly items: OrderItemInput[],
  ) {}
}

// services/order-service/src/orders/commands/handlers/create-order.handler.ts
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { CreateOrderCommand } from '../create-order.command';
import { OrderCreatedEvent } from '../../events/order-created.event';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    private orderRepository: OrderRepository,
    private eventBus: EventBus,
  ) {}

  async execute(command: CreateOrderCommand) {
    const { userId, items } = command;

    // Business logic
    const order = await this.orderRepository.save({
      userId,
      items,
      status: 'PENDING',
    });

    // Publish event
    this.eventBus.publish(new OrderCreatedEvent(order.id, order));

    return order;
  }
}

// services/order-service/src/orders/queries/get-user-orders.query.ts
export class GetUserOrdersQuery {
  constructor(public readonly userId: string) {}
}

// services/order-service/src/orders/queries/handlers/get-user-orders.handler.ts
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserOrdersQuery } from '../get-user-orders.query';

@QueryHandler(GetUserOrdersQuery)
export class GetUserOrdersHandler implements IQueryHandler<GetUserOrdersQuery> {
  constructor(private orderRepository: OrderRepository) {}

  async execute(query: GetUserOrdersQuery) {
    return this.orderRepository.find({
      where: { userId: query.userId },
      order: { createdAt: 'DESC' },
    });
  }
}

// Usage in controller
@Controller('orders')
export class OrdersController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @User() user: any) {
    return this.commandBus.execute(
      new CreateOrderCommand(user.id, createOrderDto.items),
    );
  }

  @Get('my-orders')
  async getMyOrders(@User() user: any) {
    return this.queryBus.execute(new GetUserOrdersQuery(user.id));
  }
}
```

---

### 5. Redis Caching Strategy

```typescript
// shared/cache/cache.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cacheManager.get<T>(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async wrap<T>(key: string, fn: () => Promise<T>, ttl?: number): Promise<T> {
    return await this.cacheManager.wrap(key, fn, ttl);
  }
}

// Usage in product service
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private cacheService: CacheService,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.cacheService.wrap(
      'products:all',
      () => this.productRepository.find(),
      3600, // 1 hour
    );
  }

  async findOne(id: string): Promise<Product> {
    return this.cacheService.wrap(
      `product:${id}`,
      () => this.productRepository.findOne({ where: { id } }),
      7200, // 2 hours
    );
  }

  async update(id: string, updateDto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.save({ id, ...updateDto });

    // Invalidate cache
    await this.cacheService.del(`product:${id}`);
    await this.cacheService.del('products:all');

    return product;
  }
}
```

---

## 🐳 Docker Compose for Microservices

```yaml
version: '3.8'

services:
  # API Gateway
  api-gateway:
    build: ./api-gateway
    ports:
      - "3000:3000"
    environment:
      - PRODUCT_SERVICE_URL=product-service:3002
      - USER_SERVICE_URL=user-service:3003
      - ORDER_SERVICE_URL=order-service:3004
      - RABBITMQ_URL=amqp://rabbitmq:5672
      - REDIS_URL=redis://redis:6379
    depends_on:
      - rabbitmq
      - redis
      - product-service
      - user-service
      - order-service

  # Product Service
  product-service:
    build: ./services/product-service
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/products
      - RABBITMQ_URL=amqp://rabbitmq:5672
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - rabbitmq
      - redis

  # User Service
  user-service:
    build: ./services/user-service
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/users
      - RABBITMQ_URL=amqp://rabbitmq:5672
    depends_on:
      - postgres
      - rabbitmq

  # Order Service
  order-service:
    build: ./services/order-service
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/orders
      - RABBITMQ_URL=amqp://rabbitmq:5672
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - rabbitmq
      - redis

  # Payment Service
  payment-service:
    build: ./services/payment-service
    environment:
      - STRIPE_API_KEY=${STRIPE_API_KEY}
      - RABBITMQ_URL=amqp://rabbitmq:5672
    depends_on:
      - rabbitmq

  # Notification Service
  notification-service:
    build: ./services/notification-service
    environment:
      - RABBITMQ_URL=amqp://rabbitmq:5672
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_PORT=${SMTP_PORT}
    depends_on:
      - rabbitmq

  # Search Service
  search-service:
    build: ./services/search-service
    environment:
      - ELASTICSEARCH_URL=http://elasticsearch:9200
      - RABBITMQ_URL=amqp://rabbitmq:5672
    depends_on:
      - elasticsearch
      - rabbitmq

  # Infrastructure
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  rabbitmq:
    image: rabbitmq:3-management-alpine
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      - RABBITMQ_DEFAULT_USER=admin
      - RABBITMQ_DEFAULT_PASS=admin

  elasticsearch:
    image: elasticsearch:8.8.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"

  # Monitoring
  prometheus:
    image: prom/prometheus
    volumes:
      - ./infrastructure/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  postgres_data:
  grafana_data:
```

---

## ✅ Completion Checklist

### Architecture
- [ ] API Gateway implemented
- [ ] 5+ microservices running
- [ ] Message queue communication
- [ ] Event-driven patterns
- [ ] CQRS implementation

### Features
- [ ] GraphQL API
- [ ] WebSocket subscriptions
- [ ] Payment integration
- [ ] Search with Elasticsearch
- [ ] Real-time notifications

### Infrastructure
- [ ] Redis caching
- [ ] RabbitMQ message queue
- [ ] Monitoring with Prometheus
- [ ] Dashboards with Grafana
- [ ] Docker orchestration

### Patterns
- [ ] Dependency injection
- [ ] Repository pattern
- [ ] CQRS
- [ ] Event sourcing (basic)
- [ ] Circuit breaker (optional)
- [ ] Saga pattern (optional)

---

## 🎯 Next Steps

Ready to optimize? Move to [Phase 4: OPTIMIZE](04-optimize.md) where you'll learn:
- Performance optimization
- McMaster-Carr techniques
- CDN configuration
- Advanced caching
- Monitoring best practices

---

**Congratulations! You're building enterprise-grade systems! 🏆**
