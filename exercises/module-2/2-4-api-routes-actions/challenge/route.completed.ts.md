# Exercise 2-4 Solution: Cart API Route

```ts
import { NextResponse } from 'next/server';

let cart: { productId: string; quantity: number }[] = [];

export async function GET() {
  return NextResponse.json(cart);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { productId, quantity = 1 } = body;

  const existingIndex = cart.findIndex(item => item.productId === productId);

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  return NextResponse.json(cart, { status: 201 });
}

export async function DELETE() {
  cart = [];
  return NextResponse.json({ message: 'Cart cleared' });
}
```
