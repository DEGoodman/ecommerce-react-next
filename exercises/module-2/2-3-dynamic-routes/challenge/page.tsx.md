# Exercise 2-3: Dynamic Routes - Product Detail Page

## User Story
As a shopper, I want to view detailed product information on a dedicated page.

## Acceptance Criteria
- [ ] Page at `/products/[id]` route shows single product
- [ ] Fetches product by ID from API
- [ ] Has dynamic metadata (title, description from product)
- [ ] Pre-renders top 10 products at build time
- [ ] Shows "Back to Products" link
- [ ] Displays all product info and Add to Cart button

## Concepts to Apply
- Dynamic route segments `[id]`
- params prop for accessing route parameters
- generateStaticParams for SSG
- generateMetadata for dynamic SEO

## Starter Code

```tsx
// Create: app/products/[id]/page.tsx

import { Product } from '@/types';

interface ProductPageProps {
  params: { id: string };
}

// TODO: Add generateStaticParams to pre-render top 10 products

// TODO: Add generateMetadata for dynamic SEO

export default async function ProductPage({ params }: ProductPageProps) {
  // TODO: Fetch product by params.id
  // TODO: Handle not found case
  // TODO: Display product details

  return (
    <div>
      <h1>Product Detail</h1>
    </div>
  );
}
```

## Hints
- Create folder structure: `app/products/[id]/page.tsx`
- `generateStaticParams` returns array of `{ id: string }` objects
- `generateMetadata` is async and receives same props as page
- Use `Link` from 'next/link' for navigation
