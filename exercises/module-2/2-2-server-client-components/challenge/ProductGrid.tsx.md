# Exercise 2-2: Server vs Client Components - ProductGrid

## User Story
As a developer, I want to minimize client-side JavaScript by splitting components appropriately.

## Acceptance Criteria
- [ ] ProductGrid is a Client Component (uses 'use client')
- [ ] Handles onAddToCart click events
- [ ] Receives products as props from Server Component
- [ ] Products page stays as Server Component for data fetching

## Concepts to Apply
- 'use client' directive for Client Components
- Server Components for data fetching
- Passing serializable props across the boundary
- Event handlers require Client Components

## Starter Code

```tsx
// Create: components/ProductGrid.tsx

// TODO: Add 'use client' directive

import { Product } from '@/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  // TODO: Create handleAddToCart function
  // TODO: Map products to ProductCard with onAddToCart handler

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Render ProductCards here */}
    </div>
  );
}
```

## Hints
- 'use client' must be the first line of the file
- Event handlers like onClick need client-side JavaScript
- The products array is serialized when passed from server to client
- Keep the page.tsx as a Server Component - only import ProductGrid
