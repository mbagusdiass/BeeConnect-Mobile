import { Platform } from 'react-native';
import apiClient from './apiClient';

export const getMyProfile = async () => {
  const response = await apiClient.get('/users/profile'); 
  return response.data;
};

export const updateProfileFull = async (data) => {
  const formData = new FormData();
  if (data.phone_number) formData.append('phone_number', data.phone_number);
  if (data.password && data.password.length > 0) formData.append('password', data.password);
  if (data.name) formData.append('name', data.name);
  if (data.profile_picture && !data.profile_picture.startsWith('http')) {
    const uri = data.profile_picture;
    const fileName = uri.split('/').pop();
    const fileType = fileName.split('.').pop();
    formData.append('profile_picture', {
      uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
      name: fileName,
      type: `image/${fileType === 'jpg' ? 'jpeg' : fileType}`,
    });
  }

  const response = await apiClient.put('/users/update-profile-full', formData, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    transformRequest: (data, headers) => {
      return data;
    },
  });
  
  return response.data;
};