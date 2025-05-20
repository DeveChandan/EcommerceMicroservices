import axios from 'axios';
import mockProducts from '../mockData/products.json';

const USE_MOCK_DATA = false; // Set to false to use real backend

// Separate API instances for customer and product/order services
export const customerApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL_USER || 'http://localhost:8001',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL_PRODUCT || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to customer requests if available
customerApi.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Product API Calls
export const fetchProducts = async () => {
  if (USE_MOCK_DATA) {
    return mockProducts;
  }
  const response = await productApi.get('/products');
  return response.data;
};

export const fetchProductById = async (id: number) => {
  const response = await productApi.get(`/products/${id}`);
  return response.data;
};

// Order API Calls (use productApi if orders are handled by product-order-service)
export const createOrder = async (orderData: any) => {
  const response = await productApi.post('/orders', orderData);
  return response.data;
};

export const fetchOrderById = async (id: number) => {
  const response = await productApi.get(`/orders/${id}`);
  return response.data;
};

// Customer API Calls
export const registerCustomer = async (customerData: any) => {
  const response = await customerApi.post('/customers', customerData);
  return response.data;
};

export const loginCustomer = async (email: string, password: string) => {
  const response = await customerApi.post('/customers/login', { email, password });
  return response.data;
};

export const fetchCustomerById = async (id: number) => {
  const response = await customerApi.get(`/customers/${id}`);
  return response.data;
};

export const updateCustomer = async (id: number, customerData: any) => {
  const response = await customerApi.put(`/customers/${id}`, customerData);
  return response.data;
};

export const fetchCustomerOrders = async (customerId: number) => {
  const response = await customerApi.get(`/customers/${customerId}/orders`);
  return response.data;
};