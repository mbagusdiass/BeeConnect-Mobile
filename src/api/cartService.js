import apiClient from './apiClient';

export const addToCart = async (product_id, quantity = 1) => {
  const response = await apiClient.post('/cart/add', { product_id, quantity });
  return response.data;
};

export const getCart = async () => {
  const response = await apiClient.get('/cart');
  return response.data;
};

export const removeFromCart = async (productId) => {
  const response = await apiClient.delete(`/cart/remove/${productId}`);
  return response.data;
};

export const processCheckout = async () => {
  const response = await apiClient.post('/transactions/checkout');
  return response.data; 
};

export const getTransactionHistory = async () => {
  const response = await apiClient.get('/transactions/history/buyer'); 
  return response.data;
};

export const getTransactionDetail = async (id) => {
  const response = await apiClient.get(`/transactions/history/detail/${id}`);
  return response.data; 
};