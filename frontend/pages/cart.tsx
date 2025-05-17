import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/CartItem';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    // Calculate subtotal
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(total);
  }, [cartItems]);

  const handleCheckout = () => {
    if (isAuthenticated) {
      router.push('/checkout');
    } else {
      router.push('/login?redirect=checkout');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
          <Link href="/products" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Cart Items</h2>
              </div>
              
              <ul>
                {cartItems.map((item) => (
                  <CartItem 
                    key={item.id} 
                    item={item} 
                    updateQuantity={updateQuantity} 
                    removeFromCart={removeFromCart} 
                  />
                ))}
              </ul>
            </div>
            
            <div className="mt-4 flex justify-between">
              <button 
                onClick={() => router.push('/products')}
                className="text-blue-600 hover:underline"
              >
                Continue Shopping
              </button>
              
              <button 
                onClick={() => clearCart()}
                className="text-red-600 hover:underline"
              >
                Clear Cart
              </button>
            </div>
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              
              <div className="border-t my-4"></div>
              
              <div className="flex justify-between font-semibold text-lg mb-6">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <button
                onClick={handleCheckout}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition w-full"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
