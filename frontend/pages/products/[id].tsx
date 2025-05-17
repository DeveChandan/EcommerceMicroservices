import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../../context/CartContext';
import { fetchProductById } from '../../services/api';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  inventory: number;
};

export default function ProductDetail() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        const data = await fetchProductById(Number(id));
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setError('Failed to load product details. Please try again later.');
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: quantity
    });
    
    router.push('/cart');
  };

  const incrementQuantity = () => {
    if (product && quantity < product.inventory) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading product details...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-8">Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <div className="bg-gray-100 rounded-lg flex items-center justify-center h-80">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="object-contain max-h-full max-w-full"
              />
            ) : (
              <div className="text-gray-500">No image available</div>
            )}
          </div>
        </div>
        
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl text-blue-600 font-bold mb-4">${product.price.toFixed(2)}</p>
          <div className="mb-6">
            <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Availability: {product.inventory > 0 ? 'In Stock' : 'Out of Stock'}</p>
            {product.inventory > 0 && (
              <p className="text-sm text-gray-600">{product.inventory} items left</p>
            )}
          </div>
          
          {product.inventory > 0 ? (
            <>
              <div className="flex items-center mb-6">
                <label htmlFor="quantity" className="mr-4">Quantity:</label>
                <div className="flex items-center border rounded">
                  <button 
                    onClick={decrementQuantity}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="px-4 py-1">{quantity}</span>
                  <button 
                    onClick={incrementQuantity}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition w-full md:w-auto"
              >
                Add to Cart
              </button>
            </>
          ) : (
            <button
              disabled
              className="bg-gray-400 text-white py-2 px-6 rounded-md w-full md:w-auto cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
