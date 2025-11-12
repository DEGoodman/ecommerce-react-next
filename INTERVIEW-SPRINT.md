# 🚀 3-Day Interview Sprint: E-Commerce Platform

**Total Time Available**: 6 hours (2 hours/day × 3 days)
**Interview**: In 3 days
**Strategy**: Focus on high-impact concepts and talking points

---

## 🎯 Goals

By interview day, you'll be able to:
- ✅ Explain e-commerce architecture from simple to enterprise
- ✅ Discuss React, TypeScript, Next.js, and NestJS confidently
- ✅ Answer questions about scalability and performance
- ✅ Walk through design decisions and trade-offs
- ✅ Demonstrate problem-solving ability

---

## 📅 Day-by-Day Plan

### Day 1: Core Architecture & React/TypeScript (2 hours)

**Hour 1: E-Commerce Architecture Overview (60 min)**

**Study Focus:**
1. **System Design** (20 min)
   - Monolith vs Microservices trade-offs
   - Database design for e-commerce
   - API design patterns (REST vs GraphQL)

2. **Frontend Architecture** (20 min)
   - React component patterns
   - State management approaches
   - Server vs Client components

3. **Backend Architecture** (20 min)
   - NestJS modules and DI
   - Database relationships
   - Authentication strategies

**Interactive Exercise with Claude:**
```
Ask me: "Walk me through how you would architect an e-commerce
platform for a startup vs an enterprise company"

I'll help you structure a great answer covering:
- MVP approach (monolith with React + Express)
- Scaling strategy (introduce Next.js, separate services)
- Enterprise evolution (microservices, caching, CDN)
```

**Hour 2: TypeScript & React Deep Dive (60 min)**

**Study Focus:**
1. **TypeScript Patterns** (30 min)
   - Type safety for API responses
   - Generic components
   - Utility types

2. **React Patterns** (30 min)
   - Hooks best practices
   - Performance optimization
   - Error boundaries

**Practice Questions:**
```
1. "How would you type a product catalog API response in TypeScript?"
2. "Explain the difference between useState and useReducer"
3. "How would you handle errors in a React component?"
4. "When would you use useCallback vs useMemo?"
```

**Day 1 Checkpoint:**
- [ ] Can explain monolith → microservices evolution
- [ ] Can discuss React component patterns
- [ ] Can explain TypeScript benefits with examples
- [ ] Ready to code a simple React component

---

### Day 2: Next.js, State Management & APIs (2 hours)

**Hour 1: Next.js & Modern React (60 min)**

**Study Focus:**
1. **Next.js App Router** (20 min)
   - Server Components vs Client Components
   - Data fetching patterns
   - Routing and layouts

2. **State Management** (20 min)
   - When to use Context vs Zustand vs Redux
   - Server state (React Query)
   - Cart management patterns

3. **Forms & Validation** (20 min)
   - React Hook Form
   - Zod validation
   - Error handling

**Key Talking Points:**
```
Next.js Benefits:
- SSR for better SEO and initial load
- Server Components reduce JavaScript bundle
- Built-in routing and optimization
- API routes for backend logic

State Management Decision Tree:
- Simple shared state → Context
- Complex client state → Zustand
- Very complex with middleware → Redux
- Server state → React Query
```

**Hour 2: API Design & Backend (60 min)**

**Study Focus:**
1. **REST API Design** (25 min)
   - Resource naming
   - HTTP methods
   - Status codes
   - Pagination and filtering

2. **NestJS Concepts** (25 min)
   - Dependency Injection
   - Modules, Controllers, Services
   - DTOs and validation
   - Guards and interceptors

3. **Database Patterns** (10 min)
   - TypeORM vs Prisma
   - Relationships
   - Migrations

**Interactive Exercise:**
```
Ask me: "Design a REST API for shopping cart management"

I'll help you cover:
- Endpoints: POST /cart/items, GET /cart, DELETE /cart/items/:id
- Request/Response shapes
- Error scenarios
- Validation requirements
```

**Practice Questions:**
```
1. "What's the difference between Server and Client Components in Next.js?"
2. "How would you optimize a product list with 1000 items?"
3. "Explain NestJS dependency injection benefits"
4. "When would you use GraphQL over REST?"
```

