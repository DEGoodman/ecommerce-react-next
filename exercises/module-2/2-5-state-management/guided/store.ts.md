# Exercise 2-5 Guided: State Management with Zustand

## Learning Goals
Implement client-side state management with Zustand in a Next.js App Router application.

## Why Zustand?

In App Router:
- Server Components can't use React state
- Context requires 'use client' at the top level
- Zustand provides lightweight, hook-based state that integrates well

## Step 1: Understanding Zustand

```tsx
import { create } from 'zustand';

// Create a store with state and actions
const useStore = create((set) => ({
  count: 0,                              // State
  increment: () => set(s => ({           // Action
    count: s.count + 1
  })),
}));

// Use in component
function Counter() {
  const { count, increment } = useStore();
  return <button onClick={increment}>{count}</button>;
}
```

## Step 2: Design Cart Store Interface

```ts
// lib/store.ts
import { create } from 'zustand';
import { Product } from '@/types';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  // State
  items: CartItem[];

  // Computed (we'll derive these)
  // total, itemCount

  // Actions
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}
```

## Step 3: Implement the Store

```ts
import { create } from 'zustand';
import { Product } from '@/types';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],

  addItem: (product) => set((state) => {
    const existing = state.items.find(item => item.product.id === product.id);

    if (existing) {
      return {
        items: state.items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    }

    return {
      items: [...state.items, { product, quantity: 1 }],
    };
  }),

  removeItem: (productId) => set((state) => ({
    items: state.items.filter(item => item.product.id !== productId),
  })),

  updateQuantity: (productId, quantity) => set((state) => ({
    items: quantity <= 0
      ? state.items.filter(item => item.product.id !== productId)
      : state.items.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        ),
  })),

  clearCart: () => set({ items: [] }),
}));
```

## Step 4: Add Persistence with localStorage

```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product) => set((state) => {
        const existing = state.items.find(item => item.product.id === product.id);

        if (existing) {
          return {
            items: state.items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          };
        }

        return {
          items: [...state.items, { product, quantity: 1 }],
        };
      }),

      removeItem: (productId) => set((state) => ({
        items: state.items.filter(item => item.product.id !== productId),
      })),

      updateQuantity: (productId, quantity) => set((state) => ({
        items: quantity <= 0
          ? state.items.filter(item => item.product.id !== productId)
          : state.items.map(item =>
              item.product.id === productId
                ? { ...item, quantity }
                : item
            ),
      })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage', // localStorage key
    }
  )
);

// Selector hooks for computed values
export const useCartTotal = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

export const useCartCount = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );
```

## Step 5: Use in Components

```tsx
'use client';

import { useCartStore, useCartCount } from '@/lib/store';

export function CartIcon() {
  const count = useCartCount();

  return (
    <div className="relative">
      <span>🛒</span>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {count}
        </span>
      )}
    </div>
  );
}
```

```tsx
'use client';

import { useCartStore } from '@/lib/store';
import { Product } from '@/types';

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <button
      onClick={() => addItem(product)}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Add to Cart
    </button>
  );
}
```

## Key Concepts

1. **create()**: Creates a store with state and actions
2. **set()**: Updates state immutably
3. **Selectors**: Extract specific state to prevent re-renders
4. **persist middleware**: Syncs to localStorage automatically
5. **Client Components only**: Zustand uses hooks, needs 'use client'
