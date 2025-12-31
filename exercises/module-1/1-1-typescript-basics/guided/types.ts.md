# Exercise 1-1: TypeScript Basics

## Goal
Create a `Category` type for type-safe product filtering.

## Requirements
- Define a union type for product categories
- Categories are: 'electronics', 'clothing', 'home', 'sports'
- Update the Product interface to use your Category type
- Update ProductList.tsx to use Category for filter state

## Key Concepts
- Union types: `type Foo = 'a' | 'b' | 'c'`
- Type exports: `export type Category = ...`
- Using types in interfaces: `category: Category`

## Starter Code

```ts
// Create your Category type here
// Hint: Look at apps/crawl/backend/src/data/products.ts for the values

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;  // TODO: Change to use your Category type
  image: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
}
```

## After This File
Also update `src/components/ProductList.tsx` to use your Category type for the filter state.
