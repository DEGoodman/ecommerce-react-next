# Sprint Day 1: E-Commerce Architecture Deep Dive

**Date**: November 11, 2025
**Topic**: Core Architecture & System Design
**Focus**: Monolith → Microservices Evolution, Database Optimization, CDC, Read Replicas

---

## Table of Contents

1. [System Architecture: Startup MVP](#system-architecture-startup-mvp)
2. [Scaling Strategy: 100K Users](#scaling-strategy-100k-users)
3. [Search: PostgreSQL vs Elasticsearch](#search-postgresql-vs-elasticsearch)
4. [Change Data Capture (CDC) & Debezium](#change-data-capture-cdc--debezium)
5. [Read Replica Consistency Strategies](#read-replica-consistency-strategies)
6. [Key Takeaways](#key-takeaways)

---

## System Architecture: Startup MVP

### Interview Question
> "Walk me through how you would architect an e-commerce platform for a startup vs an enterprise company."

### Context
- **Timeline**: 6-8 weeks to MVP
- **Scale**: 1,000-5,000 initial users
- **Budget**: Tight - small team, limited infrastructure
- **Priority**: Get to market fast, validate product-market fit
- **Features**: Product catalog, cart, checkout, user accounts

### Architecture Decision: Monolith

**Choice**: Single application server (monolith) with Docker + nginx from day 1

#### Tech Stack
```
Frontend:  Next.js 14 (App Router)
Backend:   Next.js API Routes (could also use Express/NestJS)
Database:  PostgreSQL
ORM:       Prisma (type-safe, fast schema iteration)
Container: Docker
Proxy:     nginx
```

#### Why This Stack?

**Next.js 14**:
- Frontend + backend in one codebase
- Server Components reduce JavaScript bundle
- Built-in API routes for backend logic
- Fast development with TypeScript
- Easy deployment (Vercel, Railway, etc.)

**PostgreSQL over NoSQL**:
- Strong ACID guarantees (critical for orders/payments)
- Excellent support for complex queries
- Great ecosystem and tooling
- Handles relational data (products, orders, users) naturally

**Docker + nginx from Day 1**:
- Consistency: Dev/staging/prod all identical
- Easy horizontal scaling later (just add containers)
- nginx handles SSL and static assets efficiently
- Professional production setup from the start

#### API Structure (RESTful)

**Use PLURAL for collections**:
```
GET    /api/products          - List all products
GET    /api/products/:id      - Get specific product
POST   /api/products          - Create product (admin)
PATCH  /api/products/:id      - Update product (admin)
DELETE /api/products/:id      - Delete product (admin)

POST   /api/cart/items        - Add item to cart
PATCH  /api/cart/items/:id    - Update quantity
DELETE /api/cart/items/:id    - Remove item
GET    /api/cart              - Get user's cart (singleton)

POST   /api/orders            - Create order
GET    /api/orders            - List user's orders
GET    /api/orders/:id        - Get order details

POST   /api/auth/login        - Login
POST   /api/auth/register     - Register
POST   /api/auth/logout       - Logout
```

**Note**: Use plural for collections (`/products`), singular for singletons (`/cart`, `/profile`)

#### What We're NOT Doing (Yet)

- ❌ Microservices (too much overhead for small team)
- ❌ Advanced caching (Redis)
- ❌ Load balancing (not needed yet)
- ❌ Comprehensive testing (just critical paths)
- ❌ Advanced CI/CD
- ❌ Multiple databases

**Rationale**: Start simple. Add complexity when you hit actual bottlenecks.

#### Production-Ready MVP Definition

**Included**:
- Deployed with HTTPS
- Basic authentication (NextAuth.js or Passport)
- Error boundaries and basic error handling
- Simple monitoring (healthcheck endpoint)
- Database backups

**Not Included**:
- Advanced caching layers
- Load balancing
- Comprehensive test coverage
- Advanced observability

#### Timeline Estimate
- **4-6 weeks** with 2 developers
- **2-4 weeks** for basic POC
- Additional 2 weeks for testing and polish

---

## Scaling Strategy: 100K Users

### Interview Question
> "Fast-forward 12 months. Your MVP succeeded, you have 100K users, and the database is slowing down on product searches. What's your scaling strategy?"

### Context
- Read/Write ratio: **95:5 to 99:1** (typical for e-commerce)
- Products update infrequently (few times per day)
- Products searched/viewed hundreds of thousands of times per day
- Database queries are the bottleneck

### Optimization Strategy: Prioritize by Effort

#### Quick Wins (Same Day)

**1. Add Database Indexes**

```sql
-- Index columns users search by
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_name ON products USING GIN(to_tsvector('english', name));
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Composite index for common filters
CREATE INDEX idx_products_category_price ON products(category, price);
```

**Trade-off**:
- ✅ Dramatically speeds up reads (10-100x)
- ⚠️ Slightly slows down writes (must update index)
- ✅ With 95:5 read/write ratio, absolutely worth it

**2. Query Optimization**

```sql
-- Review slow query logs
-- Add EXPLAIN ANALYZE to identify issues
EXPLAIN ANALYZE
SELECT * FROM products
WHERE category = 'laptops'
AND price < 1000
ORDER BY created_at DESC
LIMIT 20;
```

#### Medium Effort (1-2 Weeks)

**3. Add Redis Caching Layer**

```typescript
// Multi-layer caching strategy
class ProductService {
  async getProduct(id: string) {
    // Layer 1: Check Redis cache
    const cached = await redis.get(`product:${id}`);
    if (cached) return JSON.parse(cached);

    // Layer 2: Query database
    const product = await db.product.findUnique({ where: { id } });

    // Layer 3: Store in cache (TTL: 5 minutes)
    await redis.setex(`product:${id}`, 300, JSON.stringify(product));

    return product;
  }

  async updateProduct(id: string, data: any) {
    // Update database
    const product = await db.product.update({ where: { id }, data });

    // Invalidate cache immediately for price changes
    if (data.price) {
      await redis.del(`product:${id}`);
    }

    return product;
  }
}
```

**What to Cache**:

```
Layer 1: Hot Products (TTL: 5-10 min)
- Key: product:{id}
- Coverage: Top 100 products = 80%+ of traffic
- Hit rate: 80%+

Layer 2: Search Results (TTL: 5 min)
- Key: search:{query}:{filters}
- Dramatically reduces DB load
- Hit rate: 60%+

Layer 3: Category Pages (TTL: 10 min)
- Key: category:{id}:{page}
- Common browsing patterns
- Hit rate: 70%+
```

**Invalidation Strategy**:
- **Hybrid approach** (TTL + event-based)
- Price changes → immediate invalidation
- Description updates → wait for TTL
- Inventory → depends on tolerance for staleness

**4. Database Read Replicas**

```
Primary DB (writes only)
    ↓ Replication
Read Replica 1 ← Product searches
Read Replica 2 ← Category browsing
Read Replica 3 ← Analytics queries
```

**Benefits**:
- Distributes read load across multiple databases
- Primary handles only writes
- Can add more replicas as needed
- Cheaper than scaling app servers

**Implementation**:
```typescript
// Route reads to replicas, writes to primary
class DatabaseService {
  primary: PrismaClient;    // Write operations
  replica: PrismaClient;    // Read operations

  async getProducts(filters: any) {
    // Read from replica
    return this.replica.product.findMany({ where: filters });
  }

  async updateProduct(id: string, data: any) {
    // Write to primary
    return this.primary.product.update({ where: { id }, data });
  }
}
```

#### Larger Effort (If Still Not Enough)

**5. Horizontal Scaling of App Servers**

```
User Request
    ↓
Load Balancer (nginx/ALB)
    ↓ ↓ ↓
Server 1  Server 2  Server 3
    ↓ ↓ ↓
Redis (shared sessions)
    ↓
Primary DB (writes)
    ↓
Read Replicas (reads)
```

**Key Consideration**: Sessions must be shared!

```typescript
// Store sessions in Redis (not server memory)
import session from 'express-session';
import RedisStore from 'connect-redis';

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
```

**Avoid sticky sessions**:
- ❌ Uneven load distribution
- ❌ Server crash loses user sessions
- ✅ Use shared session store (Redis) instead

**6. Dedicated Search Service (Elasticsearch)**

See next section for when and how to implement.

### Metrics to Track

```typescript
// Monitor these continuously
const metrics = {
  // Query performance
  queryResponseTime: {
    p50: '<50ms',
    p95: '<100ms',
    p99: '<200ms'
  },

  // Cache effectiveness
  cacheHitRate: '>80%',

  // Database health
  dbConnectionPoolUsage: '<70%',
  dbReplicationLag: '<100ms',

  // Server resources
  appServerCPU: '<70%',
  appServerMemory: '<80%'
};
```

### When to Break Up the Monolith?

**Not at 100K users!** These optimizations should handle that easily.

**Consider microservices when**:
- Multiple teams need independent deployments
- Different services have different scaling needs (e.g., search needs 10x resources)
- Hitting limits of vertical + horizontal scaling
- Probably around **500K-1M users**

**Microservices are not a scaling solution!** They're an organizational/team structure solution.

---

## Search: PostgreSQL vs Elasticsearch

### The Decision Criteria

#### PostgreSQL Full-Text Search

**Choose when**:
- < 100K products
- Simple search (name, description)
- Small team (don't want to manage another system)
- Budget constrained
- Search is not a core differentiator

**Implementation**:
```sql
-- Create full-text search index
CREATE INDEX products_search_idx ON products
USING GIN (to_tsvector('english', name || ' ' || description));

-- Query
SELECT * FROM products
WHERE to_tsvector('english', name || ' ' || description)
@@ to_tsquery('english', 'laptop');

-- With ranking
SELECT *,
  ts_rank(to_tsvector('english', name || ' ' || description),
          to_tsquery('english', 'laptop')) AS rank
FROM products
WHERE to_tsvector('english', name || ' ' || description)
@@ to_tsquery('english', 'laptop')
ORDER BY rank DESC;
```

**Pros**:
- ✅ Already have PostgreSQL (no new infrastructure)
- ✅ ACID guarantees (search always in sync with data)
- ✅ Simple to maintain
- ✅ Good enough for small-medium catalogs

**Cons**:
- ❌ Slower on large datasets (> 100K products)
- ❌ Limited features (no fuzzy matching, basic autocomplete)
- ❌ Uses database resources (can impact other queries)
- ❌ Limited relevance tuning

---

#### Elasticsearch

**Choose when**:
- \> 100K products OR
- Complex search requirements (filters, facets, autocomplete, fuzzy matching) OR
- Search is a core feature (users expect Amazon-level search) OR
- Multiple data sources (products, reviews, Q&A)

**Implementation**:
```javascript
// Index a product
await elasticsearch.index({
  index: 'products',
  id: product.id,
  body: {
    name: product.name,
    description: product.description,
    category: product.category,
    price: product.price,
    tags: product.tags,
  }
});

// Search with autocomplete
const results = await elasticsearch.search({
  index: 'products',
  body: {
    query: {
      multi_match: {
        query: 'laptop',
        fields: ['name^3', 'description', 'tags^2'],  // Boost name and tags
        fuzziness: 'AUTO'  // Handle typos
      }
    },
    aggs: {
      categories: {
        terms: { field: 'category' }  // Facets
      },
      price_ranges: {
        range: {
          field: 'price',
          ranges: [
            { to: 500 },
            { from: 500, to: 1000 },
            { from: 1000 }
          ]
        }
      }
    }
  }
});
```

**Pros**:
- ✅ Extremely fast (sub-50ms on millions of documents)
- ✅ Rich features (autocomplete, fuzzy matching, relevance scoring, facets)
- ✅ Horizontally scalable (distributed by design)
- ✅ Powerful aggregations for analytics

**Cons**:
- ❌ Eventually consistent (slight delay between DB update and search)
- ❌ More infrastructure (another service to manage)
- ❌ Higher cost (resources, maintenance, monitoring)
- ❌ Complexity (sync logic, monitoring, debugging)

---

### Keeping Elasticsearch in Sync with PostgreSQL

#### Strategy 1: Change Data Capture (CDC) ✅ **Best for Production**

See [CDC section](#change-data-capture-cdc--debezium) below for full details.

```
PostgreSQL → Debezium → Kafka → Elasticsearch Consumer
```

**Pros**: Real-time (<1 sec), reliable, no app changes
**Cons**: Complex setup, more infrastructure

---

#### Strategy 2: Application-Level Events ✅ **Good Middle Ground**

```typescript
// NestJS example
@Injectable()
class ProductsService {
  constructor(
    private db: PrismaService,
    private eventBus: EventEmitter,
  ) {}

  async updateProduct(id: string, data: UpdateProductDto) {
    // 1. Update database
    const product = await this.db.product.update({
      where: { id },
      data,
    });

    // 2. Emit event
    this.eventBus.emit('product.updated', product);

    return product;
  }
}

// Separate listener indexes to Elasticsearch
@Injectable()
class SearchIndexer {
  @OnEvent('product.updated')
  async handleProductUpdated(product: Product) {
    // Use queue for reliability
    await this.queue.add('index-product', {
      productId: product.id,
      data: product,
    });
  }
}

// Queue processor
@Processor('index-product')
class SearchIndexProcessor {
  @Process()
  async indexProduct(job: Job) {
    const { productId, data } = job.data;

    try {
      await this.elasticsearch.index({
        index: 'products',
        id: productId,
        body: data,
      });
    } catch (error) {
      // Retry on failure
      throw error;  // Bull will retry
    }
  }
}
```

**Pros**:
- Simpler than CDC
- Full control in application
- Easy to understand and debug
- Can add business logic (e.g., don't index draft products)

**Cons**:
- Coupled to application logic
- If event fails, search is out of sync
- Need retry/queue for reliability

**Recommendation**: Use **RabbitMQ** or **Bull** (Redis-based queue) for reliability.

---

#### Strategy 3: Scheduled Batch Sync

```typescript
// Cron job: Every 5 minutes
@Cron('*/5 * * * *')
async syncProducts() {
  const lastSync = await this.getLastSyncTime();

  // Get products updated since last sync
  const products = await this.db.product.findMany({
    where: {
      updatedAt: { gt: lastSync }
    }
  });

  // Bulk index to Elasticsearch
  const body = products.flatMap(product => [
    { index: { _index: 'products', _id: product.id } },
    product
  ]);

  await this.elasticsearch.bulk({ body });

  await this.saveLastSyncTime(new Date());
}
```

**Pros**:
- Very simple
- No event infrastructure needed

**Cons**:
- Not real-time (5-15 min lag)
- Can miss rapid updates
- Scales poorly with high update volume

**Use for**: Low-traffic sites where search lag is acceptable

---

#### Initial Loading (First Time Setup)

```typescript
// One-time bulk import
async function initialElasticsearchLoad() {
  const batchSize = 1000;
  let offset = 0;

  while (true) {
    // 1. Fetch batch from PostgreSQL
    const products = await db.product.findMany({
      skip: offset,
      take: batchSize,
    });

    if (products.length === 0) break;

    // 2. Bulk index to Elasticsearch
    const body = products.flatMap(product => [
      { index: { _index: 'products', _id: product.id } },
      product
    ]);

    await elasticsearch.bulk({ body });

    offset += batchSize;
    console.log(`Indexed ${offset} products`);
  }

  // 3. Verify count matches
  const dbCount = await db.product.count();
  const esCount = await elasticsearch.count({ index: 'products' });

  console.log(`DB: ${dbCount}, ES: ${esCount.count}`);
}
```

**NOT from database backups** - backups are binary dumps for disaster recovery, not for data migration.

---

### Recommendation for E-Commerce

**MVP (< 10K products)**:
- Use PostgreSQL full-text search
- Simple, no extra infrastructure

**Growth (10K-100K products)**:
- Stick with PostgreSQL if search is simple
- Consider Elasticsearch if search is a key feature

**Scale (> 100K products)**:
- Implement Elasticsearch
- Use application-level events with message queue
- Monitor sync lag

**Enterprise (> 1M products)**:
- Definitely Elasticsearch
- Consider CDC with Debezium for reliability
- Multiple Elasticsearch nodes for redundancy

---

## Change Data Capture (CDC) & Debezium

### What is Change Data Capture?

**CDC** is a pattern for tracking and capturing changes in a database so you can react to those changes in real-time.

**Key Insight**: The database's **transaction log** (Write-Ahead Log in PostgreSQL) already records every change. CDC reads this log.

### Traditional Approach vs CDC

#### Traditional (Application-Level)

```typescript
// Your application must notify all downstream systems
async function updateProduct(id: string, price: number) {
  // 1. Update database
  await db.product.update({ id, price });

  // 2. Manually notify other systems (can fail!)
  await elasticsearch.updateProduct(id, price);  // ❌ Could fail
  await cache.invalidate(`product:${id}`);       // ❌ Could fail
  await analytics.trackPriceChange(id, price);   // ❌ Could fail
}
```

**Problems**:
- **Coupling**: App must know about all downstream systems
- **Reliability**: If any call fails, that system is out of sync
- **Ordering**: Hard to guarantee order of events
- **Performance**: Slows down update transaction

---

#### CDC Approach

```
PostgreSQL Database
    ↓
Write-Ahead Log (WAL)
    ↓
Debezium (reads WAL)
    ↓
Kafka (message broker)
    ↓ ↓ ↓
Elasticsearch    Cache    Analytics
```

**Your application code**:
```typescript
// Just update the database!
async function updateProduct(id: string, price: number) {
  await db.product.update({ id, price });
  // Done! CDC handles the rest
}
```

**Benefits**:
- ✅ **Decoupling**: App doesn't know about downstream systems
- ✅ **Reliability**: Transaction log is the source of truth
- ✅ **Zero app changes**: Works with existing code
- ✅ **Guaranteed delivery**: Kafka ensures events are delivered
- ✅ **Time travel**: Can replay events from any point

---

### What is Debezium?

**Debezium** is an open-source CDC platform that:
- Reads database transaction logs
- Publishes changes as events to Kafka
- Supports PostgreSQL, MySQL, MongoDB, SQL Server, Oracle

### How Debezium Works

#### 1. Setup Docker Compose

```yaml
version: '3'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: ecommerce
      # Enable logical replication (required for CDC)
      POSTGRES_INITDB_ARGS: "-c wal_level=logical"
    command:
      - "postgres"
      - "-c"
      - "wal_level=logical"

  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181

  kafka:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092

  debezium:
    image: debezium/connect:latest
    depends_on:
      - postgres
      - kafka
    environment:
      BOOTSTRAP_SERVERS: kafka:9092
      GROUP_ID: 1
      CONFIG_STORAGE_TOPIC: debezium_configs
      OFFSET_STORAGE_TOPIC: debezium_offsets
```

#### 2. Configure Debezium Connector

```bash
# POST to Debezium REST API
curl -X POST http://localhost:8083/connectors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "products-connector",
    "config": {
      "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
      "database.hostname": "postgres",
      "database.port": "5432",
      "database.user": "postgres",
      "database.password": "postgres",
      "database.dbname": "ecommerce",
      "database.server.name": "ecommerce-db",
      "table.include.list": "public.products,public.orders",
      "plugin.name": "pgoutput"
    }
  }'
```

#### 3. Debezium Publishes Events to Kafka

When you run:
```sql
UPDATE products SET price = 99.99 WHERE id = '123';
```

Debezium publishes this event to Kafka topic `ecommerce-db.public.products`:

```json
{
  "before": {
    "id": "123",
    "name": "Laptop",
    "price": 89.99,
    "category": "electronics"
  },
  "after": {
    "id": "123",
    "name": "Laptop",
    "price": 99.99,
    "category": "electronics"
  },
  "op": "u",  // operation: c=create, u=update, d=delete
  "ts_ms": 1678901234567,
  "source": {
    "db": "ecommerce",
    "table": "products",
    "lsn": "0/1234567"
  }
}
```

#### 4. Consume Events in Your Application

```typescript
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'ecommerce-consumer',
  brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'search-indexer' });

await consumer.connect();
await consumer.subscribe({ topic: 'ecommerce-db.public.products' });

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const event = JSON.parse(message.value.toString());
    const { before, after, op } = event;

    switch (op) {
      case 'c':  // Create
        await elasticsearch.index({
          index: 'products',
          id: after.id,
          body: after
        });
        break;

      case 'u':  // Update
        await elasticsearch.index({
          index: 'products',
          id: after.id,
          body: after
        });

        // Invalidate cache
        await redis.del(`product:${after.id}`);

        // Track analytics
        if (before.price !== after.price) {
          await analytics.trackPriceChange(after.id, before.price, after.price);
        }
        break;

      case 'd':  // Delete
        await elasticsearch.delete({
          index: 'products',
          id: before.id
        });
        await redis.del(`product:${before.id}`);
        break;
    }
  }
});
```

---

### CDC Benefits in Detail

**1. Exactly-Once Delivery**
- Kafka tracks consumer offsets
- If consumer crashes, it resumes from last processed event
- No duplicate processing (with idempotent consumers)

**2. Time Travel / Replay**
```typescript
// Rebuild Elasticsearch from scratch by replaying events
await consumer.seek({ topic: 'products', partition: 0, offset: '0' });
// Replays all events from beginning
```

**3. Multiple Consumers**
```
Kafka Topic: ecommerce-db.public.products
    ↓ ↓ ↓ ↓
Consumer 1   Consumer 2   Consumer 3    Consumer 4
Elasticsearch  Cache      Analytics   Data Warehouse
```

Each consumer processes events independently.

**4. Ordered Processing**
- Events for the same product ID go to same Kafka partition
- Guarantees order within partition
- Product updates always processed in order

---

### When to Use CDC

**Use CDC when**:
- Multiple downstream systems need database changes
- Reliability is critical (financial, inventory)
- Need event history for analytics/audit
- Microservices architecture (event-driven)
- Data replication to data warehouse

**Don't use CDC when**:
- Simple use case (one database, one app)
- Small team (complexity not worth it)
- Tight budget (need Kafka infrastructure)

### Recommendation by Scale

| Scale | Recommendation |
|-------|----------------|
| MVP (< 10K users) | Application-level events (simple) |
| Growth (10-100K users) | Application events + message queue |
| Scale (100K-500K users) | Consider CDC if multiple consumers |
| Enterprise (> 500K users) | CDC with Debezium + Kafka |

---

## Read Replica Consistency Strategies

### The Problem: Replication Lag

```
Timeline of a database write:

T0: Initial state
    Primary:  price = $100
    Replica:  price = $100  ✅ In sync

T1: User updates price
    Primary:  price = $150  ← Write happens here
    Replica:  price = $100  ⚠️ Not updated yet (replication lag)

T2: +50ms later
    Primary:  price = $150
    Replica:  price = $100  ⚠️ Still lagging

T3: +200ms later (replication completes)
    Primary:  price = $150
    Replica:  price = $150  ✅ Caught up
```

**Typical replication lag**:
- Same datacenter: 10-100ms
- Cross-region: 100-500ms
- Under load: Can spike to seconds

---

### The User Experience Problem

```
User Journey:
1. User updates product price to $150
   → Write goes to Primary DB ✅

2. User is redirected to product page
   → Read goes to Replica DB
   → Replica still shows $100 (lag) ❌

3. User thinks: "My update didn't work!" 😡
   → Submits update again
   → Creates duplicate work / confusion
```

This is called **read-your-writes inconsistency**.

---

### Strategy 1: Route Recent Writes to Primary ✅ **Best for Strong Consistency**

**Concept**: After a user writes, read from primary for a short time (e.g., 5 seconds).

```typescript
class ProductService {
  // Track recent writes per user
  private recentWrites = new Map<string, number>();  // userId -> timestamp

  async updateProduct(userId: string, productId: string, data: any) {
    // 1. Write to primary
    await this.primaryDB.product.update({
      where: { id: productId },
      data
    });

    // 2. Track that this user just wrote
    this.recentWrites.set(userId, Date.now());

    // 3. Clean up old entries after 5 seconds
    setTimeout(() => this.recentWrites.delete(userId), 5000);
  }

  async getProduct(userId: string, productId: string) {
    const lastWrite = this.recentWrites.get(userId);
    const shouldReadFromPrimary = lastWrite && (Date.now() - lastWrite < 5000);

    if (shouldReadFromPrimary) {
      // Read from primary for 5 seconds after write
      return this.primaryDB.product.findUnique({
        where: { id: productId }
      });
    } else {
      // Normal read from replica
      return this.replicaDB.product.findUnique({
        where: { id: productId }
      });
    }
  }
}
```

**For distributed systems (multiple app servers)**:
```typescript
// Use Redis to track writes across servers
async function trackWrite(userId: string) {
  await redis.setex(`recent-write:${userId}`, 5, 'true');
}

async function shouldReadFromPrimary(userId: string): Promise<boolean> {
  const hasRecentWrite = await redis.get(`recent-write:${userId}`);
  return hasRecentWrite !== null;
}
```

**Pros**:
- ✅ User always sees their own writes
- ✅ Simple to implement
- ✅ Solves read-your-writes problem

**Cons**:
- ⚠️ More load on primary (reduces scaling benefits)
- ⚠️ Requires state tracking (session or Redis)

---

### Strategy 2: Monotonic Reads with Replication Position ✅ **Best for Distributed Systems**

**Concept**: Track the database replication position and only read from replicas that have caught up.

**PostgreSQL uses LSN (Log Sequence Number)** to track replication position.

```typescript
// After write, get current position from primary
async function updateProduct(productId: string, data: any) {
  // 1. Write to primary
  await primaryDB.product.update({ where: { id: productId }, data });

  // 2. Get current replication position (LSN)
  const result = await primaryDB.$queryRaw<{ lsn: string }[]>`
    SELECT pg_current_wal_lsn() AS lsn
  `;
  const currentPosition = result[0].lsn;

  // 3. Store position in user's session
  session.lastWritePosition = currentPosition;

  return product;
}

// Before read, check if replica has caught up
async function getProduct(productId: string) {
  const requiredPosition = session.lastWritePosition;

  if (requiredPosition) {
    // 4. Check replica's current position
    const result = await replicaDB.$queryRaw<{ lsn: string }[]>`
      SELECT pg_last_wal_replay_lsn() AS lsn
    `;
    const replicaPosition = result[0].lsn;

    // 5. Compare positions
    if (replicaPosition >= requiredPosition) {
      // Replica is caught up, safe to read
      return replicaDB.product.findUnique({ where: { id: productId } });
    } else {
      // Replica is behind, read from primary
      return primaryDB.product.findUnique({ where: { id: productId } });
    }
  } else {
    // No recent writes, read from replica
    return replicaDB.product.findUnique({ where: { id: productId } });
  }
}
```

**Pros**:
- ✅ Guarantees user sees their writes
- ✅ Uses replica as soon as it catches up (efficient)
- ✅ Precise (tracks exact position)

**Cons**:
- ⚠️ Complex implementation
- ⚠️ Database-specific (LSN is PostgreSQL-specific)
- ⚠️ Extra queries to check position

---

### Strategy 3: Separate Critical vs Non-Critical Reads ✅ **Simplest**

**Concept**: Decide at the application level which reads need strong consistency.

```typescript
class ProductService {
  // CRITICAL: User just updated, must see current data
  async getProductAfterUpdate(productId: string) {
    return this.primaryDB.product.findUnique({
      where: { id: productId }
    });
  }

  // NON-CRITICAL: Browsing products, eventual consistency OK
  async listProducts(filters: ProductFilters) {
    return this.replicaDB.product.findMany({
      where: filters
    });
  }

  // CRITICAL: User checking their order
  async getMyOrder(userId: string, orderId: string) {
    return this.primaryDB.order.findUnique({
      where: { id: orderId, userId }
    });
  }

  // NON-CRITICAL: Admin viewing all orders
  async listAllOrders(filters: OrderFilters) {
    return this.replicaDB.order.findMany({
      where: filters
    });
  }

  // CRITICAL: Checkout (inventory check)
  async checkInventory(productId: string) {
    return this.primaryDB.product.findUnique({
      where: { id: productId },
      select: { stock: true }
    });
  }

  // NON-CRITICAL: Product search
  async searchProducts(query: string) {
    return this.replicaDB.product.findMany({
      where: {
        name: { contains: query }
      }
    });
  }
}
```

**Decision Framework**:

| Operation | Database | Reason |
|-----------|----------|--------|
| User just updated | Primary | Read-your-writes |
| User viewing own data | Primary | Consistency expected |
| Checkout/payment | Primary | Critical transaction |
| Inventory check | Primary | Avoid overselling |
| Browse products | Replica | Eventual consistency OK |
| Search | Replica | Slight lag acceptable |
| Analytics | Replica | Don't impact users |
| Admin reports | Replica | Don't load primary |

**Pros**:
- ✅ Simple to understand
- ✅ Explicit control over each query
- ✅ No complex state tracking

**Cons**:
- ⚠️ Must think about every query
- ⚠️ Can overload primary if too many "critical" reads
- ⚠️ Manual decision for each endpoint

---

### Strategy 4: Sticky Sessions / Consistent Hashing ✅ **For Multiple Replicas**

**Concept**: Always route a specific user to the same replica.

```
User A (hash: 123) → Always Replica 1
User B (hash: 456) → Always Replica 2
User C (hash: 789) → Always Replica 3
User D (hash: 234) → Always Replica 1
```

**Load Balancer Configuration (nginx)**:
```nginx
upstream db_replicas {
    # Hash based on user ID
    hash $user_id consistent;

    server replica1.db.internal:5432;
    server replica2.db.internal:5432;
    server replica3.db.internal:5432;
}
```

**Application-level (connection pooling)**:
```typescript
class DatabaseRouter {
  private replicas = [replica1, replica2, replica3];

  getReplicaForUser(userId: string) {
    // Consistent hashing
    const hash = this.hashFunction(userId);
    const index = hash % this.replicas.length;
    return this.replicas[index];
  }

  async getProduct(userId: string, productId: string) {
    const replica = this.getReplicaForUser(userId);
    return replica.product.findUnique({ where: { id: productId } });
  }
}
```

**Pros**:
- ✅ User sees monotonic reads (never goes backward in time)
- ✅ Better cache locality (same replica = better cache hit)
- ✅ Distributes load evenly

**Cons**:
- ⚠️ Doesn't solve immediate read-after-write
- ⚠️ Uneven distribution if user activity varies
- ⚠️ If replica goes down, users are re-routed (see stale data)

---

### Strategy 5: Async Confirmation (UX Solution) ✅ **Best User Experience**

**Concept**: Show optimistic update immediately, confirm asynchronously.

```typescript
// Frontend
async function updateProductPrice(productId: string, newPrice: number) {
  // 1. Optimistic update (show immediately in UI)
  updateUIImmediately(productId, newPrice);
  showToast("Updating price...", { type: 'loading', duration: 1000 });

  try {
    // 2. Send update to backend
    await api.updateProduct(productId, { price: newPrice });

    // 3. Wait a bit for replication (500ms should be enough)
    await sleep(500);

    // 4. Confirm by reading back
    const confirmed = await api.getProduct(productId);

    if (confirmed.price === newPrice) {
      // Success!
      showToast("Price updated successfully!", { type: 'success' });
    } else {
      // Replication lag, but don't worry user
      showToast("Update in progress...", { type: 'info' });

      // Retry confirmation after 1 second
      setTimeout(async () => {
        const retry = await api.getProduct(productId);
        if (retry.price === newPrice) {
          showToast("Price updated!", { type: 'success' });
        } else {
          // Still not updated - might be an error
          showToast("Update delayed. Refresh to check.", { type: 'warning' });
        }
      }, 1000);
    }
  } catch (error) {
    // Revert optimistic update
    revertUIUpdate(productId);
    showToast("Failed to update price", { type: 'error' });
  }
}
```

**Better UX with WebSockets**:
```typescript
// Backend emits confirmation when write completes
socket.emit('product.updated', { productId, price: newPrice });

// Frontend listens for confirmation
socket.on('product.updated', ({ productId, price }) => {
  updateUIImmediately(productId, price);
  showToast("Price updated!", { type: 'success' });
});
```

**Pros**:
- ✅ Best user experience (feels instant)
- ✅ Handles replication lag gracefully
- ✅ User never sees their own stale data
- ✅ Clear feedback on update status

**Cons**:
- ⚠️ Requires frontend complexity
- ⚠️ Can briefly show incorrect state
- ⚠️ Need rollback logic if update fails

---

### Strategy 6: Increase Replication Speed ✅ **Infrastructure Solution**

**Concept**: Make replication so fast that lag is negligible.

#### Option 1: Synchronous Replication

```sql
-- PostgreSQL configuration
ALTER SYSTEM SET synchronous_commit = 'on';
ALTER SYSTEM SET synchronous_standby_names = 'replica1';

-- Now writes wait for replica to confirm
```

**How it works**:
```
1. Client: UPDATE products SET price = 150
2. Primary: Writes to WAL
3. Primary: Sends WAL to Replica
4. Replica: Writes to WAL
5. Replica: Sends ACK to Primary
6. Primary: Commits transaction
7. Primary: Returns success to Client
```

**Trade-offs**:
- ✅ Zero lag (replica always current)
- ❌ Slower writes (must wait for replica ACK)
- ❌ If replica is down, writes fail or block

**Use synchronous replication for**:
- Financial transactions
- Inventory management
- Critical data that can't have lag

**Don't use for**:
- High-throughput systems (too slow)
- When availability > consistency

---

#### Option 2: Co-locate Primary and Replicas

**Reduce network latency**:

| Setup | Typical Lag |
|-------|-------------|
| Cross-region (US East → EU) | 100-500ms |
| Cross-AZ same region | 10-50ms |
| Same AZ | 1-10ms |
| Same datacenter rack | <1ms |

**Recommendation**: Keep primary and read replicas in same region/AZ.

---

#### Option 3: Optimize Replication Configuration

```sql
-- PostgreSQL tuning for faster replication
ALTER SYSTEM SET wal_sender_timeout = '5s';
ALTER SYSTEM SET wal_receiver_status_interval = '1s';
ALTER SYSTEM SET max_wal_senders = 10;

-- Reduce fsync delays
ALTER SYSTEM SET wal_writer_delay = '10ms';  -- Default: 200ms
```

---

### Monitoring Replication Lag

**Always monitor in production!**

```sql
-- PostgreSQL: Check current replication lag
SELECT
  client_addr AS replica,
  state,
  pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn) AS lag_bytes,
  EXTRACT(EPOCH FROM (now() - pg_last_xact_replay_timestamp())) AS lag_seconds
FROM pg_stat_replication;
```

**Example output**:
```
replica          | state     | lag_bytes | lag_seconds
-----------------|-----------|-----------|------------
10.0.1.5         | streaming | 1024      | 0.15
10.0.1.6         | streaming | 2048      | 0.32
```

**Set up alerts**:
```typescript
// Alert thresholds
const REPLICATION_LAG_WARNING = 500;   // milliseconds
const REPLICATION_LAG_CRITICAL = 5000; // milliseconds

async function checkReplicationLag() {
  const result = await db.$queryRaw`
    SELECT EXTRACT(EPOCH FROM (now() - pg_last_xact_replay_timestamp())) AS lag_seconds
    FROM pg_stat_replication
  `;

  const lagMs = result[0].lag_seconds * 1000;

  if (lagMs > REPLICATION_LAG_CRITICAL) {
    alerting.critical('Replication lag critical', { lagMs });
  } else if (lagMs > REPLICATION_LAG_WARNING) {
    alerting.warning('Replication lag high', { lagMs });
  }
}

// Run every minute
setInterval(checkReplicationLag, 60000);
```

---

### Recommendation by Use Case

| Use Case | Strategy | Reasoning |
|----------|----------|-----------|
| Admin updates product | Route to primary for 5s | Read-your-writes |
| User browses products | Always replica | Eventual consistency OK |
| User places order | Always primary | Critical transaction |
| User views own orders | Always primary | Expects consistency |
| Search | Always replica | Slight lag acceptable |
| Analytics dashboard | Always replica | Don't load primary |
| Checkout (inventory) | Always primary | Prevent overselling |

---

## Interview Answer Template

When asked: **"How do you handle read replica lag?"**

**Comprehensive Answer**:

> "Read replicas can lag behind the primary due to replication delay, typically 10-500ms depending on network and load. This causes **read-your-writes inconsistency** where users don't see their own updates immediately.
>
> **My approach is a hybrid strategy**:
>
> **1. Separate critical vs non-critical reads**:
> - **Critical** (primary): User's own data, checkout, inventory, right after updates
> - **Non-critical** (replica): Browse, search, analytics
>
> **2. Track recent writes per user**:
> - After write, store timestamp in Redis: `recent-write:{userId}`
> - TTL: 5 seconds
> - Route to primary if recent write exists
>
> **3. Optimistic UI updates**:
> - Show update immediately in UI
> - Confirm asynchronously
> - Best UX, hides lag from user
>
> **4. Monitor replication lag**:
> - Query `pg_stat_replication` every minute
> - Alert if lag > 500ms (warning) or > 5s (critical)
> - Track lag metrics in Grafana
>
> **5. For very critical systems**:
> - Use synchronous replication
> - Accept slower writes for zero lag
>
> **Example for e-commerce**:
> - Admin updates product → read from primary for 5 seconds
> - User browses products → always replica
> - User checks out → always primary (inventory must be current)
> - Search → always replica (slight lag acceptable)
>
> This balances **consistency where it matters** with **scalability for high-read workloads**."

---

## Key Takeaways

### Architecture Evolution
1. **Start with monolith** (Docker + Next.js + PostgreSQL)
2. **Optimize before splitting** (indexes, caching, read replicas)
3. **Break apart only when needed** (500K+ users, multiple teams)

### Scaling Database Reads
1. **Indexes** (quick win, do first)
2. **Caching** (Redis for hot data)
3. **Read replicas** (distribute load)
4. **Search service** (Elasticsearch for complex search)

### Data Synchronization
1. **Application events** (simple, good for most cases)
2. **Message queues** (reliability for production)
3. **CDC/Debezium** (enterprise-scale, event-driven architecture)

### Read Replica Consistency
1. **Critical reads → primary** (user's own data, checkout)
2. **Non-critical reads → replica** (browse, search)
3. **Track recent writes** (5-second window)
4. **Optimistic UI** (best user experience)
5. **Monitor lag** (alert if > 500ms)

### Decision Frameworks

**PostgreSQL vs Elasticsearch**:
- < 100K products + simple search = PostgreSQL
- \> 100K products OR complex search = Elasticsearch

**When to use CDC**:
- Multiple downstream consumers
- Need reliability and event history
- Microservices / event-driven architecture

**When to use synchronous replication**:
- Financial transactions
- Inventory management
- Consistency > availability

---

## Next Session: Hour 2 - TypeScript & React Deep Dive

Topics to cover:
- TypeScript patterns for API responses
- Generic components and utility types
- React hooks best practices (useState, useReducer, useCallback, useMemo)
- Performance optimization
- Error boundaries
- Common interview questions

---

**Study Time**: This discussion covers approximately **2-3 hours** of Day 1 material with deep dives. Review this before moving to Hour 2.

**Practice**: Try explaining these concepts out loud. The best way to learn is to teach!
