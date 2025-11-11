# Database Design & PostgreSQL

## Overview

This project uses PostgreSQL as the relational database, accessed through TypeORM. This guide covers database design principles, schema, and common operations.

## Why PostgreSQL?

**Advantages:**
- ✅ ACID compliance (Atomicity, Consistency, Isolation, Durability)
- ✅ Advanced features (JSON, full-text search, arrays)
- ✅ Excellent performance
- ✅ Strong community and tooling
- ✅ Free and open-source

## Current Schema

### Products Table

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(255) NOT NULL,
  stock INTEGER DEFAULT 0,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_price ON products(price);
```

**Columns:**
- `id`: Unique identifier (UUID for better distribution)
- `name`: Product name
- `description`: Detailed description
- `price`: Price with 2 decimal places
- `category`: Product category
- `stock`: Available quantity
- `image_url`: Product image URL
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,  -- Hashed with bcrypt
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_users_email ON users(email);
```

**Security:**
- Passwords are hashed with bcrypt (never stored plain)
- Email is unique (enforced at DB level)

## TypeORM Entities

### Defining Entities

Entities in TypeORM map to database tables:

```typescript
@Entity('products')
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

### Entity Decorators

**Column Types:**
```typescript
@Column()                    // Default: varchar(255)
@Column('text')             // TEXT
@Column('int')              // INTEGER
@Column('decimal')          // DECIMAL
@Column('boolean')          // BOOLEAN
@Column('json')             // JSON
@Column('timestamp')        // TIMESTAMP
```

**Column Options:**
```typescript
@Column({ nullable: true })     // Can be NULL
@Column({ default: 0 })        // Default value
@Column({ unique: true })      // Unique constraint
@Column({ length: 500 })       // Max length
@Column({ select: false })     // Don't select by default
```

**Special Columns:**
```typescript
@PrimaryGeneratedColumn('uuid')  // UUID primary key
@PrimaryColumn()                 // Manual primary key
@CreateDateColumn()              // Auto-set on insert
@UpdateDateColumn()              // Auto-update on change
```

## Database Relationships

### One-to-Many

**Example: User → Orders**

```typescript
// User entity
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToMany(() => Order, order => order.user)
  orders: Order[]
}

// Order entity
@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, user => user.orders)
  user: User

  @Column()
  userId: string
}
```

**SQL Generated:**
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  ...
);
```

### Many-to-Many

**Example: Products ↔ Categories**

```typescript
@Entity()
export class Product {
  @ManyToMany(() => Category, category => category.products)
  @JoinTable()  // Creates join table
  categories: Category[]
}

@Entity()
export class Category {
  @ManyToMany(() => Product, product => product.categories)
  categories: Product[]
}
```

**SQL Generated:**
```sql
CREATE TABLE product_categories_category (
  product_id UUID REFERENCES products(id),
  category_id UUID REFERENCES categories(id),
  PRIMARY KEY (product_id, category_id)
);
```

### One-to-One

**Example: User → Profile**

```typescript
@Entity()
export class User {
  @OneToOne(() => Profile, profile => profile.user)
  @JoinColumn()
  profile: Profile
}

@Entity()
export class Profile {
  @OneToOne(() => User, user => user.profile)
  user: User
}
```

## Querying

### Basic Queries

```typescript
// Find all
await repository.find()

// Find one by ID
await repository.findOne({ where: { id: '123' } })

// Find with conditions
await repository.find({
  where: { category: 'electronics' }
})

// Find with multiple conditions
await repository.find({
  where: { category: 'electronics', stock: MoreThan(0) }
})
```

### Advanced Queries

**Ordering:**
```typescript
await repository.find({
  order: { price: 'ASC', createdAt: 'DESC' }
})
```

**Pagination:**
```typescript
await repository.find({
  skip: 20,   // Offset
  take: 10,   // Limit
})
```

**Selecting Fields:**
```typescript
await repository.find({
  select: ['id', 'name', 'price']
})
```

**Relations:**
```typescript
await repository.find({
  relations: ['orders', 'orders.items']
})
```

### Query Builder

For complex queries:

```typescript
const products = await repository
  .createQueryBuilder('product')
  .where('product.price > :price', { price: 100 })
  .andWhere('product.stock > 0')
  .orderBy('product.createdAt', 'DESC')
  .take(10)
  .getMany()
```

**Joins:**
```typescript
const orders = await orderRepository
  .createQueryBuilder('order')
  .leftJoinAndSelect('order.user', 'user')
  .leftJoinAndSelect('order.items', 'items')
  .where('user.id = :userId', { userId })
  .getMany()
```

**Aggregations:**
```typescript
const stats = await repository
  .createQueryBuilder('product')
  .select('AVG(product.price)', 'avgPrice')
  .addSelect('COUNT(*)', 'total')
  .getRawOne()
```

## Migrations

### Why Migrations?

- Track database changes over time
- Version control for schema
- Easy rollback
- Safe deployments

### Creating Migrations

```bash
# Generate migration from entity changes
pnpm --filter @ecommerce/backend run typeorm migration:generate -n AddProductReviews

# Create empty migration
pnpm --filter @ecommerce/backend run typeorm migration:create -n SeedProducts
```

### Migration File

```typescript
export class AddProductReviews1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'reviews',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'product_id',
            type: 'uuid',
          },
          {
            name: 'rating',
            type: 'int',
          },
          {
            name: 'comment',
            type: 'text',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['product_id'],
            referencedTableName: 'products',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('reviews')
  }
}
```

### Running Migrations

```bash
# Run all pending migrations
pnpm --filter @ecommerce/backend run typeorm migration:run

# Revert last migration
pnpm --filter @ecommerce/backend run typeorm migration:revert
```

