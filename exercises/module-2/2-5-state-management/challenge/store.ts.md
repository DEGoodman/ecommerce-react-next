# Exercise 2-5: State Management - Zustand Cart Store

## User Story
As a shopper, I want my cart to persist across page reloads and be accessible anywhere in the app.

## Acceptance Criteria
- [ ] Cart store with items array
- [ ] addItem action that handles duplicates
- [ ] removeItem and updateQuantity actions
- [ ] clearCart action
- [ ] Persists to localStorage
- [ ] Selector hooks for total and count

## Concepts to Apply
- Zustand store creation with TypeScript
- Immutable state updates
- persist middleware for localStorage
- Selector hooks for computed values

## Starter Code

```ts
// lib/store.ts
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
        // TODO: Check if product exists
        // TODO: If exists, increment quantity
        // TODO: If not, add new item with quantity 1
        return state;
      }),

      removeItem: (productId) => set((state) => {
        // TODO: Filter out item by productId
        return state;
      }),

      updateQuantity: (productId, quantity) => set((state) => {
        // TODO: If quantity <= 0, remove item
        // TODO: Otherwise, update quantity
        return state;
      }),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);

// TODO: Create useCartTotal selector hook
// TODO: Create useCartCount selector hook
```

## Hints
- Use `state.items.find()` to check for existing items
- Use `state.items.map()` to update specific items immutably
- Use `state.items.filter()` to remove items
- Selector pattern: `useCartStore((state) => /* compute value */)`
