# Exercise 2-4: Server Actions (Part 2)

## Starter Code

```ts
// app/actions/cart.ts
'use server';

import { revalidatePath } from 'next/cache';

// In-memory cart (would be database in production)
let serverCart: { productId: string; quantity: number }[] = [];

export async function addToCart(productId: string) {
  // TODO: Find existing item or add new
  // TODO: Revalidate /cart path
  // TODO: Return success result
}

export async function removeFromCart(productId: string) {
  // TODO: Filter out item
  // TODO: Revalidate and return
}

export async function updateQuantity(productId: string, quantity: number) {
  // TODO: Find item and update quantity
  // TODO: If quantity <= 0, remove item
  // TODO: Revalidate and return
}

export async function getCart() {
  return serverCart;
}
```
