/**
 * ProductCard Component
 *
 * A reusable component for displaying product information in a card format.
 * Demonstrates:
 * - TypeScript props typing
 * - Tailwind CSS styling
 * - Event handling
 */

import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: string) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product.id)
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition">
      <div className="aspect-square bg-gray-200 relative">
        {/* Placeholder for product image */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <span className="text-sm">No image</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-primary-600">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition text-sm"
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
        {product.stock > 0 && product.stock < 10 && (
          <p className="text-xs text-orange-600 mt-2">
            Only {product.stock} left in stock!
          </p>
        )}
      </div>
    </div>
  )
}
