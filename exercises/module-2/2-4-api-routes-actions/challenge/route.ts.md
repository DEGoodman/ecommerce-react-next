# Exercise 2-4: API Routes & Server Actions

## User Story
As a developer, I want API routes for cart operations and Server Actions for client-side mutations.

## Acceptance Criteria

### Part 1: API Routes
- [ ] GET `/api/cart` returns cart contents
- [ ] POST `/api/cart` adds item to cart
- [ ] DELETE `/api/cart` clears cart
- [ ] DELETE `/api/cart/[id]` removes specific item

### Part 2: Server Actions
- [ ] `addToCart(productId)` adds item
- [ ] `removeFromCart(productId)` removes item
- [ ] `updateQuantity(productId, quantity)` updates quantity
- [ ] Actions revalidate `/cart` path after mutations

## Concepts to Apply
- `route.ts` files for API routes
- HTTP method exports (GET, POST, DELETE, PATCH)
- 'use server' directive for Server Actions
- `revalidatePath` for cache invalidation

## Starter Code

```ts
// app/api/cart/route.ts
import { NextResponse } from 'next/server';

// TODO: Create in-memory cart array

export async function GET() {
  // TODO: Return cart as JSON
}

export async function POST(request: Request) {
  // TODO: Parse body, add item to cart
  // TODO: Handle existing items (increment quantity)
}

export async function DELETE() {
  // TODO: Clear cart
}
```

```ts
// app/actions/cart.ts
'use server';

// TODO: Implement addToCart, removeFromCart, updateQuantity
// TODO: Use revalidatePath after mutations
```

## Hints
- Use `NextResponse.json(data)` for responses
- `await request.json()` to parse request body
- Server Actions must have 'use server' at top of file
- Import `revalidatePath` from 'next/cache'
