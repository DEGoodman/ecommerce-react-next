# Exercise 1-7 Solution: ProductDetail

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
