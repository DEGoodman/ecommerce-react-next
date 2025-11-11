# Architecture Overview

## System Architecture

This project follows a **monorepo architecture** with clear separation between frontend and backend, communicating via RESTful APIs.

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│                     (localhost:3000)                         │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/HTTPS
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   Next.js Frontend                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  App Router (React Server Components)                │  │
│  │  ├── Pages & Layouts                                 │  │
│  │  ├── Client Components (Interactive UI)             │  │
│  │  └── API Client (Axios)                             │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API
                         │ (localhost:3001/api)
┌────────────────────────▼────────────────────────────────────┐
│                   NestJS Backend                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Controllers (HTTP Endpoints)                        │  │
│  │  ├── Products Controller                            │  │
│  │  ├── Auth Controller                                │  │
│  │  ├── Cart Controller                                │  │
│  │  └── Orders Controller                              │  │
│  └──────────────────────┬───────────────────────────────┘  │
│                          │                                   │
│  ┌──────────────────────▼───────────────────────────────┐  │
│  │  Services (Business Logic)                           │  │
│  │  ├── Products Service                                │  │
│  │  ├── Users Service                                   │  │
│  │  └── Auth Service                                    │  │
│  └──────────────────────┬───────────────────────────────┘  │
│                          │                                   │
│  ┌──────────────────────▼───────────────────────────────┐  │
│  │  Repositories (TypeORM)                              │  │
│  │  ├── Product Repository                             │  │
│  │  ├── User Repository                                │  │
│  │  └── Order Repository                               │  │
│  └──────────────────────┬───────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────┘
                          │ SQL
┌─────────────────────────▼───────────────────────────────────┐
│              PostgreSQL Database                             │
│                  (localhost:5432)                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Tables: products, users, orders, cart_items         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Design Patterns

### 1. **Layered Architecture**

Each layer has a specific responsibility:

**Presentation Layer (Frontend)**
- React components for UI
- Client-side routing
- State management
- API communication

**API Layer (Backend Controllers)**
- HTTP request handling
- Input validation (DTOs)
- Response formatting
- Authentication/Authorization

**Business Logic Layer (Services)**
- Core business rules
- Data transformation
- Complex operations
- Cross-cutting concerns

**Data Access Layer (Repositories)**
- Database operations
- Query building
- Transaction management
- Data mapping

### 2. **Dependency Injection**

NestJS uses dependency injection throughout:

```typescript
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
}
```

**Benefits:**
- Loose coupling
- Easy testing (mock dependencies)
- Better code organization
- Lifecycle management

### 3. **Repository Pattern**

TypeORM implements the repository pattern:

```typescript
// Abstract database operations
const products = await this.productRepository.find()
const product = await this.productRepository.findOne({ where: { id } })
await this.productRepository.save(product)
```

**Benefits:**
- Database abstraction
- Reusable queries
- Easier testing
- Consistent data access

### 4. **DTO (Data Transfer Object) Pattern**

DTOs define and validate data shape:

```typescript
export class CreateProductDto {
  @IsString()
  name: string

  @IsNumber()
  price: number
}
```

**Benefits:**
- Input validation
- Type safety
- API contract definition
- Documentation

## Module Structure

### Frontend (Next.js)

```
src/
├── app/                    # App Router (routes)
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── products/          # Products pages
├── components/            # Reusable components
│   └── ProductCard.tsx
├── lib/                   # Utilities
│   └── api.ts            # API client
└── types/                # TypeScript types
    └── index.ts
```

**Key Concepts:**
- **App Router**: File-based routing
- **Server Components**: Default, render on server
- **Client Components**: Interactive, marked with 'use client'
- **Layouts**: Shared UI across routes

### Backend (NestJS)

```
src/
├── products/              # Product feature
│   ├── product.entity.ts  # Database model
│   ├── products.controller.ts
│   ├── products.service.ts
│   ├── products.module.ts
│   └── dto/
│       ├── create-product.dto.ts
│       └── update-product.dto.ts
├── users/                 # User feature
├── auth/                  # Authentication
└── main.ts               # Application entry
```

**Key Concepts:**
- **Modules**: Feature containers
- **Controllers**: HTTP endpoints
- **Services**: Business logic
- **Entities**: Database models
- **DTOs**: Data validation

## Data Flow

### Example: Fetching Products

```
1. User visits /products
   ↓
2. Next.js Server Component renders
   ↓
3. API Client calls GET /api/products
   ↓
4. NestJS ProductsController receives request
   ↓
5. ProductsController calls ProductsService
   ↓
6. ProductsService queries database via Repository
   ↓
7. PostgreSQL returns data
   ↓
8. Data flows back through layers
   ↓
9. JSON response sent to frontend
   ↓
10. React renders products
```

### Example: Creating a Product

```
1. User fills form and submits
   ↓
2. Client-side validation
   ↓
3. POST /api/products with data
   ↓
4. NestJS validates DTO (CreateProductDto)
   ↓
5. ProductsService.create() called
   ↓
6. Repository saves to database
   ↓
7. Success response
   ↓
8. Frontend updates UI
```

## Environment Configuration

### Development
- Frontend: Hot reload on code changes
- Backend: Watch mode, auto-restart
- Database: Docker container
- All services communicate via localhost

### Production (Future)
- Frontend: Static generation + SSR
- Backend: Compiled, optimized
- Database: Managed service (AWS RDS, etc.)
- Services: Containerized, orchestrated

## Security Architecture

### Current Implementation
- CORS configured for frontend domain
- Password hashing with bcrypt
- TypeORM prevents SQL injection
- DTO validation prevents bad data

### Planned Features
- JWT authentication
- Role-based access control (RBAC)
- Rate limiting
- Input sanitization
- HTTPS enforcement
- Secure headers (Helmet)

## Scalability Considerations

### Current State (Phase 1)
- Monolithic architecture
- Single database
- Direct API calls

### Future Evolution

**Phase 2: Optimization**
- Redis caching
- Database indexing
- CDN for static assets
- Connection pooling

**Phase 3: Microservices**
- Split into services (Auth, Products, Orders)
- API Gateway
- Message queue (RabbitMQ)
- Service discovery

**Phase 4: Cloud-Native**
- Kubernetes orchestration
- Horizontal scaling
- Load balancers
- Database replication
- Multi-region deployment

## Why This Architecture?

### For Learning
- Clear separation of concerns
- Industry-standard patterns
- Gradual complexity increase
- Real-world applicability

### For Development
- Fast iteration
- Easy debugging
- Familiar structure
- Good DX (Developer Experience)

### For Production
- Maintainable
- Testable
- Scalable
- Secure

## Next Steps

1. Understand the current architecture
2. Follow the data flow in code
3. Experiment with adding features
4. Read specific guides:
   - [Frontend Guide](01-frontend.md)
   - [Backend Guide](02-backend.md)
   - [Database Design](03-database.md)

---

**Remember:** Start simple, understand the basics, then gradually add complexity. This architecture supports growth from a learning project to an enterprise application.
