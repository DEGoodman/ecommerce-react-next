# TypeScript & React Practice Questions

**Purpose**: Practice exercises for TypeScript & React concepts
**Context**: Hands-on learning with real-world patterns

---

## Table of Contents

1. [Question 1: Type Safety for API Responses](#question-1-type-safety-for-api-responses)
2. [Question 2: useState vs useReducer](#question-2-usestate-vs-usereducer)
3. [Question 3: Error Handling in React](#question-3-error-handling-in-react)
4. [Question 4: useCallback vs useMemo](#question-4-usecallback-vs-usememo)

---

## Question 1: Type Safety for API Responses

**Exercise**: Type a product catalog API response from `GET /api/products` in TypeScript, including handling loading states and potential errors.

### Solution

We need to handle three things: the product data structure itself, the API response wrapper, and the async loading states.

### Code Example

```typescript
// 1. Define the core Product type
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  createdAt: string; // ISO 8601 date string from API
}

// 2. Define the API response wrapper
interface ProductsApiResponse {
  success: boolean;
  data: Product[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
}

// 3. Handle loading states with a discriminated union
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

// 4. Usage in a component
function ProductCatalog() {
  const [state, setState] = useState<AsyncState<Product[]>>({
    status: 'idle'
  });

  useEffect(() => {
    async function fetchProducts() {
      setState({ status: 'loading' });

      try {
        const response = await fetch('/api/products');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Runtime validation (important!)
        const json: unknown = await response.json();

        if (!isValidProductsResponse(json)) {
          throw new Error('Invalid API response format');
        }

        setState({
          status: 'success',
          data: json.data
        });
      } catch (error) {
        setState({
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    fetchProducts();
  }, []);

  // TypeScript knows the exact shape based on status
  if (state.status === 'loading') {
    return <LoadingSpinner />;
  }

  if (state.status === 'error') {
    return <ErrorMessage message={state.error} />;
  }

  if (state.status === 'success') {
    // TypeScript knows state.data exists and is Product[]
    return (
      <div>
        {state.data.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  }

  return null;
}

// 5. Runtime validation (critical for API data!)
function isValidProductsResponse(data: unknown): data is ProductsApiResponse {
  if (typeof data !== 'object' || data === null) return false;

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.success === 'boolean' &&
    Array.isArray(obj.data) &&
    obj.data.every(isValidProduct)
  );
}

function isValidProduct(item: unknown): item is Product {
  if (typeof item !== 'object' || item === null) return false;

  const product = item as Record<string, unknown>;

  return (
    typeof product.id === 'string' &&
    typeof product.name === 'string' &&
    typeof product.price === 'number' &&
    typeof product.stock === 'number'
    // ... check all required fields
  );
}
```

### Key Points to Emphasize

1. **"I use discriminated unions for async states"** - The `status` field lets TypeScript narrow types automatically
2. **"Runtime validation is critical"** - TypeScript types disappear at runtime, so we validate API responses
3. **"I'd actually use Zod in production"** - Hand-writing validators is error-prone

### Why Runtime Validation Matters

**Critical insight**: TypeScript only exists at compile-time. When your code runs in production, all type annotations are stripped away - it's pure JavaScript.

**The Problem:**
```typescript
// This looks safe, but it's not! ⚠️
const response = await fetch('/api/products');
const data: Product = await response.json(); // You're LYING to TypeScript

// TypeScript thinks data.price is a number, but what if the API returns:
// { id: "123", name: "Laptop", price: "99.99" } // price is a STRING!

// Later in your code:
const total = data.price * quantity; // NaN! 💥
```

TypeScript can't validate API responses because the data doesn't exist until runtime. You're essentially telling TypeScript "trust me, this will be a Product" - but there's no actual verification.

**Without Runtime Validation:**
- ❌ Crashes happen deep in your component tree
- ❌ Cryptic errors: "Cannot read property 'toFixed' of NaN"
- ❌ Hard to debug - where did the bad data come from?
- ❌ User sees broken UI or error messages

**With Runtime Validation (Zod):**
- ✅ Fail fast at the API boundary
- ✅ Precise errors: "Expected number at 'price', received string"
- ✅ Easy to debug - logs show exactly what's wrong
- ✅ Graceful error handling - show friendly message to user
- ✅ Actually safe - you've verified the data matches the type

### Summary: Why Runtime Validation Matters

| Without Zod | With Zod |
|-------------|----------|
| 💥 Crashes unpredictably | ✅ Fails gracefully at boundary |
| 🤷 Cryptic error messages | 🎯 Precise validation errors |
| 😰 User sees broken UI | 😊 User sees friendly error |
| 🐛 Hard to debug | 🔍 Easy to pinpoint issue |
| ⏰ Hours to find root cause | ⚡ Seconds to identify problem |
| 🚨 Production incidents | 🛡️ Caught before damage |

### Better Approach: Using Zod

```typescript
import { z } from 'zod';

const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number().positive(),
  category: z.string(),
  imageUrl: z.string().url(),
  stock: z.number().int().min(0),
  createdAt: z.string().datetime(),
});

const ProductsApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(ProductSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
  }),
});

// Type inference from schema
type Product = z.infer<typeof ProductSchema>;
type ProductsApiResponse = z.infer<typeof ProductsApiResponseSchema>;

// Usage
const result = ProductsApiResponseSchema.safeParse(json);
if (result.success) {
  setState({ status: 'success', data: result.data.data });
} else {
  console.error('Validation errors:', result.error);
  setState({ status: 'error', error: 'Invalid data format' });
}
```

### Production Approach: React Query

```typescript
import { useQuery } from '@tanstack/react-query';

function ProductCatalog() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      const json = await response.json();
      return ProductsApiResponseSchema.parse(json.data);
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div>
      {data?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Why This Answer is Strong

- Shows understanding of TypeScript's limitations (compile-time only)
- Demonstrates knowledge of discriminated unions
- Mentions production-ready tools (Zod, React Query)
- Handles all states (loading, success, error)
- Type-safe throughout

---

## Question 2: useState vs useReducer

**Interview Question**: "Explain the difference between useState and useReducer. When would you use each?"

### Strong Answer

**Initial response:**
"Great question! Both manage state, but they're suited for different complexity levels. Let me show you when I'd use each."

### useState: Simple, Independent State

**Good use of useState: simple, independent state**

```typescript
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <form>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="checkbox"
        checked={rememberMe}
        onChange={(e) => setRememberMe(e.target.checked)}
      />
    </form>
  );
}
```

### useReducer: Complex State with Multiple Transitions

**Better with useReducer: complex state with multiple transitions**

```typescript
// State and actions
interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  discount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'APPLY_DISCOUNT'; payload: { code: string; amount: number } }
  | { type: 'CLEAR_CART' };

// Reducer function
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.productId === product.id);

      if (existingItem) {
        // Update existing item
        return {
          ...state,
          items: state.items.map(item =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
          totalItems: state.totalItems + quantity,
          totalPrice: state.totalPrice + (product.price * quantity),
        };
      } else {
        // Add new item
        return {
          ...state,
          items: [...state.items, {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity
          }],
          totalItems: state.totalItems + quantity,
          totalPrice: state.totalPrice + (product.price * quantity),
        };
      }
    }

    case 'REMOVE_ITEM': {
      const item = state.items.find(i => i.productId === action.payload.productId);
      if (!item) return state;

      return {
        ...state,
        items: state.items.filter(i => i.productId !== action.payload.productId),
        totalItems: state.totalItems - item.quantity,
        totalPrice: state.totalPrice - (item.price * item.quantity),
      };
    }

    case 'APPLY_DISCOUNT': {
      return {
        ...state,
        discount: action.payload.amount,
      };
    }

    case 'CLEAR_CART': {
      return {
        items: [],
        totalItems: 0,
        totalPrice: 0,
        discount: 0,
      };
    }

    default:
      return state;
  }
}

