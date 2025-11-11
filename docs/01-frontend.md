# Frontend Guide: Next.js & React

## Overview

The frontend is built with Next.js 14, using the App Router and React Server Components. This guide will help you understand the structure and patterns.

## Key Concepts

### 1. App Router

Next.js 14 uses file-based routing in the `app/` directory:

```
app/
├── layout.tsx          → Root layout (wraps all pages)
├── page.tsx           → Home page (/)
├── products/
│   ├── page.tsx      → Products list (/products)
│   └── [id]/
│       └── page.tsx  → Product detail (/products/123)
└── cart/
    └── page.tsx      → Shopping cart (/cart)
```

**Key Points:**
- `page.tsx` creates a route
- `layout.tsx` wraps child routes
- `[id]` creates dynamic routes
- File structure = URL structure

### 2. Server vs Client Components

**Server Components (Default)**
```typescript
// This runs on the server
export default function ProductsPage() {
  // Can directly access database, APIs, secrets
  return <div>...</div>
}
```

**Benefits:**
- No JavaScript sent to client
- Direct database access
- SEO friendly
- Better performance

**Client Components**
```typescript
'use client' // Must declare at top

export default function AddToCartButton() {
  const [count, setCount] = useState(0)
  // Can use hooks, browser APIs, event handlers
  return <button onClick={...}>Add to Cart</button>
}
```

**When to use Client Components:**
- Interactive features (onClick, onChange)
- React hooks (useState, useEffect)
- Browser APIs (localStorage, navigator)
- Event listeners

### 3. Component Structure

**Example: ProductCard.tsx**

```typescript
/**
 * Clear documentation
 */
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: string) => void
}

export default function ProductCard({
  product,
  onAddToCart
}: ProductCardProps) {
  // Component logic
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product.id)
    }
  }

  // JSX rendering
  return (
    <div className="...">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <button onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  )
}
```

**Best Practices:**
- ✅ Type your props with TypeScript
- ✅ Document complex components
- ✅ Single responsibility principle
- ✅ Reusable and composable
- ✅ Handle edge cases (loading, errors)

## TypeScript Integration

### Type Definitions

Located in `src/types/index.ts`:

```typescript
export interface Product {
  id: string
  name: string
  price: number
  // ... other fields
}

export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}
```

**Benefits:**
- Autocomplete in IDE
- Catch errors early
- Self-documenting code
- Refactoring safety

### Using Types

```typescript
// In components
import type { Product } from '@/types'

function ProductCard({ product }: { product: Product }) {
  // TypeScript knows product.name, product.price, etc.
}

// In API calls
const products: Product[] = await apiClient.getProducts()
```

## API Communication

### API Client (`src/lib/api.ts`)

```typescript
class ApiClient {
  private client: AxiosInstance

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  async getProducts(): Promise<Product[]> {
    const response = await this.client.get('/products')
    return response.data.data
  }
}

export const apiClient = new ApiClient(API_URL)
```

**Features:**
- Centralized API logic
- Type-safe responses
- Error handling
- Easy to mock for testing

### Making API Calls

**In Server Components:**
```typescript
export default async function ProductsPage() {
  const products = await apiClient.getProducts()

  return (
    <div>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}
```

**In Client Components:**
```typescript
'use client'

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.getProducts()
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>

  return <div>{/* render products */}</div>
}
```

## Styling with Tailwind CSS

### Utility-First Approach

```typescript
<div className="flex items-center justify-between p-4">
  <h1 className="text-2xl font-bold text-gray-900">
    {title}
  </h1>
  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
    Click Me
  </button>
</div>
```

**Common Patterns:**
- Layout: `flex`, `grid`, `container`
- Spacing: `p-4` (padding), `m-4` (margin), `gap-4`
- Colors: `text-blue-600`, `bg-gray-100`
- Typography: `text-xl`, `font-bold`
- Responsive: `md:text-2xl`, `lg:grid-cols-3`

### Configuration

Customize in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#0ea5e9',
        600: '#0284c7',
      }
    }
  }
}
```

Use: `bg-primary-600`, `text-primary-500`

## State Management

### Current: Local State

```typescript
'use client'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

### Future: Global State (Zustand)

```typescript
// store/cart.ts
import create from 'zustand'

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
}

export const useCart = create<CartStore>((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter(i => i.id !== id)
    })),
}))

// In component
const { items, addItem } = useCart()
```

## Common Patterns

### 1. Loading States

```typescript
export default function ProductsPage() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])

  if (loading) {
    return <div>Loading products...</div>
  }

  return <ProductList products={products} />
}
```

### 2. Error Handling

```typescript
const [error, setError] = useState<string | null>(null)

try {
  const data = await apiClient.getProducts()
  setProducts(data)
} catch (err) {
  setError('Failed to load products')
}

if (error) {
  return <div className="text-red-600">{error}</div>
}
```

### 3. Conditional Rendering

```typescript
<div>
  {product.stock > 0 ? (
    <button>Add to Cart</button>
  ) : (
    <span>Out of Stock</span>
  )}

  {product.stock < 10 && (
    <p>Only {product.stock} left!</p>
  )}
</div>
```

### 4. Lists & Keys

```typescript
{products.map((product) => (
  <ProductCard
    key={product.id}  // Always use unique key
    product={product}
  />
))}
```

## File Organization

```
src/
├── app/                    # Routes & Pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── products/
│       └── page.tsx
├── components/            # Reusable components
│   ├── ProductCard.tsx
│   ├── Header.tsx
│   └── Footer.tsx
├── lib/                   # Utilities & helpers
│   ├── api.ts            # API client
│   └── utils.ts          # Helper functions
└── types/                # TypeScript types
    └── index.ts
```

## Best Practices

### 1. Component Composition

```typescript
// Good: Small, focused components
<ProductList>
  <ProductCard />
  <ProductCard />
</ProductList>

// Avoid: Monolithic components with too many responsibilities
```

### 2. Props Drilling

```typescript
// Problem: Passing props through many levels
<Page>
  <Layout user={user}>
    <Header user={user}>
      <UserMenu user={user} />  // Props drilling!
    </Header>
  </Layout>
</Page>

// Solution: Use context or state management
const user = useUser()  // Get from context/store
```

### 3. Performance

```typescript
// Memoize expensive calculations
const sortedProducts = useMemo(
  () => products.sort((a, b) => a.price - b.price),
  [products]
)

// Memoize callbacks
const handleAdd = useCallback(
  (id: string) => addToCart(id),
  [addToCart]
)
```

## Exercises

### Beginner
1. ✏️ Create a new page at `/about`
2. ✏️ Add a category filter to products page
3. ✏️ Create a `Button` component with different variants

### Intermediate
4. ✏️ Implement client-side search with debouncing
5. ✏️ Add pagination to product list
6. ✏️ Create a product detail page with dynamic routing

### Advanced
7. ✏️ Implement optimistic UI updates
8. ✏️ Add infinite scroll
9. ✏️ Create a form with validation

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## Next Steps

- Read [Backend Guide](02-backend.md) to understand the API
- Explore [Database Design](03-database.md)
- Try the exercises above
- Build a new feature end-to-end
