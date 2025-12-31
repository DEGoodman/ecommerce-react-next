# Exercise 1-6: Custom Hooks - useLocalStorage

## User Story
As a developer, I want state that persists to localStorage automatically.

## Acceptance Criteria
- [ ] Works like useState but persists to localStorage
- [ ] Reads from localStorage on mount
- [ ] Writes to localStorage when value changes
- [ ] Uses JSON serialization

## Starter Code

```ts
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  return [initialValue, () => {}];
}
```
