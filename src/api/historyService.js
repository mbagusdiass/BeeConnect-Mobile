import apiClient from './apiClient';

export const getSellerSalesHistory = async () => {
  try {
    const response = await apiClient.get('/transactions/history/seller');
    return response.data; 
  } catch (error) {
    console.error("Error in getSellerSalesHistory:", error);
    throw error;
  }
};

export const getBuyerPurchaseHistory = async () => {
  try {
    const response = await apiClient.get('/transactions/history/buyer');
    return response.data;
  } catch (error) {
    console.error("Error in getBuyerPurchaseHistory:", error);
    throw error;
  }
};

export const getTransactionItemsDetail = async (id) => {
  try {
    const response = await apiClient.get(`/transactions/history/detail/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error in getTransactionItemsDetail:", error);
    throw error;
  }
};

export default {
  getSellerSalesHistory,
  getBuyerPurchaseHistory,
  getTransactionItemsDetail,
};