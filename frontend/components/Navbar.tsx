import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/">
            <a className="text-xl font-bold">E-Commerce Store</a>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link href="/products">
              <a className="hover:text-gray-300">Products</a>
            </Link>
            
            <Link href="/cart">
              <a className="hover:text-gray-300 relative">
                Cart
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </a>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link href="/orders">
                  <a className="hover:text-gray-300">Orders</a>
                </Link>
                
                <Link href="/profile">
                  <a className="hover:text-gray-300">Profile</a>
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="hover:text-gray-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <a className="hover:text-gray-300">Login</a>
                </Link>
                
                <Link href="/register">
                  <a className="hover:text-gray-300">Register</a>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;