**Day 2 Checkpoint:**
- [ ] Can explain Next.js Server Components
- [ ] Can design a REST API
- [ ] Can discuss state management trade-offs
- [ ] Understand NestJS architecture

---

### Day 3: Performance, Scalability & Interview Scenarios (2 hours)

**Hour 1: Performance & Optimization (60 min)**

**Study Focus:**
1. **Frontend Performance** (20 min)
   - Core Web Vitals (LCP, FID, CLS)
   - Code splitting and lazy loading
   - Image optimization
   - Caching strategies

2. **Backend Performance** (20 min)
   - Database indexing
   - Query optimization
   - Redis caching
   - Load balancing

3. **McMaster-Carr Techniques** (20 min)
   - Progressive enhancement
   - Minimal JavaScript
   - Server-side rendering
   - Aggressive caching

**Key Numbers to Remember:**
```
Performance Targets:
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- API response: < 100ms (p95)
- Search: < 50ms

Bundle Sizes:
- Target initial bundle: < 100KB
- McMaster-Carr: ~50KB total JS
- Typical e-commerce: 400-800KB (too much!)

Caching:
- Static assets: 1 year
- Product pages: 1 hour (CDN)
- API responses: 5-60 minutes (Redis)
- Database queries: 1-5 minutes
```

**Hour 2: System Design & Mock Interview (60 min)**

**Common Interview Questions:**

1. **"Design an e-commerce checkout flow"** (15 min practice)
   - Cart validation
   - Inventory reservation
   - Payment processing
   - Order confirmation
   - Error handling

2. **"How would you handle a flash sale with 10,000 concurrent users?"** (15 min)
   - Database connection pooling
   - Redis for inventory
   - Queue for order processing
   - CDN for static assets
   - Rate limiting

3. **"Explain how you'd implement real-time inventory updates"** (15 min)
   - WebSockets vs Server-Sent Events
   - Redis pub/sub
   - Optimistic updates
   - Conflict resolution

4. **"Walk me through your error handling strategy"** (15 min)
   - Frontend: Error boundaries, toast notifications
   - Backend: Exception filters, logging
   - Network: Retry logic, fallbacks
   - User experience: Graceful degradation

**Day 3 Checkpoint:**
- [ ] Can discuss performance metrics
- [ ] Can design a scalable checkout flow
- [ ] Can explain caching strategies
- [ ] Ready for system design questions

---

## 🎯 Interview Day Prep (Morning of Interview)

**30-Minute Review Checklist:**

### Architecture (5 min)
- [ ] Can draw monolith → microservices evolution
- [ ] Can explain API Gateway pattern
- [ ] Can discuss database sharding

### Frontend (5 min)
- [ ] Can explain React hooks
- [ ] Can discuss Next.js benefits
- [ ] Can explain state management choices

### Backend (5 min)
- [ ] Can explain NestJS DI
- [ ] Can design REST endpoints
- [ ] Can discuss database optimization

### Performance (5 min)
- [ ] Know Core Web Vitals
- [ ] Can discuss caching strategies
- [ ] Can explain bundle optimization

### System Design (10 min)
- [ ] Practice: "Design a product search feature"
- [ ] Practice: "Handle high-traffic checkout"

---

## 💡 Top 20 Interview Questions & Answers

### React & Frontend

**Q1: What's the difference between Server and Client Components in Next.js?**
```
A: Server Components:
- Render on server, send HTML to client
- Can directly access databases/APIs
- Don't add to JavaScript bundle
- Can't use hooks or browser APIs

Client Components:
- Render on client (browser)
- Can use hooks (useState, useEffect)
- Interactive (onClick, onChange)
- Add to JavaScript bundle

Use Server Components by default, only use Client Components
when you need interactivity or browser APIs.
```

**Q2: How would you optimize a product list with 1000 items?**
```
A: Multiple strategies:
1. Virtualization (react-window) - only render visible items
2. Pagination - show 20-50 items per page
3. Infinite scroll - lazy load as user scrolls
4. Server-side filtering - reduce data transfer
5. Image lazy loading - load images as needed
6. Memoization - prevent unnecessary re-renders

For 1000 items, I'd use pagination or infinite scroll with
lazy-loaded images and React.memo for product cards.
```

