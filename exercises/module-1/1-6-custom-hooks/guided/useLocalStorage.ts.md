# Exercise 1-6: Custom Hooks - useLocalStorage

## Goal
Create a `useLocalStorage` hook that persists state to localStorage.

## Requirements
- Works like useState but persists to localStorage
- Accept a key and initial value
- Read from localStorage on mount
- Write to localStorage when value changes

## Key Concepts
- Lazy initialization with useState
- Syncing React state with external storage
- JSON serialization/deserialization

## Starter Code

```ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Initialize state - try to read from localStorage first
  // Use lazy initialization: useState(() => ...)

  // Sync to localStorage when value changes
  // useEffect to write JSON.stringify(value) to localStorage

  // Return tuple like useState
  return [initialValue, () => {}];
}
```
