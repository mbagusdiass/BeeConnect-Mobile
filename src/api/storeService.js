import apiClient from '../api/apiClient';

export const getMyStore = async () => {
  const response = await apiClient.get('/stores/me');
  return response.data;
};

export const createStore = async (storeData) => {
  const response = await apiClient.post('/stores/create', storeData);
  return response.data;
};

export const updateStoreData = async (data) => {
  const response = await apiClient.put('/stores/update', data);
  return response.data;
};

export const uploadStoreImage = async (imageUri) => {
  const formData = new FormData();
  const fileName = imageUri.split('/').pop();
  const match = /\.(\w+)$/.exec(fileName);
  const type = match ? `image/${match[1]}` : `image`;

  formData.append('store_image', {
    uri: imageUri,
    name: fileName,
    type: type,
  });

  const response = await apiClient.post('/stores/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};