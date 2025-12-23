// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
// This file defines the "shape" of our data using TypeScript interfaces.
// Think of interfaces as contracts - they tell TypeScript exactly what
// properties an object should have and what types those properties are.
// ============================================================================

// PRODUCT INTERFACE
// Represents a single product in our store
export interface Product {
  id: number;           // Unique identifier (type: number)
  name: string;         // Product name (type: string)
  description: string;  // Longer description text
  price: number;        // Price in dollars (stored as number, e.g., 19.99)
  category: string;     // Category name like "electronics", "clothing"
  image: string;        // URL to product image
  stock: number;        // How many items are available
}

// CART ITEM INTERFACE
// Represents a product that's been added to the shopping cart
// Notice: This COMBINES the Product interface with a quantity
export interface CartItem {
  product: Product;     // The full Product object (using the interface above)
  quantity: number;     // How many of this product are in the cart
}

// CART CONTEXT TYPE
// Defines the shape of our global cart state and available actions
// This is used by our CartContext (global state management)
export interface CartContextType {
  // STATE
  items: CartItem[];    // Array of items in cart (type: CartItem[])
  total: number;        // Total price of all items

  // ACTIONS (functions that modify state)
  // Function type syntax: (paramName: Type) => ReturnType
  addToCart: (product: Product) => void;                      // void = returns nothing
  removeFromCart: (productId: number) => void;                // Takes a number ID
  updateQuantity: (productId: number, quantity: number) => void;  // Takes 2 params
  clearCart: () => void;                                      // No params needed
}
