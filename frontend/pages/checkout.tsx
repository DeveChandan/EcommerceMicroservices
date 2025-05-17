import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/api';
import Link from 'next/link';

const Checkout: NextPage = () => {
  const router = useRouter();
  const { cartItems, totalAmount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const [shippingAddress, setShippingAddress] = useState<string>(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState<string>('credit_card');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [upiId, setUpiId] = useState<string>('');
  const [showVerification, setShowVerification] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<Array<any>>([]);
  const [phoneNumber, setPhoneNumber] = useState<string>(user?.phoneNumber || '');
  const [showPriceInRupees, setShowPriceInRupees] = useState<boolean>(false);
  const [isUpiVerified, setIsUpiVerified] = useState<boolean>(false);
  
  // Exchange rate for USD to INR (illustrative)
  const exchangeRate = 83;

  useEffect(() => {
    // Load saved payment methods (mock for demo)
    if (user) {
      setSavedPaymentMethods([
        {
          id: 1,
          type: 'card',
          last4: '4242',
          brand: 'Visa',
          isDefault: true
        }
      ]);
    }
  }, [user]);

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
    
    if (paymentMethod === 'upi' && !isUpiVerified) {
      setError('Please verify your UPI ID before proceeding');
      return;
    }
    
    if (!phoneNumber.trim()) {
      setError('Please enter a phone number for delivery updates');
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
        shippingAddress,
        paymentMethod,
        phoneNumber,
        ...(paymentMethod === 'upi' && { upiId })
      };
      
      // For demo, simulate order creation
      setTimeout(async () => {
        try {
          // In a production app, the following would be a real API call
          // const response = await createOrder(orderData);
          
          // Instead, simulate a successful order
          const mockOrderId = Math.floor(100000 + Math.random() * 900000);
          
          // Clear cart after successful order
          clearCart();
          
          // Redirect to order confirmation
          router.push(`/orders/${mockOrderId}`);
        } catch (err) {
          console.error('Error creating order:', err);
          setError('Failed to process your order. Please try again later.');
          setIsProcessing(false);
        }
      }, 2000);
      
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Failed to process your order. Please try again later.');
      setIsProcessing(false);
    }
  };
  
  const handleVerifyUpi = () => {
    // Validate UPI ID format
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    if (!upiId || !upiRegex.test(upiId)) {
      setError('Please enter a valid UPI ID (e.g., yourname@okicici)');
      return;
    }
    
    // Generate random verification code (for demo)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(code);
    setShowVerification(true);
    setError(null);
  };
  
  const handleVerificationSubmit = () => {
    // In a real app, you would validate the code against what was sent
    // For demo, we'll just accept the generated code
    setShowVerification(false);
    setIsUpiVerified(true);
    
    // Add to saved payment methods (for demo)
    const newMethod = {
      id: savedPaymentMethods.length + 1,
      type: 'upi',
      upiId,
      isDefault: false
    };
    
    setSavedPaymentMethods([...savedPaymentMethods, newMethod]);
  };
  
  const getUpiAppIcon = (upiId: string) => {
    if (upiId.includes('@okicici')) {
      return (
        <div className="bg-red-600 text-white text-xs font-bold w-8 h-6 rounded flex items-center justify-center">
          ICICI
        </div>
      );
    } else if (upiId.includes('@oksbi')) {
      return (
        <div className="bg-blue-800 text-white text-xs font-bold w-8 h-6 rounded flex items-center justify-center">
          SBI
        </div>
      );
    } else if (upiId.includes('@paytm')) {
      return (
        <div className="bg-blue-400 text-white text-xs font-bold w-8 h-6 rounded flex items-center justify-center">
          PAYTM
        </div>
      );
    } else if (upiId.includes('@ybl')) {
      return (
        <div className="bg-green-600 text-white text-xs font-bold w-8 h-6 rounded flex items-center justify-center">
          GPAY
        </div>
      );
    } else {
      return (
        <div className="bg-gray-600 text-white text-xs font-bold w-8 h-6 rounded flex items-center justify-center">
          UPI
        </div>
      );
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
                  placeholder="Enter your full delivery address with postal code"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="phone" className="block text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full p-2 border rounded"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  placeholder="For delivery updates"
                />
              </div>
              
              <h2 className="text-xl font-semibold mb-4 mt-8">Payment Method</h2>
              
              {/* Currency Toggle */}
              <div className="flex items-center justify-end mb-4">
                <span className="text-sm mr-2">Show prices in:</span>
                <div className="relative inline-block w-12 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    name="toggle" 
                    id="currency-toggle" 
                    checked={showPriceInRupees}
                    onChange={() => setShowPriceInRupees(!showPriceInRupees)}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label 
                    htmlFor="currency-toggle" 
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  ></label>
                </div>
                <span className={`text-sm font-medium ${showPriceInRupees ? 'text-blue-600' : 'text-gray-500'}`}>
                  ₹ INR
                </span>
              </div>
              
              {/* Saved Payment Methods */}
              {savedPaymentMethods.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Saved Payment Methods</h3>
                  <div className="space-y-2">
                    {savedPaymentMethods.map(method => (
                      <div 
                        key={method.id}
                        className={`border rounded p-3 flex items-center cursor-pointer hover:bg-gray-50 ${
                          (method.type === 'card' && paymentMethod === 'credit_card') || 
                          (method.type === 'upi' && paymentMethod === 'upi' && upiId === method.upiId) 
                            ? 'border-blue-500 bg-blue-50' 
                            : ''
                        }`}
                        onClick={() => {
                          if (method.type === 'card') {
                            setPaymentMethod('credit_card');
                          } else if (method.type === 'upi') {
                            setPaymentMethod('upi');
                            setUpiId(method.upiId);
                            setIsUpiVerified(true);
                          }
                        }}
                      >
                        <input 
                          type="radio"
                          checked={
                            (method.type === 'card' && paymentMethod === 'credit_card') || 
                            (method.type === 'upi' && paymentMethod === 'upi' && upiId === method.upiId)
                          }
                          onChange={() => {}}
                          className="mr-2"
                        />
                        {method.type === 'card' ? (
                          <div className="flex items-center">
                            <div className="bg-blue-800 text-white text-xs font-bold w-8 h-6 rounded flex items-center justify-center mr-2">
                              {method.brand}
                            </div>
                            <span>•••• •••• •••• {method.last4}</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            {getUpiAppIcon(method.upiId)}
                            <span className="ml-2">{method.upiId}</span>
                          </div>
                        )}
                        {method.isDefault && (
                          <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 border-t pt-2">
                    <p className="text-sm text-gray-500">Or select a new payment method below</p>
                  </div>
                </div>
              )}
              
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
                  <label htmlFor="credit_card" className="flex items-center">
                    <span className="mr-2">Credit/Debit Card</span>
                    <div className="flex space-x-1">
                      <div className="w-8 h-5 bg-blue-800 text-white text-xs flex items-center justify-center rounded">VISA</div>
                      <div className="w-8 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded">MC</div>
                    </div>
                  </label>
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
                
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    id="upi"
                    name="payment_method"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => {
                      setPaymentMethod('upi');
                      if (!isUpiVerified) {
                        setUpiId('');
                      }
                    }}
                    className="mr-2"
                  />
                  <label htmlFor="upi" className="flex items-center">
                    <span className="mr-2">UPI Payment</span>
                    <div className="flex space-x-1">
                      <div className="w-8 h-5 bg-green-600 text-white text-xs flex items-center justify-center rounded">GPay</div>
                      <div className="w-8 h-5 bg-blue-500 text-white text-xs flex items-center justify-center rounded">PAYTM</div>
                      <div className="w-8 h-5 bg-red-600 text-white text-xs flex items-center justify-center rounded">BHIM</div>
                    </div>
                  </label>
                </div>
              </div>
              
              {paymentMethod === 'credit_card' && (
                <div className="p-4 bg-gray-50 rounded mb-4">
                  <div className="mb-4">
                    <label htmlFor="cardNumber" className="block text-gray-700 mb-2 text-sm">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      className="w-full p-2 border rounded"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="cardName" className="block text-gray-700 mb-2 text-sm">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      className="w-full p-2 border rounded"
                      placeholder="John Smith"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label htmlFor="expiryMonth" className="block text-gray-700 mb-2 text-sm">Month</label>
                      <select id="expiryMonth" className="w-full p-2 border rounded">
                        <option value="" disabled selected>MM</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i} value={i + 1}>{String(i + 1).padStart(2, '0')}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="col-span-1">
                      <label htmlFor="expiryYear" className="block text-gray-700 mb-2 text-sm">Year</label>
                      <select id="expiryYear" className="w-full p-2 border rounded">
                        <option value="" disabled selected>YY</option>
                        {Array.from({ length: 10 }, (_, i) => {
                          const year = new Date().getFullYear() + i;
                          return <option key={year} value={year}>{year}</option>;
                        })}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="cvv" className="block text-gray-700 mb-2 text-sm">CVV</label>
                      <input
                        type="text"
                        id="cvv"
                        className="w-full p-2 border rounded"
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {paymentMethod === 'paypal' && (
                <div className="p-4 bg-gray-50 rounded mb-4">
                  <p className="text-gray-600 text-sm">
                    You will be redirected to PayPal to complete your payment after you click "Complete Order".
                  </p>
                </div>
              )}
              
              {paymentMethod === 'upi' && (
                <div className="p-4 bg-gray-50 rounded mb-4">
                  {showVerification ? (
                    <div>
                      <p className="text-sm text-gray-700 mb-3">
                        A verification code has been sent to your registered mobile number. Enter the code below.
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        For demo purposes only, your code is: <span className="font-bold">{verificationCode}</span>
                      </p>
                      
                      <div className="mb-4">
                        <label htmlFor="verification-code" className="block text-gray-700 mb-2 text-sm">
                          Verification Code
                        </label>
                        <input
                          type="text"
                          id="verification-code"
                          className="w-full p-2 border rounded"
                          placeholder="Enter 6-digit code"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          maxLength={6}
                        />
                      </div>
                      
                      <div className="flex justify-between">
                        <button
                          type="button"
                          className="text-gray-600 text-sm"
                          onClick={() => setShowVerification(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                          onClick={handleVerificationSubmit}
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {isUpiVerified ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {getUpiAppIcon(upiId)}
                            <span className="ml-2 font-medium">{upiId}</span>
                            <span className="ml-2 text-green-600 text-sm">✓ Verified</span>
                          </div>
                          <button
                            type="button"
                            className="text-blue-600 text-sm"
                            onClick={() => {
                              setIsUpiVerified(false);
                              setUpiId('');
                            }}
                          >
                            Change
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="mb-4">
                            <label htmlFor="upiId" className="block text-gray-700 mb-2 text-sm">
                              Enter UPI ID
                            </label>
                            <div className="flex">
                              <input
                                type="text"
                                id="upiId"
                                className="flex-1 p-2 border rounded-l"
                                placeholder="yourname@okicici"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                              />
                              <button
                                type="button"
                                className="bg-blue-600 text-white px-4 py-2 rounded-r"
                                onClick={handleVerifyUpi}
                              >
                                Verify
                              </button>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                              Example formats: name@okicici, name@oksbi, name@paytm, name@ybl
                            </p>
                          </div>
                          
                          <div className="bg-blue-50 border border-blue-200 rounded p-3">
                            <div className="flex items-start">
                              <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div className="ml-3">
                                <p className="text-sm text-blue-800">
                                  Using UPI enables fast and secure payments directly from your bank account. A verification code will be sent to your registered mobile number.
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              <button
                type="submit"
                disabled={isProcessing || (paymentMethod === 'upi' && !isUpiVerified)}
                className={`w-full py-3 px-4 rounded-md font-semibold ${
                  isProcessing || (paymentMethod === 'upi' && !isUpiVerified)
                    ? 'bg-gray-400 text-gray-100 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isProcessing ? 'Processing...' : showPriceInRupees 
                  ? `Complete Order • ₹${Math.round(totalAmount * exchangeRate)}`
                  : `Complete Order • $${totalAmount.toFixed(2)}`}
              </button>
              
              <div className="mt-4 text-center text-xs text-gray-500">
                <p>By completing your purchase, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.</p>
              </div>
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
                        onError={(e) => {
                          (e.target as HTMLImageElement).onerror = null;
                          (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                        }}
                      />
                    )}
                  </div>
                  
                  <div className="ml-3 flex-grow">
                    <h3 className="text-sm font-medium">{item.name}</h3>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  
                  <div className="text-sm font-semibold">
                    {showPriceInRupees
                      ? `₹${Math.round(item.price * item.quantity * exchangeRate)}`
                      : `$${(item.price * item.quantity).toFixed(2)}`}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>{showPriceInRupees
                  ? `₹${Math.round(totalAmount * exchangeRate)}`
                  : `$${totalAmount.toFixed(2)}`}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span>Tax</span>
                <span>{showPriceInRupees
                  ? `₹${Math.round(totalAmount * 0.18 * exchangeRate)}`
                  : `$${(totalAmount * 0.1).toFixed(2)}`}</span>
              </div>
              
              <div className="flex justify-between font-semibold text-lg mt-4 border-t pt-2">
                <span>Total</span>
                <span>{showPriceInRupees
                  ? `₹${Math.round(totalAmount * exchangeRate * 1.18)}`
                  : `$${(totalAmount * 1.1).toFixed(2)}`}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <Link href="/cart">
                <a className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Return to Cart
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #3B82F6;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #3B82F6;
        }
      `}</style>
    </div>
  );
};

export default Checkout;