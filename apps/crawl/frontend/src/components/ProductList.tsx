// ============================================================================
// PRODUCT LIST COMPONENT
// ============================================================================
// This component demonstrates several important React concepts:
// 1. useState - Managing multiple pieces of state
// 2. useEffect - Fetching data when component mounts
// 3. Async/await - Handling asynchronous operations
// 4. Conditional rendering - Showing different UI based on state
// 5. Array methods - map, filter, Set
// ============================================================================

import { useState, useEffect } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

export function ProductList() {
  // ---- STATE MANAGEMENT ----
  // We manage 4 pieces of local component state

  // 1. Products array - starts empty, filled after fetch
  const [products, setProducts] = useState<Product[]>([]);

  // 2. Loading state - true while fetching data
  const [loading, setLoading] = useState(true);

  // 3. Error state - null normally, string if error occurs
  // string | null is a UNION TYPE - can be either string OR null
  const [error, setError] = useState<string | null>(null);

  // 4. Selected category filter - defaults to 'all'
  const [category, setCategory] = useState<string>('all');

  // ---- SIDE EFFECTS ----
  // useEffect runs after component renders
  // Syntax: useEffect(effectFunction, dependencyArray)
  useEffect(() => {
    // Define async function inside useEffect (useEffect can't be async directly)
    async function fetchProducts() {
      try {
        // Fetch from API (Vite proxies /api to backend)
        const response = await fetch('/api/products');

        // Check if request was successful
        if (!response.ok) throw new Error('Failed to fetch products');

        // Parse JSON response
        const data = await response.json();

        // Update state with fetched products
        setProducts(data);
      } catch (err) {
        // Type guard: Check if err is an Error instance
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        // This runs whether try or catch executes
        setLoading(false);
      }
    }

    // Call the async function
    fetchProducts();
  }, []); // Empty array [] means: run once when component mounts

  // ---- COMPUTED VALUES ----
  // These are calculated from state on every render

  // Get unique categories from products
  // new Set() removes duplicates, spread operator [...] converts back to array
  const categories = ['all', ...new Set(products.map((p) => p.category))];

  // Filter products based on selected category
  // Ternary operator: condition ? ifTrue : ifFalse
  const filteredProducts = category === 'all'
    ? products  // Show all products
    : products.filter((p) => p.category === category);  // Show only matching category

  // ---- CONDITIONAL RENDERING ----
  // Return different UI based on state

  // Early returns for loading and error states
  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  // ---- MAIN RENDER ----
  return (
    <div className="product-list">
      {/* Category filter dropdown */}
      <div className="filters">
        {/* Controlled input: value from state, onChange updates state */}
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {/* Map over categories to create options */}
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {/* Capitalize first letter: "electronics" -> "Electronics" */}
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Product grid */}
      <div className="products-grid">
        {/* Map over filtered products, render a ProductCard for each */}
        {/* key={product.id} helps React track which items changed */}
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