**Q3: Explain state management choices: Context vs Zustand vs Redux**
```
A:
Context: Simple shared state (theme, user auth)
- Pros: Built-in, no dependencies
- Cons: Re-renders all consumers, limited DevTools

Zustand: Moderate complexity (shopping cart, UI state)
- Pros: Simple API, good TypeScript support, small bundle
- Cons: Less ecosystem than Redux

Redux Toolkit: Complex state with middleware
- Pros: Excellent DevTools, large ecosystem, time-travel debugging
- Cons: More boilerplate, steeper learning curve

For e-commerce: I'd use Zustand for cart + React Query for server state.
```

### Backend & APIs

**Q4: Explain NestJS dependency injection and why it's useful**
```
A: DI is a pattern where objects receive dependencies from
an external source rather than creating them.

Benefits:
1. Testability - easy to mock dependencies
2. Modularity - loosely coupled components
3. Reusability - share services across modules
4. Configuration - swap implementations easily

Example:
@Injectable()
class ProductsService {
  constructor(
    private db: DatabaseService,  // Injected
    private cache: CacheService,  // Injected
  ) {}
}

Without DI, you'd have to manually create these dependencies,
making testing and configuration harder.
```

**Q5: How would you prevent N+1 query problems?**
```
A: N+1 happens when you fetch a list, then loop through
making individual queries for related data.

Solutions:
1. Use ORM relations with eager loading:
   Product.findMany({ include: { reviews: true } })

2. Use DataLoader (GraphQL):
   Batches and caches requests within a single request

3. Use JOIN queries:
   SELECT * FROM products LEFT JOIN reviews...

4. Denormalize data:
   Store review count directly on product

For our e-commerce platform, I'd use Prisma's include for
simple cases and DataLoader for GraphQL to batch queries.
```

**Q6: Design a REST API for shopping cart**
```
A:
GET    /api/cart              - Get user's cart
POST   /api/cart/items        - Add item to cart
PATCH  /api/cart/items/:id    - Update quantity
DELETE /api/cart/items/:id    - Remove item
DELETE /api/cart              - Clear cart

Request body for POST:
{
  "productId": "abc123",
  "quantity": 2
}

Response:
{
  "id": "cart123",
  "items": [
    {
      "id": "item1",
      "product": { "id": "abc123", "name": "...", "price": 99.99 },
      "quantity": 2
    }
  ],
  "totalItems": 2,
  "totalPrice": 199.98
}

Error handling:
- 400: Invalid product ID, out of stock
- 401: Not authenticated
- 404: Cart not found
- 409: Concurrent modification
```

### Performance & Scalability

**Q7: Explain Core Web Vitals and how to optimize them**
```
A: Core Web Vitals are Google's metrics for user experience:

1. LCP (Largest Contentful Paint) - < 2.5s
   - Measures loading performance
   - Optimize: Preload critical assets, optimize images, CDN

2. FID (First Input Delay) - < 100ms
   - Measures interactivity
   - Optimize: Code splitting, defer non-critical JS, web workers

3. CLS (Cumulative Layout Shift) - < 0.1
   - Measures visual stability
   - Optimize: Set image dimensions, reserve space for dynamic content

For e-commerce, prioritize LCP (hero image) and FID (add to cart).
```

**Q8: How would you implement caching for an e-commerce site?**
```
A: Multi-layer caching strategy:

1. Browser Cache (static assets)
   - CSS/JS/Images: 1 year with versioned filenames
   - Cache-Control: public, max-age=31536000, immutable

2. CDN Cache (pages/API)
   - Product pages: 1 hour
   - Category pages: 30 minutes
   - s-maxage=3600, stale-while-revalidate

3. Application Cache (Redis)
   - Hot products: 5-10 minutes
   - Search results: 5 minutes
   - User sessions: until logout

4. Database Query Cache
   - Frequent queries: 1-5 minutes

Invalidation:
- Product update → clear that product's cache
- New order → clear inventory cache
- Use cache tags for bulk invalidation
```

