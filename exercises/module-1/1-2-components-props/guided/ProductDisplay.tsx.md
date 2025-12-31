# Exercise 1-2: Components & Props

## Goal
Create a `ProductDisplay` component that renders products in either grid or list layout.

## Requirements
- Accept `products` array and `layout` mode as props
- Render a `ProductCard` for each product
- Apply different CSS class based on layout ('grid' → 'products-grid', 'list' → 'products-list')

## Key Concepts
- Presentational components (just render props, no state)
- TypeScript interfaces for props
- Conditional className based on props
- Array mapping to render lists

## Starter Code

```tsx
import { Product } from '../types';
import { ProductCard } from './ProductCard';

// Define your props interface here
// - products: array of Product
// - layout: either 'grid' or 'list'

// Create your component
// - Destructure props
// - Determine className based on layout
// - Map products to ProductCards

export function ProductDisplay() {
  // Replace with your implementation
  return <div>TODO: Implement ProductDisplay</div>;
}
```
