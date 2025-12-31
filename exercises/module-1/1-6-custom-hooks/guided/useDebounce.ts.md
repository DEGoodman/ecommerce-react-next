# Exercise 1-6: Custom Hooks - useDebounce

## Goal
Create a `useDebounce` hook that delays updating a value until after a pause in changes.

## Requirements
- Accept a value and delay (in ms)
- Return debounced value that updates after delay
- Reset timer if value changes before delay completes

## Use Case
Debounce search input to avoid API calls on every keystroke.

## Starter Code

```ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  // Store the debounced value in state

  // Use useEffect to set up the delay
  // - Set a timeout to update debounced value
  // - Clear timeout on cleanup (return function)
  // - Dependencies: value, delay

  return value; // Replace with debounced value
}
```
