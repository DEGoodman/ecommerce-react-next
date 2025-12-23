// ============================================================================
// CART CONTEXT - GLOBAL STATE MANAGEMENT
// ============================================================================
// This file implements the Context API pattern for sharing cart state across
// the entire app WITHOUT prop drilling (passing props through many levels).
//
// Pattern: Provider/Consumer
// 1. Create a Context (CartContext)
// 2. Create a Provider component (CartProvider) that holds the state
// 3. Create a custom hook (useCart) to consume the context easily
// ============================================================================

import { createContext, useContext, useState, ReactNode } from 'react';
import { Product, CartItem, CartContextType } from '../types';

// STEP 1: Create the Context
// CartContextType | undefined means: "either a CartContextType object OR undefined"
// We start with undefined because no value exists until wrapped in the Provider
const CartContext = createContext<CartContextType | undefined>(undefined);

// STEP 2: Create the Provider Component
// This component wraps parts of our app and provides cart state to all children
export function CartProvider({ children }: { children: ReactNode }) {
  // useState with TypeScript: useState<Type>(initialValue)
  // This tells TypeScript "items is an array of CartItem objects"
  const [items, setItems] = useState<CartItem[]>([]);

  // ---- CART ACTIONS ----
  // These functions modify the cart state

  // ADD TO CART: Add a product or increment quantity if already in cart
  const addToCart = (product: Product) => {
    // setItems accepts a function that receives current state
    // This is safer than using items directly (avoids stale state)
    setItems((current) => {
      // Check if product already exists in cart
      const existing = current.find((item) => item.product.id === product.id);

      if (existing) {
        // If exists, increment quantity (immutably with map)
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }  // Spread operator creates new object
            : item
        );
      }

      // If new, add to cart with quantity 1
      // [...current, newItem] creates a NEW array (React needs new references to detect changes)
      return [...current, { product, quantity: 1 }];
    });
  };

  // REMOVE FROM CART: Remove a product entirely
  const removeFromCart = (productId: number) => {
    // filter() creates a new array without the removed item
    setItems((current) => current.filter((item) => item.product.id !== productId));
  };

  // UPDATE QUANTITY: Change quantity for a specific product
  const updateQuantity = (productId: number, quantity: number) => {
    // If quantity is 0 or less, remove the item entirely
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    // Otherwise, update the quantity
    setItems((current) =>
      current.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // CLEAR CART: Remove all items
  const clearCart = () => setItems([]);

  // ---- COMPUTED VALUE ----
  // Calculate total price from all items
  // reduce() is like a loop that builds up a single value
  // Syntax: array.reduce((accumulator, currentItem) => newAccumulator, startValue)
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0  // Start with 0
  );

  // PROVIDE THE CONTEXT
  // Any component wrapped in this Provider can access these values/functions
  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}
    >
      {children}  {/* Render any child components */}
    </CartContext.Provider>
  );
}

// STEP 3: Custom Hook for Easy Access
// This hook lets components access cart context with: const cart = useCart()
// Instead of: const cart = useContext(CartContext)
export function useCart() {
  const context = useContext(CartContext);

  // Safety check: ensure this hook is used inside a CartProvider
  // If not, throw helpful error message
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}