## Seeding Data

### Seed Script

```typescript
// src/database/seeds/products.seed.ts
export const seedProducts = async (dataSource: DataSource) => {
  const productRepository = dataSource.getRepository(Product)

  const products = [
    {
      name: 'Laptop',
      description: 'High-performance laptop',
      price: 999.99,
      category: 'electronics',
      stock: 50,
    },
    {
      name: 'Phone',
      description: 'Smartphone with great camera',
      price: 699.99,
      category: 'electronics',
      stock: 100,
    },
  ]

  for (const product of products) {
    const exists = await productRepository.findOne({
      where: { name: product.name }
    })

    if (!exists) {
      await productRepository.save(product)
    }
  }

  console.log('✅ Products seeded')
}
```

## Indexing

### Why Index?

Indexes speed up queries but slow down writes:

```typescript
// Without index: Full table scan O(n)
SELECT * FROM products WHERE category = 'electronics'

// With index: Fast lookup O(log n)
CREATE INDEX idx_products_category ON products(category)
```

### Creating Indexes in TypeORM

```typescript
@Entity()
@Index(['category'])  // Single column
@Index(['category', 'price'])  // Composite
export class Product {
  @Column()
  @Index()  // Index on column
  category: string
}
```

### When to Index?

**Good Candidates:**
- ✅ Foreign keys
- ✅ Columns in WHERE clauses
- ✅ Columns in JOIN conditions
- ✅ Columns in ORDER BY

**Avoid:**
- ❌ Small tables
- ❌ Frequently updated columns
- ❌ Low-cardinality columns (few distinct values)

## Transactions

### Why Transactions?

Ensure multiple operations succeed or fail together:

```typescript
// Without transaction - DANGEROUS!
await productRepository.save(product)
await orderRepository.save(order)
// If this fails, product is saved but order isn't!

// With transaction - SAFE!
await dataSource.transaction(async (manager) => {
  await manager.save(product)
  await manager.save(order)
  // Both succeed or both fail
})
```

### Using Transactions

```typescript
async createOrder(dto: CreateOrderDto) {
  return await this.dataSource.transaction(async (manager) => {
    // 1. Create order
    const order = manager.create(Order, dto)
    await manager.save(order)

    // 2. Reduce stock
    const product = await manager.findOne(Product, {
      where: { id: dto.productId }
    })

    if (product.stock < dto.quantity) {
      throw new BadRequestException('Insufficient stock')
    }

    product.stock -= dto.quantity
    await manager.save(product)

    // 3. Create order items
    const item = manager.create(OrderItem, {
      order,
      product,
      quantity: dto.quantity,
    })
    await manager.save(item)

    return order
  })
}
```

## Performance Tips

### 1. Use Pagination

```typescript
// Bad: Load everything
const products = await repository.find()

// Good: Paginate
const products = await repository.find({
  skip: page * limit,
  take: limit,
})
```

### 2. Select Only Needed Fields

```typescript
// Bad: Load all columns
const users = await repository.find()

// Good: Select specific fields
const users = await repository.find({
  select: ['id', 'email', 'name']
})
```

### 3. Avoid N+1 Queries

```typescript
// Bad: N+1 queries
const orders = await orderRepository.find()
for (const order of orders) {
  order.user = await userRepository.findOne({ where: { id: order.userId } })
}

// Good: Join in one query
const orders = await orderRepository.find({
  relations: ['user']
})
```

### 4. Use Indexes

```typescript
// Add indexes to frequently queried columns
@Index(['email'])
@Index(['category'])
@Index(['createdAt'])
```

### 5. Connection Pooling

```typescript
// Already configured in app.module.ts
TypeOrmModule.forRoot({
  // ...
  extra: {
    max: 10,  // Maximum connections
    idleTimeoutMillis: 30000,
  }
})
```

## Database Management

### Connect to Database

```bash
# Using Docker
make db-shell

# Or directly
psql -h localhost -U postgres -d ecommerce
```

### Useful SQL Commands

```sql
-- List tables
\dt

-- Describe table
\d products

-- View data
SELECT * FROM products LIMIT 10;

-- Count records
SELECT COUNT(*) FROM products;

-- Delete all data
TRUNCATE products CASCADE;

-- Drop table
DROP TABLE products;
```

### Backup & Restore

```bash
# Backup
docker-compose exec postgres pg_dump -U postgres ecommerce > backup.sql

# Restore
docker-compose exec -T postgres psql -U postgres ecommerce < backup.sql
```

## Future Enhancements

### Phase 2
- [ ] Add indexes for performance
- [ ] Implement migrations
- [ ] Add seed data
- [ ] Full-text search
- [ ] Soft deletes

### Phase 3
- [ ] Database replication
- [ ] Read replicas
- [ ] Caching layer (Redis)
- [ ] Connection pooling optimization

### Phase 4
- [ ] Sharding
- [ ] Multi-region deployment
- [ ] Event sourcing
- [ ] CQRS pattern

## Exercises

### Beginner
1. ✏️ Add a new column to Product entity
2. ✏️ Create a seed script for test data
3. ✏️ Write queries to filter products

### Intermediate
4. ✏️ Add Reviews entity with relationship
5. ✏️ Create a migration
6. ✏️ Implement full-text search

### Advanced
7. ✏️ Add composite indexes
8. ✏️ Implement soft deletes
9. ✏️ Optimize a slow query

## Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeORM Documentation](https://typeorm.io)
- [SQL Tutorial](https://www.sqltutorial.org/)

## Next Steps

- Review [Docker Guide](04-docker.md)
- Practice writing queries
- Try the exercises above
- Optimize existing queries
