// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
// This is the root component that sets up:
// 1. Global cart state (CartProvider)
// 2. Client-side routing (BrowserRouter)
// 3. Page layout (Header + Routes)
// ============================================================================

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './components/Cart';
import './App.css';

// ---- HEADER COMPONENT ----
// Shows navigation and cart count
// Notice: This uses the useCart() hook to access global cart state
function Header() {
  const { items } = useCart();  // Get cart items from context

  // Calculate total number of items in cart (sum of all quantities)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header>
      {/* Link component from react-router-dom - no page refresh! */}
      <Link to="/" className="logo">
        E-Commerce Store
      </Link>
      <nav>
        <Link to="/">Products</Link>
        <Link to="/cart" className="cart-link">
          Cart {/* Conditionally show badge if items > 0 */}
          {itemCount > 0 && <span className="badge">{itemCount}</span>}
        </Link>
      </nav>
    </header>
  );
}

// ---- APP CONTENT COMPONENT ----
// Sets up routing - which component shows for which URL
function AppContent() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        {/* Routes: Maps URL paths to components */}
        <Routes>
          {/* Exact match: "/" shows Home component */}
          <Route path="/" element={<Home />} />

          {/* Dynamic route: "/product/123" shows ProductDetail */}
          {/* The :id is a parameter we can access in the component */}
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* Cart page */}
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

// ---- ROOT APP COMPONENT ----
// This is exported as default and rendered in main.tsx
// Component hierarchy:
//   App (provides cart state)
//     └─ AppContent (provides routing)
//          └─ Header (uses cart state)
//          └─ Routes (renders pages based on URL)
export default function App() {
  return (
    // CartProvider wraps everything, making cart state available
    // to ALL components below it in the tree
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
