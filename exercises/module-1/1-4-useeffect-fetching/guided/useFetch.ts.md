# Exercise 1-4: useEffect & Data Fetching

## Goal
Create a reusable `useFetch` hook that handles data fetching with loading and error states.

## Requirements
- Accept a URL parameter
- Return `{ data, loading, error }` object
- Fetch data when component mounts
- Handle loading state while fetching
- Handle errors gracefully

## Key Concepts
- useEffect for side effects
- Dependency array (re-fetch when URL changes)
- Generic types for flexible return data
- Async/await in useEffect (use inner function)

## Usage Example
```tsx
const { data: products, loading, error } = useFetch<Product[]>('/api/products');
```

## Starter Code

```ts
import { useState, useEffect } from 'react';

// Define the return type
interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(url: string): UseFetchResult<T> {
  // Create state for data, loading, and error

  // Use useEffect to fetch data
  // - Create async function inside useEffect
  // - Set loading true at start
  // - Try to fetch and parse JSON
  // - Catch errors and set error state
  // - Set loading false in finally
  // - Dependency array should include url

  // Return the state object
  return { data: null, loading: true, error: null };
}
```
