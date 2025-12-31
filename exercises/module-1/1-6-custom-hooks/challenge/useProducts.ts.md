# Exercise 1-6: Custom Hooks - useProducts

## User Story
As a developer, I want a single hook that handles fetching, filtering, and sorting products.

## Acceptance Criteria
- [ ] Fetches products from /api/products
- [ ] Supports filtering by category
- [ ] Supports sorting by price (asc/desc) and name
- [ ] Returns products, loading, error, and control functions

## Starter Code

```ts
import { Product, Category } from '../types';

export function useProducts() {
  return {
    products: [] as Product[],
    loading: true,
    error: null as string | null,
    category: undefined as Category | undefined,
    setCategory: (cat: Category | undefined) => {},
    sortBy: 'name' as 'price-asc' | 'price-desc' | 'name',
    setSortBy: (sort: 'price-asc' | 'price-desc' | 'name') => {},
  };
}
```
