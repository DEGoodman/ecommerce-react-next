# Exercise 1-1: TypeScript Basics

## User Story
As a developer, I want type-safe category filtering so the compiler catches invalid category values.

## Acceptance Criteria
- [ ] Category type restricts values to valid categories only
- [ ] Product interface uses the Category type
- [ ] Filter state in ProductList uses Category type
- [ ] TypeScript compiler errors on invalid category strings

## Starter Code

```ts
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
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
