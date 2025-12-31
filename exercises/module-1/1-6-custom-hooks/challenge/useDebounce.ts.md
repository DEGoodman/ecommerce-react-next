# Exercise 1-6: Custom Hooks - useDebounce

## User Story
As a developer, I want to debounce rapidly changing values to avoid excessive operations.

## Acceptance Criteria
- [ ] Accepts a value and delay (ms)
- [ ] Returns debounced value after delay
- [ ] Resets timer on new value before delay completes

## Starter Code

```ts
export function useDebounce<T>(value: T, delay: number): T {
  return value;
}
```