// Component usage
function ShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    discount: 0,
  });

  const addToCart = (product: Product, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };

  return (
    <div>
      <p>Total Items: {state.totalItems}</p>
      <p>Total: ${(state.totalPrice - state.discount).toFixed(2)}</p>
      {/* ... */}
    </div>
  );
}
```

### Decision Matrix

| Use **useState** when: | Use **useReducer** when: |
|------------------------|--------------------------|
| Simple values (boolean, number, string) | Complex objects with multiple fields |
| Independent state updates | Related state updates |
| 1-2 state variables | Many state variables that change together |
| Simple transitions | Complex state logic with many transitions |
| Example: toggle, counter, form field | Example: shopping cart, wizard, data table |

### Key Benefits of useReducer

1. **All state logic is centralized** - easier to test and debug
2. **TypeScript helps enforce valid transitions** - discriminated unions prevent invalid actions
3. **State updates are predictable** - reducer is a pure function
4. **Complex updates stay consistent** - can't forget to update related fields

### Additional Note

"In a larger app, I might use Zustand instead of useReducer for global state, but useReducer is great for component-local complexity."

---

## Question 3: Error Handling in React

**Interview Question**: "How would you handle errors in a React component?"

### Strong Answer

**Initial response:**
"Error handling in React needs multiple layers - I want to catch errors gracefully and provide good UX. Let me show you my approach."

### Layer 1: Error Boundaries (for render errors)

```typescript
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error tracking service
    console.error('Error boundary caught:', error, errorInfo);
    // Could send to Sentry, DataDog, etc.
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.resetError);
      }

      return (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={this.resetError}>Try again</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage: Wrap components that might error
function App() {
  return (
    <ErrorBoundary fallback={(error, reset) => (
      <ErrorMessage error={error} onRetry={reset} />
    )}>
      <ProductCatalog />
    </ErrorBoundary>
  );
}
```

### Layer 2: Try-Catch for Async Operations

```typescript
function ProductDetails({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/products/${productId}`);

        if (!response.ok) {
          // Handle HTTP errors specifically
          if (response.status === 404) {
            throw new Error('Product not found');
          } else if (response.status === 500) {
            throw new Error('Server error. Please try again later.');
          } else {
            throw new Error(`Error: ${response.status}`);
          }
        }

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        // Network errors, parsing errors, etc.
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred');
        }

        // Log for debugging
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  // Render based on state
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <div>No product found</div>;

  return <div>{product.name}</div>;
}
```

### Layer 3: Custom Error Hook (reusable pattern)

```typescript
interface UseApiOptions {
  onError?: (error: Error) => void;
  retryCount?: number;
}

function useApi<T>(
  fetcher: () => Promise<T>,
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const execute = async () => {
    setLoading(true);
    setError(null);

    let lastError: Error | null = null;
    const retries = options.retryCount ?? 0;

    for (let i = 0; i <= retries; i++) {
      try {
        const result = await fetcher();
        setData(result);
        setLoading(false);
        return result;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error('Unknown error');

        if (i < retries) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve =>
            setTimeout(resolve, Math.pow(2, i) * 1000)
          );
        }
      }
    }

    // All retries failed
    setError(lastError);
    options.onError?.(lastError!);
    setLoading(false);
  };

  return { data, error, loading, execute };
}

// Usage
function ProductList() {
  const { data, error, loading, execute } = useApi(
    () => fetch('/api/products').then(r => r.json()),
    {
      retryCount: 2,
      onError: (error) => {
        toast.error(`Failed to load products: ${error.message}`);
      }
    }
  );

  useEffect(() => {
    execute();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={execute} />;

  return <div>{/* render products */}</div>;
}
```

### Layer 4: User-Friendly Error Messages

```typescript
function ErrorMessage({
  error,
  onRetry
}: {
  error: Error | string;
  onRetry?: () => void;
}) {
  const message = typeof error === 'string' ? error : error.message;

  // Map technical errors to user-friendly messages
  const getUserMessage = (msg: string): string => {
    if (msg.includes('NetworkError') || msg.includes('Failed to fetch')) {
      return 'Unable to connect. Please check your internet connection.';
    }
    if (msg.includes('404')) {
      return 'The requested item could not be found.';
    }
    if (msg.includes('500')) {
      return 'Our servers are having trouble. Please try again later.';
    }
    return 'Something went wrong. Please try again.';
  };

  return (
    <div className="error-message">
      <h3>Oops!</h3>
      <p>{getUserMessage(message)}</p>
      {onRetry && (
        <button onClick={onRetry}>Try Again</button>
      )}
    </div>
  );
}
```

### Error Handling Strategy Summary

My error handling strategy is:
1. **Error Boundaries** for React render errors
2. **Try-catch** for async operations and events
3. **Custom hooks** for reusable error logic with retry
4. **User-friendly messages** - never show technical errors to users
5. **Logging** - send to monitoring service (Sentry)
6. **Graceful degradation** - show fallback UI, not blank screen

The key is: **anticipate errors, handle them gracefully, and give users a path forward**.

### What Error Boundaries Catch

Error boundaries catch errors in:
- Rendering
- Lifecycle methods
- Constructors

They DON'T catch errors in:
- Event handlers (use try/catch)
- Async code (use try/catch)
- Server-side rendering
- Errors in the error boundary itself

---

## Question 4: useCallback vs useMemo

**Interview Question**: "When would you use useCallback vs useMemo?"

### Strong Answer

**Initial response:**
"Both are about performance optimization, but they memoize different things. Let me explain with examples."

**useCallback memoizes functions**, **useMemo memoizes values**.

### useCallback: Memoize Functions

**Use when passing callbacks to optimized child components:**

```typescript
import { memo, useCallback, useState } from 'react';

// Child component wrapped in React.memo
const ProductCard = memo(({
  product,
  onAddToCart
}: {
  product: Product;
  onAddToCart: (id: string) => void;
}) => {
  console.log('Rendering ProductCard:', product.name);
  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={() => onAddToCart(product.id)}>
        Add to Cart
      </button>
    </div>
  );
});

function ProductList() {
  const [products] = useState<Product[]>(/* ... */);
  const [cart, setCart] = useState<string[]>([]);
  const [filter, setFilter] = useState(''); // Unrelated state

  // ❌ WITHOUT useCallback: new function every render
  // When filter changes, ALL ProductCards re-render
  const handleAddToCart = (productId: string) => {
    setCart(prev => [...prev, productId]);
  };

  // ✅ WITH useCallback: same function reference
  // When filter changes, ProductCards DON'T re-render
  const handleAddToCartMemo = useCallback((productId: string) => {
    setCart(prev => [...prev, productId]);
  }, []); // Empty deps = never recreated

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCartMemo} // Same reference
        />
      ))}
    </div>
  );
}
```

**Also use useCallback when function is a dependency:**

```typescript
function SearchResults({ query }: { query: string }) {
  const [results, setResults] = useState([]);

  // Memoize the search function
  const performSearch = useCallback(async () => {
    const data = await fetch(`/api/search?q=${query}`);
    setResults(await data.json());
  }, [query]); // Recreate when query changes

  useEffect(() => {
    performSearch();
  }, [performSearch]); // Won't cause infinite loop

  return <div>{/* ... */}</div>;
}
```

### useMemo: Memoize Computed Values

**Use for expensive calculations:**

```typescript
function ProductList({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'name'>('name');

  // ❌ WITHOUT useMemo: recalculated on EVERY render
  // Even if products/filter/sortBy haven't changed
  const filteredProducts = products
    .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      return a.name.localeCompare(b.name);
    });

  // ✅ WITH useMemo: only recalculated when dependencies change
  const filteredProductsMemo = useMemo(() => {
    console.log('Filtering and sorting products...');
    return products
      .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'price') return a.price - b.price;
        return a.name.localeCompare(b.name);
      });
  }, [products, filter, sortBy]);

  return <div>{/* render filteredProductsMemo */}</div>;
}
```

**Use to prevent object/array recreation (referential equality):**

```typescript
function ProductDetails({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);

  // ❌ New object every render = child components re-render
  const config = {
    showReviews: true,
    showRelated: true,
  };

  // ✅ Same object reference unless dependencies change
  const configMemo = useMemo(() => ({
    showReviews: true,
    showRelated: true,
  }), []); // Empty deps = never recreated

  return <ProductView product={product} config={configMemo} />;
}
```

### Quick Decision Tree

```typescript
// Do you need to memoize...

// A FUNCTION?
const memoizedFn = useCallback(() => {
  doSomething();
}, [deps]);

// A COMPUTED VALUE?
const memoizedValue = useMemo(() => {
  return expensiveCalculation();
}, [deps]);
```

### When NOT to Use

```typescript
// ❌ DON'T memoize simple calculations
const total = useMemo(() => price + tax, [price, tax]); // Overkill!
const total = price + tax; // Just do this

// ❌ DON'T memoize if not passed to children
const handleClick = useCallback(() => {
  console.log('clicked');
}, []); // Not worth it if not passed to memo'd child

return <button onClick={handleClick}>Click</button>;

// ✅ Just use inline
return <button onClick={() => console.log('clicked')}>Click</button>;
```

### Real-World Example: Shopping Cart

```typescript
function ShoppingCart({ items }: { items: CartItem[] }) {
  const [promoCode, setPromoCode] = useState('');

  // useMemo: expensive calculation
  const totals = useMemo(() => {
    console.log('Calculating totals...');
    const subtotal = items.reduce((sum, item) =>
      sum + (item.price * item.quantity), 0
    );
    const tax = subtotal * 0.08;
    const discount = promoCode === 'SAVE10' ? subtotal * 0.1 : 0;
    const total = subtotal + tax - discount;

    return { subtotal, tax, discount, total };
  }, [items, promoCode]);

  // useCallback: passed to child components
  const handleRemoveItem = useCallback((itemId: string) => {
    // removeItem logic
  }, []);

  return (
    <div>
      {items.map(item => (
        <CartItemCard
          key={item.id}
          item={item}
          onRemove={handleRemoveItem}
        />
      ))}
      <div>Subtotal: ${totals.subtotal}</div>
      <div>Tax: ${totals.tax}</div>
      <div>Total: ${totals.total}</div>
    </div>
  );
}
```

### Summary Table

| Hook | Memoizes | Use When |
|------|----------|----------|
| **useCallback** | Functions | Passing to memo'd children, effect dependencies |
| **useMemo** | Values | Expensive calculations, preventing object recreation |

### Key Insight

Don't premature optimize! Only use these when you measure a performance problem. The hooks themselves have a cost.

---

## Practice Tips

1. **Think out loud** during interviews - show your problem-solving process
2. **Ask clarifying questions** - "What scale are we talking about?" "What's the data structure?"
3. **Mention production tools** - Zod, React Query, Sentry
4. **Discuss trade-offs** - shows you understand there's no "perfect" answer
5. **Be honest** - "I haven't used X, but here's how I'd approach it"

---

## Next Steps

After reviewing these answers:
1. Practice explaining each concept in your own words
2. Try implementing examples from scratch
3. Think of edge cases and how to handle them
4. Be ready to discuss trade-offs and alternatives

Good luck with your interview preparation!
