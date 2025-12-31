# Exercise 2-4 Guided: API Routes & Server Actions

## Learning Goals
Create API routes and Server Actions for handling data mutations.

## Part 1: API Routes

### Understanding API Routes

```
app/
  api/
    cart/
      route.ts     → GET/POST /api/cart
      [id]/
        route.ts   → GET/PUT/DELETE /api/cart/123
```

### Step 1: Create Cart API Route

Create: `app/api/cart/route.ts`

```ts
import { NextResponse } from 'next/server';

// In-memory cart (replace with database later)
let cart: { productId: string; quantity: number }[] = [];

export async function GET() {
  return NextResponse.json(cart);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { productId, quantity = 1 } = body;

  // Check if item exists
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

### Step 2: Individual Cart Item Route

Create: `app/api/cart/[id]/route.ts`

```ts
import { NextResponse } from 'next/server';

// Reference the same cart (in real app, use database)
declare global {
  var cart: { productId: string; quantity: number }[];
}
global.cart = global.cart || [];

interface RouteParams {
  params: { id: string };
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const index = global.cart.findIndex(item => item.productId === params.id);

  if (index === -1) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  global.cart.splice(index, 1);
  return NextResponse.json({ message: 'Item removed' });
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const body = await request.json();
  const { quantity } = body;

  const item = global.cart.find(item => item.productId === params.id);

  if (!item) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  item.quantity = quantity;
  return NextResponse.json(item);
}
```

## Part 2: Server Actions

### Understanding Server Actions

Server Actions are functions that run on the server but can be called from client components.

### Step 3: Create Cart Actions

Create: `app/actions/cart.ts`

```ts
'use server';

// This directive marks all exports as Server Actions
// They run on the server but can be called from Client Components

import { revalidatePath } from 'next/cache';

// In production, these would interact with a database
let serverCart: { productId: string; quantity: number }[] = [];

export async function addToCart(productId: string) {
  const existing = serverCart.find(item => item.productId === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    serverCart.push({ productId, quantity: 1 });
  }

  // Revalidate the cart page to show updated data
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

### Step 4: Use Server Action in Client Component

```tsx
'use client';

import { addToCart } from '@/app/actions/cart';
import { Product } from '@/types';

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const handleClick = async () => {
    // Call Server Action directly
    const result = await addToCart(product.id);
    if (result.success) {
      console.log('Added to cart!');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Add to Cart
    </button>
  );
}
```

## Key Concepts

1. **API Routes**: `route.ts` files export HTTP method handlers
2. **NextResponse**: Helper for creating JSON responses
3. **Route params**: Access via second argument `{ params }`
4. **Server Actions**: Functions marked with 'use server'
5. **revalidatePath**: Refresh cached data after mutations
6. **Direct calling**: Server Actions can be called like regular async functions
