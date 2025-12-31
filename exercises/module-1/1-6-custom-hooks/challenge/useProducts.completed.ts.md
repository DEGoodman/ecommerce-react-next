# Exercise 1-6 Solution: useProducts

```ts
import { useState, useMemo } from 'react';
import { Product, Category } from '../types';
import { useFetch } from './useFetch';

type SortOption = 'price-asc' | 'price-desc' | 'name';

export function useProducts() {
  const { data, loading, error } = useFetch<Product[]>('/api/products');
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [sortBy, setSortBy] = useState<SortOption>('name');

  const products = useMemo(() => {
    if (!data) return [];

    let filtered = category
      ? data.filter(p => p.category === category)
      : data;

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [data, category, sortBy]);

  return {
    products,
    loading,
    error,
    category,
    setCategory,
    sortBy,
    setSortBy,
  };
}
```
