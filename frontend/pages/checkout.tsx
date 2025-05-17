import { NextPage } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/api';

const Checkout: NextPage = () => {
  const router = useRouter();
  const { cartItems, totalAmount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const [shippingAddress, setShippingAddress] = useState<string>(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState<string>('credit_card');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      router.push('/login?redirect=checkout');
    }
    return null;
  }

  // Redirect to products if cart is empty
  if (cartItems.length === 0) {
    if (typeof window !== 'undefined') {
      router.push('/products');
    }
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shippingAddress.trim()) {
      setError('Please enter a shipping address');
      return;
    }
    
    try {
      setIsProcessing(true);
      setError(null);
      
      const orderData = {
        customerId: user?.id,
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        shippingAddress
      };
      
      const response = await createOrder(orderData);
      
      // Clear cart after successful order
      clearCart();
      
      // Redirect to order confirmation
      router.push(`/orders/${response.id}`);
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Failed to process your order. Please try again later.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-2 border rounded"
                  value={`${user?.firstName} ${user?.lastName}`}
                  readOnly
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-2 border rounded"
                  value={user?.email}
                  readOnly
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="address" className="block text-gray-700 mb-2">
                  Shipping Address *
                </label>
                <textarea
                  id="address"
                  className="w-full p-2 border rounded"
                  rows={3}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  required
                />
              </div>
              
              <h2 className="text-xl font-semibold mb-4 mt-8">Payment Method</h2>
              
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    id="credit_card"
                    name="payment_method"
                    value="credit_card"
                    checked={paymentMethod === 'credit_card'}
                    onChange={() => setPaymentMethod('credit_card')}
                    className="mr-2"
                  />
                  <label htmlFor="credit_card">Credit Card</label>
                </div>
                
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    id="paypal"
                    name="payment_method"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                    className="mr-2"
                  />
                  <label htmlFor="paypal">PayPal</label>
                </div>
              </div>
              
              {paymentMethod === 'credit_card' && (
                <div className="p-4 bg-gray-50 rounded mb-4">
                  <p className="text-gray-600 text-sm">
                    Note: In a production environment, this would include secure credit card input fields.
                    For this demo, we're not collecting actual payment details.
                  </p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-3 px-4 rounded-md font-semibold ${
                  isProcessing
                    ? 'bg-gray-400 text-gray-100 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isProcessing ? 'Processing...' : `Complete Order • $${totalAmount.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="mb-4 max-h-96 overflow-y-auto">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center py-2 border-b">
                  <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                  </div>
                  
                  <div className="ml-3 flex-grow">
                    <h3 className="text-sm font-medium">{item.name}</h3>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  
                  <div className="text-sm font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              
              <div className="flex justify-between font-semibold text-lg mt-4">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;