import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './components/Cart';
import './App.css';

function Header() {
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header>
      <Link to="/" className="logo">
        E-Commerce Store
      </Link>
      <nav>
        <Link to="/">Products</Link>
        <Link to="/cart" className="cart-link">
          Cart {itemCount > 0 && <span className="badge">{itemCount}</span>}
        </Link>
      </nav>
    </header>
  );
}

function AppContent() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
