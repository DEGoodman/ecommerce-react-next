# 40-Hour React & Next.js Learning Plan

A focused curriculum for learning React, TypeScript, and Next.js through building an e-commerce application.

## Overview

| Module | Hours | What You'll Build |
|--------|-------|-------------------|
| **1. React + TypeScript** | 14 | Product listing, cart, components |
| **2. Next.js** | 20 | Full e-commerce frontend with SSR |
| **3. NestJS (light)** | 6 | Basic API understanding |

**Total: 40 hours**

---

## Learning Tracks

This curriculum offers two learning tracks, managed through make commands:

### Guided Track
- Step-by-step hints and pseudocode guidance
- Concept explanations inline with code
- Good for: First time through, learning new concepts

### Challenge Track
- User-story style requirements only
- No hints - figure it out yourself
- Good for: Reinforcement, testing your understanding

### Getting Started

```bash
# List all available exercises
make exercise-list

# Start an exercise (guided track)
make exercise-start E=1-1 T=guided

# Start an exercise (challenge track)
make exercise-start E=1-1 T=challenge

# Mark exercise complete and see next steps
make exercise-complete E=1-1

# Reset to starter code if needed
make exercise-reset E=1-1 T=guided

# Check your current progress
make exercise-status
```

### How It Works

1. `make exercise-start` copies starter code into place
2. For exercises 1-2+, it first applies completed code from previous exercises
3. You implement the exercise in the target files
4. `make exercise-complete` marks it done and suggests the next one

### Tracking Your Progress

Progress is tracked in `.learning-progress` (gitignored, local to your machine):

```
track: guided
current_exercise: 1-2
module: 1
last_completed: 1-1
```

---

## Module 1: React + TypeScript Foundations (14 hours)

**Location:** `apps/crawl/frontend/`

### Hour 1-2: Environment & TypeScript Basics
**Goal:** Understand the development setup and TypeScript fundamentals

- [ ] Run the CRAWL frontend: `make crawl` or `cd apps/crawl/frontend && pnpm dev`
- [ ] Explore the Vite + React + TypeScript setup
- [ ] Learn basic types: `string`, `number`, `boolean`, `array`, `object`
- [ ] Understand interfaces vs types
- [ ] Practice: Add types to the existing product data

**Key files to study:**
- `apps/crawl/frontend/src/types/index.ts`
- `apps/crawl/frontend/tsconfig.json`

**Exercise:** Create a `Category` type and use it in the product filtering

---

### Hour 3-4: React Components & Props
**Goal:** Master component composition and prop passing

- [ ] Understand functional components
- [ ] Learn prop typing with TypeScript
- [ ] Study the `ProductCard` component pattern
- [ ] Understand children props and composition

**Key files:**
- `apps/crawl/frontend/src/components/ProductCard.tsx`
- `apps/crawl/frontend/src/components/ProductList.tsx`

**Exercise:** Create a `ProductGrid` component that accepts layout options (grid vs list view)

---

### Hour 5-6: State with useState
**Goal:** Manage local component state

- [ ] Understand `useState` hook
- [ ] Learn state updates and immutability
- [ ] Handle form inputs with state
- [ ] Understand controlled vs uncontrolled components

**Build:**
- Product quantity selector
- Search input with filtering
- Toggle between grid/list view

**Exercise:** Add a "favorites" toggle to ProductCard that persists in local state

---

### Hour 7-8: useEffect & Data Fetching
**Goal:** Handle side effects and async operations

- [ ] Understand `useEffect` lifecycle
- [ ] Learn dependency arrays
- [ ] Fetch data from an API
- [ ] Handle loading and error states

**Key patterns:**
```tsx
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  fetchProducts()
    .then(setProducts)
    .catch(err => setError(err.message))
    .finally(() => setLoading(false));
}, []);
```

**Exercise:** Implement product fetching with loading skeleton and error handling

---

### Hour 9-10: Context API for Global State
**Goal:** Share state across components without prop drilling

- [ ] Understand React Context
- [ ] Create a context provider
- [ ] Use `useContext` hook
- [ ] Study the CartContext implementation

**Key file:** `apps/crawl/frontend/src/context/CartContext.tsx`

**Build:**
- Shopping cart that persists across pages
- Add/remove items from cart
- Display cart count in header

**Exercise:** Add a "recently viewed" context that tracks last 5 viewed products

---

### Hour 11-12: Custom Hooks
**Goal:** Extract and reuse stateful logic

- [ ] Understand the rules of hooks
- [ ] Create custom hooks for common patterns
- [ ] Learn when to extract into a hook

**Build these hooks:**
```tsx
// Fetch data with loading/error states
const { data, loading, error } = useFetch<Product[]>('/api/products');

// Persist state to localStorage
const [cart, setCart] = useLocalStorage('cart', []);

// Debounce search input
const debouncedSearch = useDebounce(searchTerm, 300);
```

**Exercise:** Create a `useProducts` hook that handles fetching, filtering, and sorting

---

### Hour 13-14: React Patterns & Review
**Goal:** Consolidate learning with practical patterns

