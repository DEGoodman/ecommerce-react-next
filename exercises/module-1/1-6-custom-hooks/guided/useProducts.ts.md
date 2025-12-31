# Exercise 1-6: Custom Hooks - useProducts

## Goal
Create a `useProducts` hook that combines fetching, filtering, and sorting products.

## Requirements
- Fetch products from API
- Filter by category (optional)
- Sort by price or name
- Return products, loading, error, and setter functions

## Key Concepts
- Composing hooks (use your useFetch inside)
- Derived state with useMemo
- Exposing controls to consumers

## Starter Code

```ts
import { useState, useMemo } from 'react';
import { Product, Category } from '../types';
import { useFetch } from './useFetch';

type SortOption = 'price-asc' | 'price-desc' | 'name';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  category: Category | undefined;
  setCategory: (cat: Category | undefined) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
}

export function useProducts(): UseProductsResult {
  // Fetch all products using useFetch

  // Add state for category filter and sort option

  // Use useMemo to filter and sort products
  // - Filter by category if set
  // - Sort based on sortBy value

  // Return everything the consumer needs
  return {
    products: [],
    loading: true,
    error: null,
    category: undefined,
    setCategory: () => {},
    sortBy: 'name',
    setSortBy: () => {},
  };
}
```