**Q9: How would you handle 10,000 concurrent users during a flash sale?**
```
A: Multi-pronged approach:

1. Infrastructure:
   - Horizontal scaling (multiple servers)
   - Load balancer (round-robin)
   - CDN for static assets
   - Database read replicas

2. Inventory Management:
   - Redis for inventory counter (atomic operations)
   - Pessimistic locking for checkout
   - Queue system for order processing

3. Rate Limiting:
   - Per-user: 10 requests/second
   - Per-IP: 100 requests/second
   - Protect against bots

4. Optimization:
   - Server-side rendering (instant page load)
   - Minimal JavaScript
   - WebSockets for real-time inventory

5. Graceful Degradation:
   - Queue users (virtual waiting room)
   - Disable non-essential features
   - Clear error messages

Goal: Handle load without crashing, fair user experience.
```

### System Design

**Q10: Design a product search feature**
```
A: Requirements clarification:
- Search scope: name, description, category?
- Features: autocomplete, filters, sorting?
- Scale: 10K products? 1M products?

Architecture:
1. Small scale (< 100K products):
   - PostgreSQL full-text search
   - Indexed columns
   - Simple, cheap

2. Large scale (> 100K products):
   - Elasticsearch
   - Separate search service
   - Better performance

Implementation:
1. Indexing:
   - Background job to index products
   - Update on product changes
   - Denormalize for speed

2. Query:
   - Autocomplete: completion suggester
   - Full search: multi-match query
   - Filters: bool query with facets
   - Fuzzy matching for typos

3. Caching:
   - Cache popular queries (5 min)
   - Cache autocomplete results (10 min)

4. Frontend:
   - Debounced input (150ms)
   - Show results as-you-type
   - Highlight matching terms

Performance target: < 50ms for search
```

### Code Quality & Testing

**Q11: What's your testing strategy for e-commerce?**
```
A: Test pyramid approach:

1. Unit Tests (70%):
   - Individual functions
   - Services, utilities
   - Example: calculateOrderTotal(), validateEmail()
   - Fast, focused

2. Integration Tests (20%):
   - Multiple components together
   - API endpoints with database
   - Example: POST /api/orders creates order in DB
   - Medium speed

3. E2E Tests (10%):
   - Critical user flows
   - Example: Complete checkout flow
   - Slow, brittle, but high confidence

Key flows to test:
- Add to cart → Checkout → Payment → Order confirmation
- Search → Product page → Add to cart
- Login → View orders

Tools: Jest + React Testing Library + Supertest + Cypress
```

**Q12: How do you handle errors in production?**
```
A: Multi-layer error handling:

1. Frontend:
   - Error boundaries (React)
   - Global error handler (window.onerror)
   - Network error retry logic
   - User-friendly messages

2. Backend:
   - Exception filters (NestJS)
   - Structured logging
   - Error tracking (Sentry)
   - Appropriate status codes

3. Monitoring:
   - Real-time alerts (> 1% error rate)
   - Error dashboards
   - User impact tracking

4. User Experience:
   - Graceful degradation
   - Retry mechanisms
   - Offline support
   - Clear error messages

Example:
try {
  await addToCart(productId);
} catch (error) {
  if (error.code === 'OUT_OF_STOCK') {
    showToast('Sorry, this item is out of stock');
  } else {
    showToast('Something went wrong. Please try again.');
    logError(error); // Send to monitoring
  }
}
```

### Database & Data Modeling

**Q13: Design a database schema for e-commerce**
```
A: Core entities:

Users
- id, email, password_hash, name, role
- created_at, updated_at

Products
- id, name, description, price, category
- stock, image_url, created_at, updated_at
- Indexes: category, created_at

Orders
- id, user_id, status, total
- created_at, updated_at
- Indexes: user_id, status, created_at

OrderItems (junction table)
- id, order_id, product_id
- quantity, price (snapshot of price at order time)
- Indexes: order_id, product_id

Relationships:
- User → Orders (one-to-many)
- Order → OrderItems (one-to-many)
- Product → OrderItems (one-to-many)

Key decisions:
- Snapshot price in OrderItems (price changes don't affect old orders)
- Status enum (PENDING, PROCESSING, SHIPPED, DELIVERED)
- Soft deletes for products (keep order history)
```