- [ ] Compound components pattern
- [ ] Render props pattern
- [ ] Component composition best practices
- [ ] Error boundaries

**Build:** Complete the CRAWL phase e-commerce features:
- [ ] Product listing with filters
- [ ] Product detail page
- [ ] Working shopping cart
- [ ] Basic checkout form

**Checkpoint:** You should have a fully functional React e-commerce frontend

---

## Module 2: Next.js Deep Dive (20 hours)

**Location:** `apps/frontend/`

### Hour 15-16: Next.js Fundamentals
**Goal:** Understand Next.js architecture and App Router

- [ ] Start Next.js: `cd apps/frontend && pnpm dev`
- [ ] Learn file-based routing (`app/` directory)
- [ ] Understand layouts and pages
- [ ] Study the root layout structure

**Key files:**
- `apps/frontend/src/app/layout.tsx`
- `apps/frontend/src/app/page.tsx`

**Key concepts:**
- `layout.tsx` - Shared UI across routes
- `page.tsx` - Unique page content
- `loading.tsx` - Loading UI
- `error.tsx` - Error handling

**Exercise:** Create a products route with a nested layout for product pages

---

### Hour 17-18: Server vs Client Components
**Goal:** Master the mental model of React Server Components

- [ ] Understand Server Components (default in App Router)
- [ ] Learn when to use `'use client'`
- [ ] Know what can/can't be done in each

**Server Components can:**
- Fetch data directly
- Access backend resources
- Keep sensitive data on server
- Reduce client bundle size

**Client Components needed for:**
- `useState`, `useEffect`
- Event handlers (`onClick`, etc.)
- Browser APIs
- Third-party client libraries

**Pattern:**
```
app/
  products/
    page.tsx          # Server Component - fetches products
    ProductGrid.tsx   # Server Component - renders grid
    ProductCard.tsx   # Client Component - has interactions
```

**Exercise:** Refactor a page to minimize client-side JavaScript

---

### Hour 19-20: Dynamic Routes & Data Fetching
**Goal:** Handle dynamic content and server-side data

- [ ] Create dynamic routes `[id]`, `[slug]`
- [ ] Fetch data in Server Components
- [ ] Use `generateStaticParams` for static generation
- [ ] Understand caching and revalidation

**Key pattern:**
```tsx
// app/products/[id]/page.tsx
async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  return <ProductDetail product={product} />;
}
```

**Build:**
- Dynamic product detail pages
- Category pages with filtered products
- Static generation for product catalog

**Exercise:** Create a product page that pre-renders the top 10 products at build time

---

### Hour 21-22: API Routes & Server Actions
**Goal:** Handle backend logic within Next.js

- [ ] Create API routes in `app/api/`
- [ ] Handle different HTTP methods
- [ ] Understand Server Actions for mutations
- [ ] Form handling with Server Actions

**API Route pattern:**
```tsx
// app/api/products/route.ts
export async function GET() {
  const products = await db.products.findMany();
  return Response.json(products);
}
```

**Server Action pattern:**
```tsx
// app/actions/cart.ts
'use server'
export async function addToCart(productId: string) {
  // Runs on server, can access DB directly
}
```

**Build:**
- Cart API endpoints
- Server Action for adding to cart
- Form submission with Server Actions

---

### Hour 23-24: State Management in Next.js
**Goal:** Manage client state effectively in App Router

- [ ] When to use Zustand vs Context vs Server State
- [ ] Set up Zustand for cart/UI state
- [ ] Integrate with Server Components

**Key file:** `apps/frontend/src/lib/store.ts`

**Pattern:**
```tsx
// store.ts
import { create } from 'zustand';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (product) => set((state) => ({
    items: [...state.items, { ...product, quantity: 1 }]
  })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),
}));
```

**Exercise:** Implement a complete cart with Zustand that syncs to localStorage

---

### Hour 25-26: Forms & Validation
**Goal:** Build robust forms with validation

- [ ] Use React Hook Form with Next.js
- [ ] Validate with Zod schemas
- [ ] Handle form errors gracefully
- [ ] Connect forms to Server Actions

**Pattern:**
```tsx
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });
  // ...
}
```

**Build:**
- Login/Register forms
- Checkout form with address validation
- Product review form

---

### Hour 27-28: Authentication
**Goal:** Implement user authentication

- [ ] Understand NextAuth.js basics
- [ ] Set up credential-based auth
- [ ] Protect routes with middleware
- [ ] Access session in Server Components

**Key concepts:**
- Session management
- Protected routes
- Auth middleware
- JWT tokens

**Build:**
- Login/logout flow
- Protected checkout page
- User profile page

---

### Hour 29-30: Styling & UI Patterns
**Goal:** Build polished UI with Tailwind CSS

- [ ] Tailwind CSS fundamentals
- [ ] Responsive design patterns
- [ ] Component styling patterns
- [ ] Dark mode implementation

**Key file:** `apps/frontend/tailwind.config.js`

**Patterns:**
```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

// Interactive states
<button className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700">

// Conditional classes with clsx
<div className={clsx('card', { 'card-selected': isSelected })}>
```

**Build:**
- Responsive product grid
- Mobile navigation
- Loading skeletons

