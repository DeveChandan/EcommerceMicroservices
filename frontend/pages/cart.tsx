import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { useAuth } from '../context/AuthContext';

const Cart: NextPage = () => {
  const { cartItems, updateQuantity, removeFromCart, totalAmount, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=checkout');
    } else {
      router.push('/checkout');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
          <Link href="/products">
            <a className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition">
              Browse Products
            </a>
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            {cartItems.map(item => (
              <CartItem
                key={item.id}
                item={item}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
            ))}
            
            <div className="mt-6 flex justify-between items-center">
              <button 
                onClick={() => clearCart()}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Clear Cart
              </button>
              
              <div className="text-lg">
                <span className="font-semibold">Subtotal:</span> ${totalAmount.toFixed(2)}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Link href="/products">
              <a className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-semibold hover:bg-gray-300 transition">
                Continue Shopping
              </a>
            </Link>
            
            <button
              onClick={handleCheckout}
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;