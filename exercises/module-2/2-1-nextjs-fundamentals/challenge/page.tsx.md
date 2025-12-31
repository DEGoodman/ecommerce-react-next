# Exercise 2-1: Next.js Fundamentals - Products Page

## User Story
As a shopper, I want to see a products page at `/products` so I can browse available items.

## Acceptance Criteria
- [ ] Page accessible at `/products` route
- [ ] Page has metadata (title, description) for SEO
- [ ] Fetches products from API on the server
- [ ] Displays products in a responsive grid
- [ ] Uses existing ProductCard component

## Concepts to Apply
- Next.js App Router file-based routing
- Server Components (default, no 'use client')
- Async Server Components for data fetching
- Metadata export for SEO

## Starter Code

```tsx
// Create this file at: app/products/page.tsx

export default function ProductsPage() {
  // TODO: Make this an async function
  // TODO: Fetch products from http://localhost:3001/api/products
  // TODO: Render products in a grid using ProductCard

  return (
    <div>
      <h1>Products</h1>
      {/* Grid goes here */}
    </div>
  );
}
```

## Hints
- Server Components can be `async function` and `await` fetch directly
- Export `metadata` object for SEO (import `Metadata` type from 'next')
- Use `cache: 'no-store'` in fetch options for fresh data
- Import ProductCard from `@/components/ProductCard`
