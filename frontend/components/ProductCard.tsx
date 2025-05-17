import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  inventory: number;
};

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 w-full" style={{ position: 'relative' }}>
        {product.imageUrl ? (
          <div className="w-full h-full bg-gray-100 rounded-t-lg overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://via.placeholder.com/300x300.png?text=${encodeURIComponent(product.name)}`;
              }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200 rounded-t-lg">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center mt-3">
          <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
          
          <div className="flex space-x-2">
            <Link href={`/products/${product.id}`}>
              <a className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm">
                Details
              </a>
            </Link>
            
            <button
              onClick={onAddToCart}
              disabled={product.inventory <= 0}
              className={`px-3 py-1 rounded text-sm ${
                product.inventory > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-400 text-gray-100 cursor-not-allowed'
              }`}
            >
              {product.inventory > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
        
        {product.inventory <= 5 && product.inventory > 0 && (
          <p className="text-sm text-orange-600 mt-2">
            Only {product.inventory} left in stock!
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;