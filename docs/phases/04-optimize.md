# Phase 4: OPTIMIZE - Performance & Scale

## Overview

The OPTIMIZE phase teaches you how to build lightning-fast, scalable e-commerce applications using techniques from the best in the industry. This isn't about micro-optimizations - it's about understanding and implementing the **architectural decisions** and **performance strategies** that separate good sites from great ones.

## Learning Philosophy

> "Performance is not just about speed - it's about user experience, conversion rates, and business success."

Studies show:
- **53% of users abandon** a site that takes longer than 3 seconds to load
- **1 second delay** can reduce conversions by 7%
- **Fast sites rank higher** in search results
- **Performance is a feature** that affects revenue

---

## 🎯 Learning Objectives

By the end of this phase, you will:
- ✅ Understand all Core Web Vitals and how to optimize them
- ✅ Implement multi-layer caching strategies
- ✅ Configure CDN for global performance
- ✅ Optimize database queries and indexes
- ✅ Implement lazy loading and code splitting
- ✅ Set up performance monitoring
- ✅ Achieve Lighthouse scores of 95+ across all metrics
- ✅ Understand trade-offs in performance decisions

---

## 🏆 The McMaster-Carr Standard

McMaster-Carr (mcmaster.com) is widely considered to have one of the fastest, most efficient e-commerce sites on the internet. Let's study why.

### What Makes McMaster-Carr So Fast?

#### 1. Progressive Enhancement (Works Without JavaScript)
**The Philosophy:** The entire site is functional without JavaScript.

```html
<!-- McMaster-Carr Approach: Server-rendered HTML -->
<form action="/search" method="GET">
  <input type="text" name="q" value="">
  <button type="submit">Search</button>
</form>

<!-- Result: Works immediately, JS enhances later -->
```

**Why This Matters:**
- Instant functionality - no waiting for JS to parse/execute
- Works on slow connections
- Resilient to JS errors
- Better SEO
- Accessible to all devices

**Your Implementation:**
```typescript
// pages/search/page.tsx (Next.js Server Component)
export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  // Server-side: Results available immediately
  const results = await searchProducts(searchParams.q || '');

  return (
    <div>
      {/* Form works with or without JS */}
      <form action="/search" method="GET">
        <input type="text" name="q" defaultValue={searchParams.q} />
        <button type="submit">Search</button>
      </form>

      {/* Results rendered on server */}
      <SearchResults results={results} />

      {/* Client-side enhancement (optional) */}
      <ClientSearchEnhancements />
    </div>
  );
}
```

#### 2. Minimal JavaScript Footprint
**The Numbers:**
- McMaster-Carr: ~50KB of JS (compressed)
- Average e-commerce site: 400-800KB of JS
- Some sites: 2MB+ of JS

**Your Target:**
- Initial bundle: < 100KB compressed
- Total JS: < 300KB compressed
- Critical path: 0 KB JS required

**How to Achieve:**
```typescript
// 1. Use Server Components (Next.js 14)
// app/products/page.tsx
export default async function ProductsPage() {
  const products = await fetchProducts();
  return <ProductList products={products} />; // No JS shipped for this!
}

// 2. Dynamic imports for client components
const SearchBar = dynamic(() => import('./SearchBar'), {
  loading: () => <input placeholder="Search..." disabled />,
});

// 3. Remove unnecessary dependencies
// Before: import _ from 'lodash'; // 70KB
// After: import { debounce } from 'lodash-es/debounce'; // 2KB

// 4. Tree shaking configuration (next.config.js)
module.exports = {
  experimental: {
    optimizePackageImports: ['lodash-es', 'date-fns'],
  },
};
```

#### 3. Aggressive Caching
**McMaster-Carr's Strategy:**
- Static assets: Cached for 1 year
- Product pages: Cached at edge, revalidated strategically
- Search results: Cached per query
- API responses: Multi-layer cache

**Your Implementation:**
```typescript
// 1. Static Asset Caching (nginx or CDN config)
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

// 2. Next.js Page Caching
export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  // Pre-generate top 1000 product pages
  const products = await fetchTopProducts(1000);
  return products.map((p) => ({ id: p.id }));
}

// 3. API Response Caching
import { Redis } from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

export async function fetchProduct(id: string) {
  // Check cache first
  const cached = await redis.get(`product:${id}`);
  if (cached) return JSON.parse(cached);

  // Fetch and cache
  const product = await db.product.findUnique({ where: { id } });
  await redis.setex(`product:${id}`, 3600, JSON.stringify(product));
  return product;
}

// 4. CDN Caching (headers)
export async function GET(request: Request) {
  const data = await fetchData();

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      'CDN-Cache-Control': 'max-age=7200',
    },
  });
}
```

#### 4. Optimized Images
**McMaster-Carr Approach:**
- Exactly sized for each use case
- Modern formats (WebP) with fallbacks
- Lazy loading below the fold
- Low-quality placeholders

