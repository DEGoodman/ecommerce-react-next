# Exercise 2-8: Styling & UI - ProductCard

## User Story
As a shopper, I want an attractive, responsive product card with smooth interactions.

## Acceptance Criteria
- [ ] Responsive grid: 1 col mobile, 2 sm, 3 lg, 4 xl
- [ ] Card with image, category, name, price, button
- [ ] Hover effects on card and image
- [ ] Out of stock badge when stock is 0
- [ ] Loading skeleton component
- [ ] Accessible focus states on button

## Concepts to Apply
- Tailwind responsive prefixes (sm:, md:, lg:)
- Group hover for parent-child effects
- Transitions for smooth animations
- Focus ring for accessibility
- Line clamp for text truncation

## Starter Code

```tsx
import { Product } from '@/types';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div>
      {/* TODO: Add classes for:
          - White background, rounded corners, shadow
          - Hover shadow increase
          - Transition for smooth effect
      */}

      {/* Image section */}
      <div>
        {/* TODO: Aspect ratio container, hover zoom effect */}
        <Image
          src={product.image || '/placeholder.jpg'}
          alt={product.name}
          fill
        />
        {/* TODO: Out of stock badge positioned absolutely */}
      </div>

      {/* Content section */}
      <div>
        {/* TODO: Category (small, uppercase, gray) */}
        {/* TODO: Name (bold, line-clamp-2) */}
        {/* TODO: Price (large, bold) */}
        {/* TODO: Button with hover, disabled, focus states */}
      </div>
    </div>
  );
}
```

## Hints
- `group` on parent, `group-hover:` on children
- `aspect-square` for 1:1 image container
- `line-clamp-2` requires `@tailwindcss/line-clamp` or Tailwind 3.3+
- `transition-*` then `duration-*` for smooth effects
- `focus:ring-2 focus:ring-offset-2` for accessible focus
