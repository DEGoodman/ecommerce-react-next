# Exercise 1-1 Solution: TypeScript Basics

```ts
export type Category = 'electronics' | 'clothing' | 'home' | 'sports';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
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
