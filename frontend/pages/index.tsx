import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  inventory: number;
};

const Home: NextPage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const products = await fetchProducts();
        // Get a subset of products for the featured section
        setFeaturedProducts(products.slice(0, 4));
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
    });
  };

  return (
    <div>
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to TechTreasure</h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto">Your one-stop destination for premium tech products at unbeatable prices</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products">
              <a className="bg-white text-blue-700 px-8 py-4 rounded-md font-semibold hover:bg-gray-100 transition shadow-lg transform hover:-translate-y-1">
                Shop Now
              </a>
            </Link>
            <Link href="/register">
              <a className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-md font-semibold hover:bg-white hover:text-blue-700 transition shadow-lg transform hover:-translate-y-1">
                Join Us
              </a>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No products available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </div>
          )}
          
          <div className="text-center mt-10">
            <Link href="/products">
              <a className="text-blue-600 font-semibold hover:underline">
                View All Products →
              </a>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Why Choose TechTreasure</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center transform transition-transform duration-300 hover:-translate-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 text-3xl mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast & Free Shipping</h3>
              <p className="text-gray-600">Get your tech products delivered to your doorstep quickly and reliably with our express shipping service.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg text-center transform transition-transform duration-300 hover:-translate-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 text-3xl mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">30-Day Money Back</h3>
              <p className="text-gray-600">Not satisfied? Return any product within 30 days for a full refund, no questions asked.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg text-center transform transition-transform duration-300 hover:-translate-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 text-3xl mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Payments</h3>
              <p className="text-gray-600">Your payment information is always protected with our advanced encryption and secure checkout system.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;