**Your Implementation:**
```typescript
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    minimumCacheTTL: 31536000, // 1 year
  },
};

// Component usage
import Image from 'next/image';

export function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={400}
      loading="lazy" // Lazy load below fold
      placeholder="blur"
      blurDataURL="data:image/..." // Low quality placeholder
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
```

#### 5. Instant Search
**McMaster-Carr's Search:**
- Results appear in < 50ms
- Predictive suggestions
- Filters update instantly

**Your Implementation:**
```typescript
// 1. Elasticsearch setup with proper indexing
// elasticsearch-service.ts
export class SearchService {
  async indexProducts(products: Product[]) {
    await this.client.bulk({
      operations: products.flatMap(product => [
        { index: { _index: 'products' } },
        {
          id: product.id,
          name: product.name,
          description: product.description,
          category: product.category,
          price: product.price,
          // Completion suggester for autocomplete
          suggest: {
            input: [product.name, ...product.keywords],
            weight: product.popularity,
          },
        },
      ]),
    });
  }

  async searchWithAutocomplete(query: string) {
    return await this.client.search({
      index: 'products',
      body: {
        suggest: {
          'product-suggest': {
            prefix: query,
            completion: {
              field: 'suggest',
              size: 10,
              skip_duplicates: true,
            },
          },
        },
        query: {
          multi_match: {
            query,
            fields: ['name^3', 'description', 'category^2'],
            fuzziness: 'AUTO',
          },
        },
      },
    });
  }
}

// 2. Client-side: Debounced search with cache
import { useDeferredValue, useState, useEffect } from 'react';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!deferredQuery) return;

    // Check session storage cache
    const cacheKey = `search:${deferredQuery}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      setResults(JSON.parse(cached));
      return;
    }

    // Fetch with abort controller
    const controller = new AbortController();
    fetch(`/api/search?q=${deferredQuery}`, {
      signal: controller.signal,
    })
      .then(r => r.json())
      .then(data => {
        setResults(data);
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      });

    return () => controller.abort();
  }, [deferredQuery]);

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search products..."
    />
  );
}
```

---

## 🚀 Performance Optimization Techniques

### 1. Core Web Vitals Optimization

#### Largest Contentful Paint (LCP) - Target: < 2.5s
**What it measures:** Time until largest content element is visible

**Optimization strategies:**
```typescript
// 1. Preload critical assets
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/hero-image.webp"
          as="image"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

// 2. Prioritize above-the-fold content
export async function ProductPage({ params }) {
  // Fetch critical data first
  const product = await fetchProduct(params.id);

  return (
    <>
      {/* Critical content - rendered immediately */}
      <ProductHero product={product} />

      {/* Non-critical - lazy loaded */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <ProductReviews productId={params.id} />
      </Suspense>
    </>
  );
}

// 3. Optimize server response time (TTFB)
// middleware.ts
export function middleware(request: Request) {
  const start = Date.now();
  const response = NextResponse.next();
  const duration = Date.now() - start;

  response.headers.set('X-Response-Time', `${duration}ms`);

  // Alert if slow
  if (duration > 100) {
    console.warn(`Slow response: ${request.url} took ${duration}ms`);
  }

  return response;
}
```

#### First Input Delay (FID) - Target: < 100ms
**What it measures:** Time from user interaction to browser response

**Optimization strategies:**
```typescript
// 1. Break up long tasks
async function processOrder(items: CartItem[]) {
  // Bad: Blocks main thread
  // const results = items.map(processItem);

  // Good: Yield to main thread
  const results = [];
  for (const item of items) {
    results.push(await processItem(item));
    // Yield to browser
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  return results;
}

// 2. Use Web Workers for heavy computation
// worker.ts
self.onmessage = (e) => {
  const result = heavyCalculation(e.data);
  self.postMessage(result);
};

// component.tsx
const worker = new Worker(new URL('./worker.ts', import.meta.url));
worker.postMessage(data);
worker.onmessage = (e) => setResult(e.data);

// 3. Debounce expensive operations
import { useDebouncedCallback } from 'use-debounce';

const debouncedSearch = useDebouncedCallback(
  (query) => performSearch(query),
  300
);
```

#### Cumulative Layout Shift (CLS) - Target: < 0.1
**What it measures:** Visual stability - unexpected layout shifts

**Optimization strategies:**
```typescript
// 1. Always specify image dimensions
<Image
  src="/product.jpg"
  width={400}
  height={400}
  alt="Product"
/>

// 2. Reserve space for dynamic content
<div style={{ minHeight: '400px' }}>
  {loading ? <Skeleton /> : <Content />}
</div>

// 3. Avoid inserting content above existing content
// Bad: Ads/banners that push content down
// Good: Fixed height placeholders

// 4. Use CSS containment
.product-card {
  contain: layout style paint;
}
```

### 2. Code Splitting & Lazy Loading

```typescript
// 1. Route-based code splitting (automatic in Next.js)
// Each page is a separate bundle

// 2. Component-based code splitting
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // Don't render on server if not needed
});

