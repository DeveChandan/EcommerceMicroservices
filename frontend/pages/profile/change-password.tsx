import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';

const ChangePassword: NextPage = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/profile/change-password');
    }
  }, [isAuthenticated, isLoading, router]);
  
  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Character type checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Calculate password strength for new password
    if (name === 'newPassword') {
      setPasswordStrength(calculatePasswordStrength(value));
      
      // If confirm password exists, validate match
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors({
          ...errors,
          confirmPassword: 'Passwords do not match'
        });
      } else if (formData.confirmPassword) {
        setErrors({
          ...errors,
          confirmPassword: ''
        });
      }
    }
    
    // Validate confirm password on the fly
    if (name === 'confirmPassword') {
      if (value !== formData.newPassword) {
        setErrors({
          ...errors,
          confirmPassword: 'Passwords do not match'
        });
      } else {
        setErrors({
          ...errors,
          confirmPassword: ''
        });
      }
    }
  };
  
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real application, this would be an API call
      // await updatePassword(formData.currentPassword, formData.newPassword);
      
      // For demonstration purposes, simulate success after a delay
      setTimeout(() => {
        setSuccessMessage('Password updated successfully');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setPasswordStrength(0);
        setIsSubmitting(false);
        
        // Redirect back to profile after a delay
        setTimeout(() => {
          router.push('/profile');
        }, 2000);
      }, 1500);
    } catch (error: any) {
      setErrors({
        ...errors,
        form: error.message || 'Failed to update password'
      });
      setIsSubmitting(false);
    }
  };
  
  const renderPasswordStrength = () => {
    const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];
    
    if (passwordStrength === 0) {
      return null;
    }
    
    return (
      <div className="mt-1">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${strengthColors[passwordStrength-1] || 'bg-gray-200'}`} 
            style={{ width: `${passwordStrength * 20}%` }}
          ></div>
        </div>
        {passwordStrength > 0 && (
          <p className="text-xs mt-1 text-gray-500">
            Password strength: <span className="font-medium">{strengthLabels[passwordStrength-1]}</span>
          </p>
        )}
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="mb-6 flex items-center">
          <Link href="/profile">
            <a className="text-blue-600 hover:text-blue-800 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Profile
            </a>
          </Link>
          <h1 className="text-2xl font-bold">Change Password</h1>
        </div>
        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}
        
        {errors.form && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.form}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="currentPassword" className="block text-gray-700 mb-2">
                Current Password *
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                  errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your current password"
              />
              {errors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-gray-700 mb-2">
                New Password *
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                  errors.newPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your new password"
              />
              {renderPasswordStrength()}
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
                Confirm New Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirm your new password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <Link href="/profile">
                <a className="text-gray-600 hover:text-gray-800">
                  Cancel
                </a>
              </Link>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`py-2 px-4 rounded font-medium text-white ${
                  isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Password Tips</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc space-y-1 pl-5">
                  <li>Use at least 8 characters</li>
                  <li>Include uppercase and lowercase letters</li>
                  <li>Include at least one number and special character</li>
                  <li>Don't reuse passwords from other sites</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChangePassword;