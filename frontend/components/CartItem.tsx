import React from 'react';

type CartItemType = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, updateQuantity, removeFromCart }) => {
  const handleIncrementQuantity = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrementQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  return (
    <li className="border-b py-4 px-4">
      <div className="flex items-center">
        <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center mr-4">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-16 h-16 object-contain"
            />
          ) : (
            <div className="text-gray-500 text-xs">No image</div>
          )}
        </div>
        
        <div className="flex-grow">
          <h3 className="text-lg font-medium">{item.name}</h3>
          <p className="text-blue-600 font-bold">${item.price.toFixed(2)}</p>
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center border rounded mr-4">
            <button 
              onClick={handleDecrementQuantity}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
            >
              -
            </button>
            <span className="px-4 py-1">{item.quantity}</span>
            <button 
              onClick={handleIncrementQuantity}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
            >
              +
            </button>
          </div>
          
          <button 
            onClick={() => removeFromCart(item.id)}
            className="text-red-500 hover:text-red-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
