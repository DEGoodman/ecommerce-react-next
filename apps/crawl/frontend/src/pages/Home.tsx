// ============================================================================
// HOME PAGE
// ============================================================================
// This is a simple page component that composes other components.
// It demonstrates:
// 1. Component composition - building UI from smaller pieces
// 2. Page-level components (used in routing)
// ============================================================================

import { ProductList } from '../components/ProductList';

// Simple page component - no state, just renders child components
// This is what's called a "presentational component"
export function Home() {
  return (
    <div className="home">
      <h1>Products</h1>
      {/* ProductList handles all the logic - fetching, filtering, etc. */}
      <ProductList />
    </div>
  );
}
