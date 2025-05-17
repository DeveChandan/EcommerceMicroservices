import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { updateCustomer } from '../services/api';

export default function Profile() {
  const { user, isAuthenticated, logout, setUser } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phoneNumber: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login?redirect=profile');
      return;
    }
    
    // Populate form data if user exists
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        address: user.address || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [isAuthenticated, user, router]);

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
    setSuccessMessage('');
    
    try {
      if (!user) throw new Error('User not authenticated');
      
      const updatedCustomer = await updateCustomer(user.id, formData);
      
      // Update local user data
      setUser({
        ...user,
        ...updatedCustomer,
      });
      
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isAuthenticated || !user) {
    return <div className="container mx-auto px-4 py-8">Redirecting to login...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="block mb-2">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block mb-2">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="address" className="block mb-2">Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows={3}
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label htmlFor="phoneNumber" className="block mb-2">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition disabled:bg-blue-400"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
              
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-600 text-sm">First Name</p>
                <p className="font-medium">{user.firstName}</p>
              </div>
              
              <div>
                <p className="text-gray-600 text-sm">Last Name</p>
                <p className="font-medium">{user.lastName}</p>
              </div>
              
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              
              <div>
                <p className="text-gray-600 text-sm">Phone Number</p>
                <p className="font-medium">{user.phoneNumber || 'Not provided'}</p>
              </div>
              
              <div className="md:col-span-2">
                <p className="text-gray-600 text-sm">Address</p>
                <p className="font-medium">{user.address || 'Not provided'}</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white rounded-lg shadow-md p-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Your Orders</h2>
          <p className="text-gray-600">View your order history and track current orders</p>
        </div>
        
        <Link href="/orders" className="mt-4 md:mt-0 bg-blue-100 text-blue-800 px-4 py-2 rounded hover:bg-blue-200">
          View Orders
        </Link>
      </div>
      
      <div className="mt-8 text-center">
        <button
          onClick={handleLogout}
          className="text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