**Q14: How would you handle inventory management?**
```
A: Two approaches:

1. Simple (< 1000 orders/day):
   - Optimistic locking with version column
   - Check stock during checkout
   - Update in transaction

   UPDATE products
   SET stock = stock - quantity
   WHERE id = ? AND stock >= quantity

2. High-volume (> 1000 orders/day):
   - Redis for inventory counter
   - Pessimistic locking during checkout
   - Background sync with database
   - Queue for order processing

   WATCH product:123:stock
   current = GET product:123:stock
   if current >= quantity:
     DECRBY product:123:stock quantity
   else:
     DISCARD

Race conditions:
- Two users buy last item simultaneously
- Solution: Atomic operations, reservations

Reservations:
- Reserve stock for 10 minutes during checkout
- Release if checkout abandoned
- Prevents overselling
```

### Architecture & Patterns

**Q15: When would you use microservices vs monolith?**
```
A:
Monolith for:
- Small team (< 10 developers)
- MVP/early stage
- Simple domain
- Limited scale (< 100K users)

Microservices for:
- Large team (> 10 developers)
- Complex domain (multiple bounded contexts)
- Different scaling needs per service
- Need for independent deployments

E-commerce evolution:
1. Start: Monolith (faster development)
2. Growth: Extract high-load services (search, inventory)
3. Mature: Full microservices (product, order, payment, user)

Trade-offs:
Monolith: Simpler, faster development, easier debugging
Microservices: Scalable, independent deployment, complexity
```

**Q16: Explain event-driven architecture**
```
A: Architecture where services communicate through events.

Components:
1. Event Producers: Emit events when something happens
2. Message Broker: RabbitMQ, Kafka, Redis
3. Event Consumers: Listen and react to events

Example: Order placed
1. Order Service emits "OrderCreated" event
2. Inventory Service listens → reserves stock
3. Payment Service listens → processes payment
4. Notification Service listens → sends email
5. Analytics Service listens → tracks metrics

Benefits:
- Loose coupling
- Easy to add new functionality
- Scalable
- Resilient (services can be down temporarily)

Challenges:
- Eventual consistency
- Debugging is harder
- Message ordering
- Duplicate handling (idempotency)

When to use:
- Complex workflows
- Need for resilience
- Multiple teams/services
```

### Security

**Q17: How do you secure an e-commerce API?**
```
A: Multiple layers:

1. Authentication:
   - JWT tokens (access + refresh)
   - HTTP-only cookies
   - Expire tokens regularly

2. Authorization:
   - Role-based (user, admin)
   - Resource-based (own orders only)
   - Guards/middleware

3. Input Validation:
   - DTO validation (class-validator)
   - Sanitize inputs (prevent XSS)
   - Rate limiting

4. HTTPS:
   - Encrypt in transit
   - HSTS headers

5. CORS:
   - Whitelist allowed origins
   - Credentials handling

6. SQL Injection Prevention:
   - Use ORMs (Prisma, TypeORM)
   - Parameterized queries
   - Never concatenate SQL

7. Payment:
   - PCI compliance
   - Use Stripe/PayPal (don't store cards)
   - Tokenization

8. Monitoring:
   - Failed login attempts
   - Unusual activity
   - Security alerts
```

### Modern Patterns

**Q18: Explain the difference between SSR, SSG, and CSR**
```
A:
CSR (Client-Side Rendering):
- React app loads, then fetches data
- Pros: Interactive, simple backend
- Cons: Slow initial load, poor SEO
- Use for: Dashboards, logged-in apps

SSR (Server-Side Rendering):
- Server renders HTML for each request
- Pros: Fast initial load, great SEO
- Cons: Slower than SSG, server load
- Use for: Dynamic content, personalized pages

SSG (Static Site Generation):
- HTML generated at build time
- Pros: Fastest, cheap hosting, great SEO
- Cons: Rebuild for updates
- Use for: Marketing pages, blog posts

Next.js allows mixing:
- Product pages: SSG with revalidation
- Search results: SSR
- Cart: CSR (Client Component)
- Homepage: SSG

Recommendation for e-commerce:
- Product pages: SSG (revalidate hourly)
- Category pages: SSG (revalidate every 30 min)
- Search: SSR
- Cart/Checkout: CSR
```

