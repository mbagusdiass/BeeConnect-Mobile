import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const IP_ADDRESS = 'https://beeconnect-backend.onrender.com/'; 

export const BASE_URL = `${IP_ADDRESS}api`;
export const BASE_URL_PICS = `${IP_ADDRESS}`;

const apiClient = axios.create({
  baseURL: BASE_URL, 
  timeout: 10000,
});
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;