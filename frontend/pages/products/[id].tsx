import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchProductById } from '../../services/api';
import { useCart } from '../../context/CartContext';
import mockProducts from '../../mockData/products.json';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  inventory: number;
};

const ProductDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        setIsLoading(true);
        
        // For development, use mock data
        const mockProduct = mockProducts.find(p => p.id === Number(id));
        if (mockProduct) {
          setProduct(mockProduct);
          setIsLoading(false);
          return;
        }
        
        // If mock data not found or in production, make API call
        const data = await fetchProductById(Number(id));
        setProduct(data);
        setIsLoading(false);
      } catch (err) {
        console.error(`Error fetching product ${id}:`, err);
        setError('Failed to load product details. Please try again later.');
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: quantity,
    });
    
    router.push('/cart');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error || 'Product not found'}</span>
        </div>
        <Link href="/products">
          <a className="text-blue-600 hover:underline">← Back to Products</a>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/products">
        <a className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to Products
        </a>
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mt-4">
        <div className="md:flex">
          <div className="md:w-1/2">
            <div className="relative h-80 w-full md:h-96" style={{ position: 'relative' }}>
              {product.imageUrl ? (
                <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg shadow-md"
                    onError={(e) => {
                      e.currentTarget.src = `https://via.placeholder.com/600x400.png?text=${encodeURIComponent(product.name)}`;
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-200 rounded-lg">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6 md:w-1/2">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            
            <div className="mb-6">
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
              
              {product.inventory <= 5 && product.inventory > 0 && (
                <p className="text-sm text-orange-600 mt-1">
                  Only {product.inventory} left in stock!
                </p>
              )}
              
              {product.inventory <= 0 && (
                <p className="text-sm text-red-600 mt-1">Out of stock</p>
              )}
            </div>
            
            {product.inventory > 0 && (
              <div className="mb-6">
                <label htmlFor="quantity" className="block text-gray-700 mb-2">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="border rounded p-2 w-24"
                >
                  {[...Array(Math.min(10, product.inventory))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <button
              onClick={handleAddToCart}
              disabled={product.inventory <= 0}
              className={`w-full py-3 px-4 rounded-md font-semibold ${
                product.inventory > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-400 text-gray-100 cursor-not-allowed'
              }`}
            >
              {product.inventory > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;