// 3. Lazy load below-the-fold content
'use client';
import { useEffect, useState } from 'react';

export function LazySection({ children }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' } // Load 100px before visible
    );

    observer.observe(document.getElementById('lazy-section'));
    return () => observer.disconnect();
  }, []);

  return (
    <div id="lazy-section">
      {isVisible ? children : <Skeleton />}
    </div>
  );
}

// 4. Prefetch on hover (for navigation)
export function ProductCard({ href }) {
  return (
    <Link
      href={href}
      onMouseEnter={() => {
        // Prefetch on hover
        router.prefetch(href);
      }}
    >
      Product
    </Link>
  );
}
```

### 3. Database Optimization

```typescript
// 1. Proper indexing
// prisma/schema.prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  category    String
  price       Decimal
  createdAt   DateTime @default(now())

  // Indexes for common queries
  @@index([category, price]) // Filter by category and sort by price
  @@index([createdAt])        // Sort by newest
  @@index([name])             // Search by name
  @@fulltext([name, description]) // Full-text search
}

// 2. Efficient queries (avoid N+1)
// Bad: N+1 problem
const products = await db.product.findMany();
for (const product of products) {
  product.reviews = await db.review.findMany({
    where: { productId: product.id }
  });
}

// Good: Include relation
const products = await db.product.findMany({
  include: {
    reviews: {
      take: 5,
      orderBy: { createdAt: 'desc' },
    },
  },
});

// 3. Pagination with cursor-based (more efficient than offset)
// Bad: OFFSET 10000 (scans 10000 rows)
const products = await db.product.findMany({
  skip: 10000,
  take: 20,
});

// Good: Cursor-based
const products = await db.product.findMany({
  take: 20,
  cursor: lastProduct ? { id: lastProduct.id } : undefined,
  skip: lastProduct ? 1 : 0,
});

// 4. Connection pooling
// lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### 4. Asset Optimization

```typescript
// 1. Font optimization
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap', // Avoid flash of invisible text
});

// CSS
:root {
  --font-inter: 'Inter', sans-serif;
}

// 2. Critical CSS inlining (automatic in Next.js)

// 3. Compress responses
// next.config.js
module.exports = {
  compress: true, // Gzip compression
};

// nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;

// 4. Resource hints
<link rel="dns-prefetch" href="https://api.example.com" />
<link rel="preconnect" href="https://cdn.example.com" />
<link rel="prefetch" href="/next-page" />
```

---

## 📊 Performance Monitoring

### 1. Real User Monitoring (RUM)

```typescript
// lib/performance.ts
export function reportWebVitals(metric) {
  // Send to analytics
  if (metric.label === 'web-vital') {
    console.log(metric);

    // Send to your analytics service
    fetch('/api/analytics', {
      method: 'POST',
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        id: metric.id,
        label: metric.label,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <WebVitals onMetric={reportWebVitals} />
      </body>
    </html>
  );
}
```

### 2. Performance Budgets

```javascript
// performance-budget.js
module.exports = {
  budgets: [
    {
      path: '/*',
      timings: [
        { metric: 'interactive', budget: 3800 },
        { metric: 'first-contentful-paint', budget: 1800 },
      ],
      resourceSizes: [
        { resourceType: 'script', budget: 300 },
        { resourceType: 'total', budget: 1000 },
      ],
    },
  ],
};
```

---

## 🎯 Optimization Checklist

### Frontend
- [ ] Lighthouse score 95+ on all metrics
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Initial JS bundle < 100KB
- [ ] Images optimized (WebP/AVIF)
- [ ] Fonts optimized
- [ ] Critical CSS inlined
- [ ] Lazy loading below fold
- [ ] Code splitting implemented

### Backend
- [ ] API response time < 100ms (p95)
- [ ] Database queries optimized
- [ ] Proper indexing on all queries
- [ ] Connection pooling configured
- [ ] Redis caching for hot data
- [ ] Response compression enabled

### Caching
- [ ] Browser cache configured
- [ ] CDN caching configured
- [ ] API response caching
- [ ] Database query caching
- [ ] Static asset versioning

### Monitoring
- [ ] Real User Monitoring setup
- [ ] Performance budgets defined
- [ ] Alerts for degradation
- [ ] Error tracking configured

---

## 📚 Further Reading

- [McMaster-Carr Case Study](04-optimize-mcmaster.md)
- [Caching Strategies Deep Dive](04-optimize-caching.md)
- [Performance Monitoring](04-optimize-monitoring.md)
- [web.dev Performance Guides](https://web.dev/performance/)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)

---

**Next Steps:** Apply these optimizations to your e-commerce platform and measure the improvements!
