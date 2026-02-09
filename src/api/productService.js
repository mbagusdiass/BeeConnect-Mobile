import apiClient from './apiClient';

export const getProducts = async () => {
  try {
    const response = await apiClient.get('/products');
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil data produk:", error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await apiClient.get('/categories');
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil kategori:", error);
    throw error;
  }
};

export const getMyProducts = async () => {
  const response = await apiClient.get('/products/my-products');
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await apiClient.delete(`/products/${id}`);
  return response.data;
};

export const addProduct = async (formData) => {
    const response = await apiClient.post('/products/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
export const updateProduct = async (id, formData) => {
  const response = await apiClient.put(`/products/update/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};