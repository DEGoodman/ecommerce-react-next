# Exercise 2-4 Solution: Server Actions

```ts
'use server';

import { revalidatePath } from 'next/cache';

let serverCart: { productId: string; quantity: number }[] = [];

export async function addToCart(productId: string) {
  const existing = serverCart.find(item => item.productId === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    serverCart.push({ productId, quantity: 1 });
  }

  revalidatePath('/cart');
  return { success: true, cart: serverCart };
}

export async function removeFromCart(productId: string) {
  serverCart = serverCart.filter(item => item.productId !== productId);
  revalidatePath('/cart');
  return { success: true };
}

export async function updateQuantity(productId: string, quantity: number) {
  const item = serverCart.find(item => item.productId === productId);

  if (item) {
    if (quantity <= 0) {
      serverCart = serverCart.filter(i => i.productId !== productId);
    } else {
      item.quantity = quantity;
    }
  }

  revalidatePath('/cart');
  return { success: true };
}

export async function getCart() {
  return serverCart;
}

export async function clearCart() {
  serverCart = [];
  revalidatePath('/cart');
  return { success: true };
}
```
