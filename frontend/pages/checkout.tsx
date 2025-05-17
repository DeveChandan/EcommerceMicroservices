import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/api';

export default function Checkout() {
  const { cartItems, totalAmount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    shippingAddress: user?.address || '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login?redirect=checkout');
    }
    
    // Redirect to products if cart is empty
    if (cartItems.length === 0) {
      router.push('/products');
    }
  }, [isAuthenticated, cartItems, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      if (!user) throw new Error('User not authenticated');
      
      const orderData = {
        customerId: user.id,
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: formData.shippingAddress,
      };
      
      const order = await createOrder(orderData);
      
      // Clear cart and redirect to success page
      clearCart();
      router.push('/orders');
      
    } catch (error) {
      console.error('Failed to create order:', error);
      setError('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated || cartItems.length === 0) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="shippingAddress" className="block mb-2">Shipping Address</label>
                <textarea
                  id="shippingAddress"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                  rows={3}
                ></textarea>
              </div>
              
              {error && (
                <div className="text-red-500 mb-4">{error}</div>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition disabled:bg-blue-400"
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>{item.name} (x{item.quantity})</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            
            <div className="border-t my-4"></div>
            
            <div className="flex justify-between font-semibold text-lg mb-2">
              <span>Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            
            <div className="border-t my-4"></div>
            
            <div className="flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