**Q19: How does the McMaster-Carr approach differ from typical e-commerce?**
```
A: McMaster-Carr is famously fast. Their approach:

1. Progressive Enhancement:
   - Site works without JavaScript
   - Forms use standard HTTP GET/POST
   - JS enhances, doesn't enable

2. Minimal JavaScript:
   - ~50KB total (vs 400-800KB typical)
   - No heavy frameworks on critical path
   - Server-side rendering

3. Aggressive Caching:
   - Static assets: 1 year
   - Product pages: cached at edge
   - Smart invalidation

4. Optimized Assets:
   - Exactly sized images
   - Modern formats (WebP)
   - Lazy loading

5. Fast Search:
   - < 50ms response times
   - Autocomplete
   - Efficient indexing

Typical e-commerce mistakes:
- Heavy JavaScript frameworks
- Client-side rendering
- Unoptimized images
- No caching strategy

Results:
McMaster-Carr: < 1.5s Time to Interactive
Average site: 5-8s Time to Interactive
```

**Q20: How would you implement real-time features?**
```
A: Options:

1. WebSockets:
   - Bidirectional, persistent connection
   - Best for: Chat, live updates, games
   - Library: Socket.io, ws

2. Server-Sent Events (SSE):
   - Unidirectional (server → client)
   - Best for: Live notifications, feeds
   - Built into browsers

3. Polling:
   - Client requests updates periodically
   - Simple, but inefficient
   - Fallback option

For e-commerce inventory updates:
I'd use WebSockets with Redis pub/sub:

Server:
- Product stock changes → publish to Redis
- WebSocket server subscribes
- Broadcasts to connected clients

Client:
- Subscribe to product updates
- Update UI reactively
- Fallback to polling

Benefits:
- Real-time updates
- Scalable (Redis handles pub/sub)
- Works across multiple servers

Challenges:
- Connection management
- Reconnection logic
- Scaling WebSocket servers
```

---

## 🎯 Final Prep: 30 Minutes Before Interview

**Mental Checklist:**

1. **Breathe** - You know this stuff
2. **Remember**: It's a conversation, not an interrogation
3. **Ask clarifying questions** - Shows thoughtfulness
4. **Think out loud** - Shows problem-solving process
5. **Admit when you don't know** - Then show how you'd find out

**Power Phrases:**
- "That's an interesting problem. Let me break it down..."
- "First, I'd want to clarify the requirements..."
- "There are trade-offs here. Let me walk through them..."
- "I haven't implemented that exact pattern, but here's my understanding..."
- "In production, I'd also consider..."

**Quick Review:**
- [ ] Can draw system architecture
- [ ] Know 3 React hooks well
- [ ] Can explain Next.js benefits
- [ ] Can design a REST API
- [ ] Know performance metrics
- [ ] Can discuss scalability

---

## 💪 How to Use This Guide

### With Claude During Study:

**Example Session:**
```
You: "Claude, let's practice: How would I design a product
     search feature for an e-commerce site?"

Claude: "Great! Let me start by asking some clarifying questions
        that an interviewer might ask..."

[Interactive back-and-forth discussion]
```

**Practice Areas:**
1. System design walkthroughs
2. Code review discussions
3. Architecture trade-offs
4. Performance optimization
5. Debugging scenarios

### Study Strategy:

**Day 1 Evening:**
- Read through all material
- Practice 3-4 questions with Claude
- Focus on architecture

**Day 2 Evening:**
- Deep dive on weak areas
- Practice 5-6 questions with Claude
- Focus on implementation details

**Day 3 Evening:**
- Review key concepts
- Quick practice on 3-4 questions
- Focus on confidence

---

## 🚀 You've Got This!

Remember:
- **It's okay to think out loud** - That's problem-solving
- **Ask questions** - Shows you're thorough
- **Explain trade-offs** - Shows you understand nuance
- **Be honest** - Don't pretend to know what you don't

**Good luck! 🍀**

---

**Next Steps:**
1. Start Day 1 now
2. Practice with Claude daily
3. Review this guide the morning of your interview
4. Go ace that interview!
