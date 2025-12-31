# Exercise 1-7: Patterns & Review - ProductDetail

## User Story
As a shopper, I want to view detailed product information so I can make informed purchase decisions.

## Acceptance Criteria
- [ ] Fetches product by ID from URL params
- [ ] Shows loading and error states
- [ ] Displays all product info (image, name, category, description, price, stock)
- [ ] "Add to Cart" button integrates with CartContext
- [ ] Button disabled when out of stock
- [ ] Back link returns to product list

## Concepts to Apply
This capstone combines everything from Module 1:
- TypeScript: Product type, typing useParams
- useState: loading, error, product states
- useEffect: fetch on mount/id change
- Context: useCart for cart integration
- Conditional rendering for states

## Starter Code

```tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

export function ProductDetail() {
  // TODO: Get id from URL params (useParams with type)
  // TODO: Set up state for product, loading, error
  // TODO: Get addToCart from cart context
  // TODO: Fetch product in useEffect
  // TODO: Handle loading/error states
  // TODO: Render product details with add to cart button

  return <div>Implement ProductDetail</div>;
}
```

## Hints
- `useParams<{ id: string }>()` to type the URL param
- The async pattern: loading starts true, set to false in finally
- Check `response.ok` before parsing JSON
- Disable button with `disabled={product.stock === 0}`
