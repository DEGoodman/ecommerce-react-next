// ============================================================================
// PRODUCT DETAIL PAGE
// ============================================================================
// This page shows a single product's full details.
// It demonstrates:
// 1. Dynamic routing - Getting URL parameters with useParams
// 2. Fetching a single item based on ID
// 3. Nullable state - Product | null type
// 4. Disabled button based on stock
// ============================================================================

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

export function ProductDetail() {
  // ---- ROUTING ----
  // useParams extracts URL parameters
  // URL: /product/123 -> { id: "123" }
  // <{ id: string }> is a generic type parameter for useParams
  const { id } = useParams<{ id: string }>();

  // ---- STATE ----
  // Product | null - Union type: can be a Product OR null
  // We start with null because we don't have the product yet
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get cart function from context
  const { addToCart } = useCart();

  // ---- DATA FETCHING ----
  // Fetch product when component mounts OR when id changes
  useEffect(() => {
    async function fetchProduct() {
      try {
        // Fetch specific product by ID
        // Template literal: `/api/products/${id}` -> "/api/products/123"
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]); // Re-run if id changes (user navigates to different product)

  // ---- CONDITIONAL RENDERING ----
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!product) return <div className="error">Product not found</div>;

  // At this point, TypeScript knows product is NOT null (we returned early if it was)

  // ---- MAIN RENDER ----
  return (
    <div className="product-detail">
      {/* Link back to home - no page reload! */}
      <Link to="/" className="back-link">&larr; Back to products</Link>

      <div className="product-content">
        <img src={product.image} alt={product.name} />
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="category">{product.category}</p>
          <p className="description">{product.description}</p>
          <p className="price">${product.price.toFixed(2)}</p>

          {/* Conditional text based on stock */}
          <p className="stock">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          {/* Disabled button if out of stock */}
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}  // Boolean prop
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
