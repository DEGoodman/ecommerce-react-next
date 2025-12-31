# Exercise 1-5: Context API for Global State

## Goal
Create a context to track recently viewed products.

## Requirements
- Store up to 5 recently viewed products (most recent first)
- Provide a way for components to add products when viewed
- No duplicates - viewing the same product moves it to the front
- Accessible from any component via a custom hook

## Reference
Look at `src/context/CartContext.tsx` for the pattern to follow.

## What You'll Create
1. A TypeScript interface for the context value
2. The context itself (using `createContext`)
3. A Provider component that manages state
4. A custom hook for consuming the context

## Starter Code

```tsx
import { ReactNode } from 'react';
import { Product } from '../types';

// Define your context type interface here
// - What data does a consumer need? (the list of products)
// - What actions can they perform? (add a product)

// Create your context here
// Hint: createContext<YourType | undefined>(undefined)

// Create your Provider component here
// - Track recently viewed products in state
// - Implement the add function:
//   - Remove duplicate if exists
//   - Add new product to front
//   - Keep only 5 items

// Create your custom hook here
// - Get context value with useContext
// - Throw helpful error if used outside Provider

// Placeholder exports - replace with your implementation
export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useRecentlyViewed() {
  return { recentlyViewed: [] as Product[], addToRecentlyViewed: (p: Product) => {} };
}
```

## Testing Your Implementation
After implementing, you can test by:
1. Importing `useRecentlyViewed` in a component
2. Calling `addToRecentlyViewed(product)` when viewing a product
3. Displaying `recentlyViewed` list somewhere in the UI
