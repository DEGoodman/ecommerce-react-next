# Exercise 1-5: Context API for Global State

## User Story
As a shopper, I want to see products I've recently viewed so I can easily find items I was interested in.

## Acceptance Criteria
- [ ] Recently viewed products persist across page navigation
- [ ] Maximum of 5 products shown (most recent first)
- [ ] Viewing the same product again moves it to the front
- [ ] Any component can access the recently viewed list
- [ ] Any component can add to the recently viewed list

## Technical Requirements
- Create a React Context with Provider and custom hook
- Use TypeScript for type safety
- Follow the patterns established in `CartContext.tsx`

## Starter Code

```tsx
import { ReactNode } from 'react';
import { Product } from '../types';

// Your implementation here

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useRecentlyViewed() {
  return { recentlyViewed: [] as Product[], addToRecentlyViewed: (p: Product) => {} };
}
```
