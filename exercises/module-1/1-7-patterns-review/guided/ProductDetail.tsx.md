# Exercise 1-7 Guided: ProductDetail Component

## Learning Goals
Combine everything from Module 1: TypeScript, hooks, context, and component patterns.

## The Component

This component displays a single product's full details. It:
- Gets the product ID from URL params
- Fetches product data
- Shows loading/error states
- Integrates with cart context

## Step 1: Setup Imports and Types

```tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
```

## Step 2: Component Structure with State

```tsx
export function ProductDetail() {
  // Get 'id' from URL params with TypeScript typing
  const { id } = useParams<{ id: string }>();

  // Three pieces of state for async data pattern
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get cart actions from context
  const { addToCart } = useCart();

  // TODO: Add useEffect for data fetching
  // TODO: Add conditional rendering
  // TODO: Add JSX return
}
```

## Step 3: Data Fetching Effect

```tsx
  useEffect(() => {
    async function fetchProduct() {
      try {
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
  }, [id]);
```

## Step 4: Conditional Rendering

```tsx
  // Early returns for loading and error states
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!product) return <div className="error">Product not found</div>;
```

## Step 5: Complete Component

```tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
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
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <div className="product-detail">
      <Link to="/" className="back-link">&larr; Back to products</Link>
      <div className="product-content">
        <img src={product.image} alt={product.name} />
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="category">{product.category}</p>
          <p className="description">{product.description}</p>
          <p className="price">${product.price.toFixed(2)}</p>
          <p className="stock">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
```
