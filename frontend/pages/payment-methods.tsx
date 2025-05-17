import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const PaymentMethods: NextPage = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [savedUpiIds, setSavedUpiIds] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('cards');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Card form state
  const [cardFormData, setCardFormData] = useState({
    cardNumber: '',
    nameOnCard: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });
  
  // UPI form state
  const [upiFormData, setUpiFormData] = useState({
    upiId: '',
    nickname: ''
  });
  
  // Validation states
  const [cardErrors, setCardErrors] = useState<{[key: string]: string}>({});
  const [upiErrors, setUpiErrors] = useState<{[key: string]: string}>({});
  
  // Mock saved payment methods for demo
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      // Simulate loading saved payment methods
      setTimeout(() => {
        // For demo purposes, we'll add mock data
        setSavedCards([
          {
            id: 1,
            last4: '4242',
            brand: 'Visa',
            expMonth: 12,
            expYear: 2025,
            isDefault: true
          }
        ]);
        
        setSavedUpiIds([
          {
            id: 1,
            upiId: 'user@okicici',
            nickname: 'ICICI Bank',
            isDefault: true
          }
        ]);
      }, 800);
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/payment-methods');
    }
  }, [isAuthenticated, isLoading, router]);

  const validateCardForm = () => {
    const errors: {[key: string]: string} = {};
    
    // Card number validation (basic)
    if (!cardFormData.cardNumber.trim()) {
      errors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(cardFormData.cardNumber.replace(/\s/g, ''))) {
      errors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    
    // Name validation
    if (!cardFormData.nameOnCard.trim()) {
      errors.nameOnCard = 'Name on card is required';
    }
    
    // Expiry validation
    if (!cardFormData.expiryMonth) {
      errors.expiryMonth = 'Required';
    }
    
    if (!cardFormData.expiryYear) {
      errors.expiryYear = 'Required';
    }
    
    // CVV validation
    if (!cardFormData.cvv.trim()) {
      errors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(cardFormData.cvv)) {
      errors.cvv = 'Invalid CVV';
    }
    
    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const validateUpiForm = () => {
    const errors: {[key: string]: string} = {};
    
    // UPI ID validation
    if (!upiFormData.upiId.trim()) {
      errors.upiId = 'UPI ID is required';
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upiFormData.upiId)) {
      errors.upiId = 'Please enter a valid UPI ID (e.g., name@bank)';
    }
    
    // Nickname validation (optional)
    if (upiFormData.nickname.trim() && upiFormData.nickname.length > 20) {
      errors.nickname = 'Nickname should be less than 20 characters';
    }
    
    setUpiErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setCardFormData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setCardFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user types
    if (cardErrors[name]) {
      setCardErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleUpiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpiFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (upiErrors[name]) {
      setUpiErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmitCard = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateCardForm()) {
      // In a real app, this is where you'd send the card info to your payment processor
      // For demo purposes, we'll just simulate adding a card
      const newCard = {
        id: savedCards.length + 1,
        last4: cardFormData.cardNumber.slice(-4),
        brand: determineCardBrand(cardFormData.cardNumber),
        expMonth: parseInt(cardFormData.expiryMonth),
        expYear: parseInt(cardFormData.expiryYear),
        isDefault: savedCards.length === 0
      };
      
      setSavedCards([...savedCards, newCard]);
      setIsAddingNew(false);
      setSuccessMessage('Card added successfully');
      
      // Reset form
      setCardFormData({
        cardNumber: '',
        nameOnCard: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: ''
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };
  
  const handleSubmitUpi = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateUpiForm()) {
      // For demo purposes, we'll just simulate adding a UPI ID
      const newUpi = {
        id: savedUpiIds.length + 1,
        upiId: upiFormData.upiId,
        nickname: upiFormData.nickname || `UPI ID ${savedUpiIds.length + 1}`,
        isDefault: savedUpiIds.length === 0
      };
      
      setSavedUpiIds([...savedUpiIds, newUpi]);
      setIsAddingNew(false);
      setSuccessMessage('UPI ID added successfully');
      
      // Reset form
      setUpiFormData({
        upiId: '',
        nickname: ''
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  const handleDeleteCard = (id: number) => {
    const updatedCards = savedCards.filter(card => card.id !== id);
    
    // If the default card was deleted and there are other cards, make the first one default
    if (savedCards.find(card => card.id === id)?.isDefault && updatedCards.length > 0) {
      updatedCards[0].isDefault = true;
    }
    
    setSavedCards(updatedCards);
    setSuccessMessage('Card removed successfully');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  const handleDeleteUpi = (id: number) => {
    const updatedUpiIds = savedUpiIds.filter(upi => upi.id !== id);
    
    // If the default UPI was deleted and there are other UPIs, make the first one default
    if (savedUpiIds.find(upi => upi.id === id)?.isDefault && updatedUpiIds.length > 0) {
      updatedUpiIds[0].isDefault = true;
    }
    
    setSavedUpiIds(updatedUpiIds);
    setSuccessMessage('UPI ID removed successfully');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  const handleSetDefaultCard = (id: number) => {
    const updatedCards = savedCards.map(card => ({
      ...card,
      isDefault: card.id === id
    }));
    
    setSavedCards(updatedCards);
    setSuccessMessage('Default payment method updated');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  const handleSetDefaultUpi = (id: number) => {
    const updatedUpiIds = savedUpiIds.map(upi => ({
      ...upi,
      isDefault: upi.id === id
    }));
    
    setSavedUpiIds(updatedUpiIds);
    setSuccessMessage('Default payment method updated');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const determineCardBrand = (cardNumber: string): string => {
    const cleanNumber = cardNumber.replace(/\s+/g, '');
    
    if (/^4/.test(cleanNumber)) return 'Visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'Mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'American Express';
    if (/^6(?:011|5)/.test(cleanNumber)) return 'Discover';
    
    return 'Unknown';
  };

  const getCardIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return (
          <svg className="h-6 w-6 text-blue-800" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.3 7.1H21.7L23.8 24.9H8.2L10.3 7.1Z" fill="currentColor" />
            <path d="M14 14.9L15.8 12.3C16 12.1 16.3 12 16.5 12C17.1 12 17.5 12.6 17.3 13.2L16.1 17.2C16 17.6 15.6 17.9 15.2 17.9H12.6C12.2 17.9 11.8 17.6 11.7 17.2L10.7 13.1C10.5 12.5 11 12 11.6 12C11.9 12 12.2 12.2 12.3 12.4L13.2 14.9H14Z" fill="white" />
          </svg>
        );
      case 'mastercard':
        return (
          <svg className="h-6 w-6" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="16" r="8" fill="#EB001B" />
            <circle cx="20" cy="16" r="8" fill="#F79E1B" />
            <path d="M16 21.3C18.1 19.6 19 16.9 19 16C19 15.1 18.1 12.4 16 10.7C13.9 12.4 13 15.1 13 16C13 16.9 13.9 19.6 16 21.3Z" fill="#FF5F00" />
          </svg>
        );
      case 'american express':
        return (
          <svg className="h-6 w-6 text-blue-500" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="8" width="24" height="16" rx="2" fill="currentColor" />
            <path d="M16 12L18 16L16 20H13L11 16L13 12H16Z" fill="white" />
            <path d="M20 12H24V16H20V20H17V12H20Z" fill="white" />
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M7 15C7 14.4477 7.44772 14 8 14H10C10.5523 14 11 14.4477 11 15C11 15.5523 10.5523 16 10 16H8C7.44772 16 7 15.5523 7 15Z" fill="currentColor" />
            <path d="M13 15C13 14.4477 13.4477 14 14 14H16C16.5523 14 17 14.4477 17 15C17 15.5523 16.5523 16 16 16H14C13.4477 16 13 15.5523 13 15Z" fill="currentColor" />
          </svg>
        );
    }
  };

  const getUpiIcon = (upiId: string) => {
    if (upiId.includes('@okicici')) {
      return (
        <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
          ICICI
        </div>
      );
    } else if (upiId.includes('@okaxis')) {
      return (
        <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
          AXIS
        </div>
      );
    } else if (upiId.includes('@oksbi')) {
      return (
        <div className="h-8 w-8 bg-blue-800 rounded-full flex items-center justify-center text-white text-xs font-bold">
          SBI
        </div>
      );
    } else if (upiId.includes('@paytm')) {
      return (
        <div className="h-8 w-8 bg-blue-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
          PTM
        </div>
      );
    } else if (upiId.includes('@ybl')) {
      return (
        <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
          GPay
        </div>
      );
    } else {
      return (
        <div className="h-8 w-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
          UPI
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Link href="/profile">
              <a className="text-blue-600 hover:text-blue-800 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Profile
              </a>
            </Link>
            <h1 className="text-2xl font-bold">Payment Methods</h1>
          </div>
          
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 relative">
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}
          
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm focus:outline-none ${
                    activeTab === 'cards'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setActiveTab('cards');
                    setIsAddingNew(false);
                  }}
                >
                  Credit & Debit Cards
                </button>
                <button
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm focus:outline-none ${
                    activeTab === 'upi'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setActiveTab('upi');
                    setIsAddingNew(false);
                  }}
                >
                  UPI
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              {isAddingNew ? (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">
                      {activeTab === 'cards' ? 'Add New Card' : 'Add New UPI ID'}
                    </h2>
                    <button
                      onClick={() => setIsAddingNew(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {activeTab === 'cards' ? (
                    <form onSubmit={handleSubmitCard}>
                      <div className="mb-4">
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19} // 16 digits + 3 spaces
                          value={cardFormData.cardNumber}
                          onChange={handleCardChange}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border ${
                            cardErrors.cardNumber ? 'border-red-300' : ''
                          }`}
                        />
                        {cardErrors.cardNumber && (
                          <p className="mt-1 text-sm text-red-600">{cardErrors.cardNumber}</p>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 mb-1">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          id="nameOnCard"
                          name="nameOnCard"
                          placeholder="John Smith"
                          value={cardFormData.nameOnCard}
                          onChange={handleCardChange}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border ${
                            cardErrors.nameOnCard ? 'border-red-300' : ''
                          }`}
                        />
                        {cardErrors.nameOnCard && (
                          <p className="mt-1 text-sm text-red-600">{cardErrors.nameOnCard}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="col-span-1">
                          <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Month
                          </label>
                          <select
                            id="expiryMonth"
                            name="expiryMonth"
                            value={cardFormData.expiryMonth}
                            onChange={handleCardChange}
                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border ${
                              cardErrors.expiryMonth ? 'border-red-300' : ''
                            }`}
                          >
                            <option value="">Month</option>
                            {Array.from({ length: 12 }, (_, i) => {
                              const month = i + 1;
                              return (
                                <option key={month} value={month}>
                                  {month.toString().padStart(2, '0')}
                                </option>
                              );
                            })}
                          </select>
                          {cardErrors.expiryMonth && (
                            <p className="mt-1 text-sm text-red-600">{cardErrors.expiryMonth}</p>
                          )}
                        </div>
                        
                        <div className="col-span-1">
                          <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Year
                          </label>
                          <select
                            id="expiryYear"
                            name="expiryYear"
                            value={cardFormData.expiryYear}
                            onChange={handleCardChange}
                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border ${
                              cardErrors.expiryYear ? 'border-red-300' : ''
                            }`}
                          >
                            <option value="">Year</option>
                            {Array.from({ length: 10 }, (_, i) => {
                              const year = new Date().getFullYear() + i;
                              return (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              );
                            })}
                          </select>
                          {cardErrors.expiryYear && (
                            <p className="mt-1 text-sm text-red-600">{cardErrors.expiryYear}</p>
                          )}
                        </div>
                        
                        <div className="col-span-1">
                          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="password"
                            id="cvv"
                            name="cvv"
                            placeholder="123"
                            maxLength={4}
                            value={cardFormData.cvv}
                            onChange={handleCardChange}
                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border ${
                              cardErrors.cvv ? 'border-red-300' : ''
                            }`}
                          />
                          {cardErrors.cvv && (
                            <p className="mt-1 text-sm text-red-600">{cardErrors.cvv}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setIsAddingNew(false)}
                          className="bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none mr-3"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-blue-600 border border-transparent rounded-md shadow-sm px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
                        >
                          Save Card
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleSubmitUpi}>
                      <div className="mb-4">
                        <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
                          UPI ID
                        </label>
                        <input
                          type="text"
                          id="upiId"
                          name="upiId"
                          placeholder="yourname@bank"
                          value={upiFormData.upiId}
                          onChange={handleUpiChange}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border ${
                            upiErrors.upiId ? 'border-red-300' : ''
                          }`}
                        />
                        {upiErrors.upiId && (
                          <p className="mt-1 text-sm text-red-600">{upiErrors.upiId}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                          Examples: yourname@okicici, yourname@oksbi, yourname@paytm
                        </p>
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
                          Nickname (Optional)
                        </label>
                        <input
                          type="text"
                          id="nickname"
                          name="nickname"
                          placeholder="e.g., ICICI Bank"
                          value={upiFormData.nickname}
                          onChange={handleUpiChange}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border ${
                            upiErrors.nickname ? 'border-red-300' : ''
                          }`}
                        />
                        {upiErrors.nickname && (
                          <p className="mt-1 text-sm text-red-600">{upiErrors.nickname}</p>
                        )}
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setIsAddingNew(false)}
                          className="bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none mr-3"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-blue-600 border border-transparent rounded-md shadow-sm px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
                        >
                          Save UPI ID
                        </button>
                      </div>
                    </form>
                  )}
                </>
              ) : (
                <>
                  {/* Saved Payment Methods List */}
                  {activeTab === 'cards' ? (
                    <>
                      {savedCards.length > 0 ? (
                        <div className="space-y-4">
                          {savedCards.map(card => (
                            <div key={card.id} className="border rounded-lg p-4 flex items-center justify-between">
                              <div className="flex items-center">
                                {getCardIcon(card.brand)}
                                <div className="ml-4">
                                  <div className="flex items-center">
                                    <p className="font-medium">
                                      {card.brand} ending in {card.last4}
                                    </p>
                                    {card.isDefault && (
                                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                                        Default
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    Expires {card.expMonth.toString().padStart(2, '0')}/{card.expYear}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                {!card.isDefault && (
                                  <button
                                    onClick={() => handleSetDefaultCard(card.id)}
                                    className="text-sm text-blue-600 hover:text-blue-800 mr-4"
                                  >
                                    Set as default
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteCard(card.id)}
                                  className="text-sm text-red-600 hover:text-red-800"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No cards saved</h3>
                          <p className="mt-1 text-sm text-gray-500">Add a credit or debit card to get started.</p>
                        </div>
                      )}
                      
                      <div className="mt-6">
                        <button
                          onClick={() => setIsAddingNew(true)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add New Card
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {savedUpiIds.length > 0 ? (
                        <div className="space-y-4">
                          {savedUpiIds.map(upi => (
                            <div key={upi.id} className="border rounded-lg p-4 flex items-center justify-between">
                              <div className="flex items-center">
                                {getUpiIcon(upi.upiId)}
                                <div className="ml-4">
                                  <div className="flex items-center">
                                    <p className="font-medium">{upi.nickname}</p>
                                    {upi.isDefault && (
                                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                                        Default
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-500">{upi.upiId}</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                {!upi.isDefault && (
                                  <button
                                    onClick={() => handleSetDefaultUpi(upi.id)}
                                    className="text-sm text-blue-600 hover:text-blue-800 mr-4"
                                  >
                                    Set as default
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteUpi(upi.id)}
                                  className="text-sm text-red-600 hover:text-red-800"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No UPI IDs saved</h3>
                          <p className="mt-1 text-sm text-gray-500">Add a UPI ID to make quick payments.</p>
                        </div>
                      )}
                      
                      <div className="mt-6">
                        <button
                          onClick={() => setIsAddingNew(true)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add New UPI ID
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentMethods;