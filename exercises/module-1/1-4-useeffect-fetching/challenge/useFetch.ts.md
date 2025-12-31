# Exercise 1-4: useEffect & Data Fetching

## User Story
As a developer, I want a reusable data fetching hook so I can easily fetch data with consistent loading and error handling.

## Acceptance Criteria
- [ ] Hook accepts a URL string parameter
- [ ] Returns object with `data`, `loading`, and `error` properties
- [ ] Shows loading state while fetching
- [ ] Handles and exposes fetch errors
- [ ] Re-fetches when URL changes
- [ ] Uses TypeScript generics for type-safe data

## Starter Code

```ts
export function useFetch<T>(url: string) {
  // Your implementation here
  return { data: null as T | null, loading: true, error: null as string | null };
}
```
