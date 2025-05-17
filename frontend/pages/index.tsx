import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { fetchProducts } from '../services/api';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  inventory: number;
};

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchProducts();
        setFeaturedProducts(products.slice(0, 3)); // Get first 3 products as featured
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center mb-16">
        <h1 className="text-4xl font-bold mb-4 text-center">Welcome to Our E-Commerce Store</h1>
        <p className="text-xl text-gray-600 text-center max-w-3xl mb-8">
          Browse our selection of high-quality products and enjoy a seamless shopping experience.
        </p>
        <button 
          onClick={() => router.push('/products')}
          className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition"
        >
          Shop Now
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
      {loading ? (
        <div className="flex justify-center">
          <p>Loading featured products...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden shadow-md">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="object-contain h-40"
                  />
                ) : (
                  <div className="text-gray-500">No image available</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                <p className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</p>
                <Link href={`/products/${product.id}`} className="block text-center bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700 transition">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <Link href="/products" className="text-blue-600 hover:underline text-lg">
          View All Products →
        </Link>
      </div>
    </div>
  );
}
