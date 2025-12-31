# Exercise 2-9: Error & Loading States

## User Story
As a user, I want clear feedback when pages are loading or errors occur.

## Acceptance Criteria
- [ ] loading.tsx shows skeleton while page loads
- [ ] error.tsx catches errors with retry button
- [ ] not-found.tsx for missing products
- [ ] Development mode shows error details
- [ ] Skeletons match product card layout

## Concepts to Apply
- App Router special files (loading, error, not-found)
- 'use client' for error boundaries
- reset() function for retry
- notFound() to trigger 404
- animate-pulse for skeleton effect

## Starter Code

```tsx
// app/products/error.tsx
'use client';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  // TODO: Log error with useEffect
  // TODO: Display error message
  // TODO: Add retry button that calls reset()
  // TODO: Add link to go home
  // TODO: Show error details in development

  return (
    <div>
      Error page
    </div>
  );
}
```

```tsx
// app/products/loading.tsx

export default function Loading() {
  // TODO: Create skeleton that matches ProductGrid layout
  // TODO: Use animate-pulse for loading effect
  // TODO: Match responsive grid columns

  return (
    <div>
      Loading...
    </div>
  );
}
```

## Hints
- error.tsx MUST have 'use client' directive
- `reset()` re-renders the segment (retries the request)
- `process.env.NODE_ENV === 'development'` for dev-only UI
- `[...Array(8)].map((_, i) => ...)` to create placeholder array