---

### Hour 31-32: Error Handling & Loading States
**Goal:** Create resilient user experiences

- [ ] Implement `error.tsx` boundaries
- [ ] Create `loading.tsx` skeletons
- [ ] Handle API errors gracefully
- [ ] Use Suspense for streaming

**Patterns:**
```tsx
// app/products/loading.tsx
export default function Loading() {
  return <ProductGridSkeleton />;
}

// app/products/error.tsx
'use client'
export default function Error({ error, reset }) {
  return (
    <div>
      <p>Something went wrong</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

**Build:**
- Loading skeletons for all pages
- Error boundaries with retry
- Optimistic UI updates

---

### Hour 33-34: Next.js Advanced Patterns
**Goal:** Master production patterns

- [ ] Parallel routes and intercepting routes
- [ ] Middleware for auth/redirects
- [ ] Image optimization with next/image
- [ ] Metadata and SEO

**Key patterns:**
```tsx
// Optimized images
import Image from 'next/image';
<Image src={product.image} alt={product.name} width={400} height={300} />

// Metadata
export const metadata = {
  title: 'Products | E-Commerce',
  description: 'Browse our products',
};
```

**Build:**
- Product image gallery with optimization
- SEO metadata for all pages
- Modal routes for quick view

---

## Module 3: NestJS Essentials (6 hours)

**Location:** `apps/backend/`

### Hour 35-36: NestJS Architecture
**Goal:** Understand the backend structure

- [ ] Start backend: `cd apps/backend && pnpm start:dev`
- [ ] Understand Modules, Controllers, Services
- [ ] Learn Dependency Injection pattern
- [ ] Study the Products module as example

**Key files:**
- `apps/backend/src/app.module.ts`
- `apps/backend/src/products/products.controller.ts`
- `apps/backend/src/products/products.service.ts`

**Architecture:**
```
Request → Controller → Service → Database
                ↓
            Response
```

**Exercise:** Trace a request from API call to database and back

---

### Hour 37-38: REST API Design
**Goal:** Understand RESTful API patterns

- [ ] HTTP methods (GET, POST, PUT, DELETE)
- [ ] Route parameters and query strings
- [ ] Request/Response DTOs
- [ ] Validation with class-validator

**Key patterns:**
```typescript
@Controller('products')
export class ProductsController {
  @Get()           // GET /products
  findAll() {}

  @Get(':id')      // GET /products/123
  findOne(@Param('id') id: string) {}

  @Post()          // POST /products
  create(@Body() dto: CreateProductDto) {}
}
```

**Exercise:** Add a new endpoint for product reviews

---

### Hour 39-40: Database & TypeORM
**Goal:** Basic database operations

- [ ] Understand entities and repositories
- [ ] Basic CRUD operations
- [ ] Database relationships (one-to-many, etc.)
- [ ] Running with Docker Compose

**Key file:** `apps/backend/src/products/product.entity.ts`

**Start everything:**
```bash
docker-compose up
```

**Exercise:** Add an Order entity that references Products and Users

---

## Progress Checklist

### Module 1: React + TypeScript
- [ ] Can create typed functional components
- [ ] Understand useState and useEffect
- [ ] Can use Context API for global state
- [ ] Can create custom hooks
- [ ] Built a working product listing with cart

### Module 2: Next.js
- [ ] Understand App Router file conventions
- [ ] Know when to use Server vs Client Components
- [ ] Can fetch data in Server Components
- [ ] Can create API routes and Server Actions
- [ ] Can manage state with Zustand
- [ ] Can build forms with validation
- [ ] Understand authentication basics
- [ ] Can style with Tailwind CSS
- [ ] Built a complete e-commerce frontend

### Module 3: NestJS
- [ ] Understand Controller → Service → Repository pattern
- [ ] Can read and trace API endpoints
- [ ] Understand how frontend connects to backend
- [ ] Can run the full stack with Docker

---

## Quick Start Commands

```bash
# Module 1: CRAWL phase (React + Vite)
make crawl
# or: cd apps/crawl/frontend && pnpm dev

# Module 2 & 3: Full stack (Next.js + NestJS)
make docker-up
# Frontend: http://localhost:3000
# Backend:  http://localhost:3001/api

# View logs
make docker-logs

# Stop everything
make docker-down
```

---

## Recommended Learning Order

1. **Start with Module 1** even if you know some React - it establishes patterns used throughout
2. **Don't skip exercises** - building is how you learn
3. **Read the code first** - understand existing patterns before modifying
4. **Use the existing scaffolding** - don't start from scratch
5. **Ask Claude for help** - that's what this setup is for!

---

## After 40 Hours

You'll be able to:
- Build React applications with TypeScript
- Create full-featured Next.js applications
- Understand modern React patterns (Server Components, Suspense)
- Connect a frontend to a backend API
- Work with a professional development setup (Docker, TypeScript, etc.)

**Next steps for continued learning:**
- Deep dive into NestJS (Module 3 expanded)
- Testing with Jest and React Testing Library
- Performance optimization (the OPTIMIZE phase)
- Microservices and GraphQL (the RUN phase)
