import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/apiClient';
import LogRocket from '@logrocket/react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('userToken');
        const savedUser = await AsyncStorage.getItem('userData');

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          LogRocket.identify(parsedUser._id, {
            name: parsedUser.name,
            email: parsedUser.email,
            role: parsedUser.role,
          });
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        }
      } catch (e) {
        console.error("Gagal memuat data dari AsyncStorage:", e);
      } finally {
        setLoading(false);
      }
    };

    loadStorageData();
  }, []);

const login = async (userData, userToken) => {
  try {
    setUser(userData);
    setToken(userToken);
    await AsyncStorage.setItem('userToken', userToken);
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    LogRocket.identify(userData._id, {
            name: userData.name,
            email: userData.email,
            role: userData.role, 
          });
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
  } catch (e) {
    console.error("Login Context Error:", e);
  }
};
  const logout = async () => {
    try {
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      
      delete apiClient.defaults.headers.common['Authorization'];
    } catch (e) {
      console.error("Gagal logout:", e);
    }
  };
  const updateUserInfo = async (newUserData) => {
    try {
      setUser(newUserData);
      await AsyncStorage.setItem('userData', JSON.stringify(newUserData));
      console.log("Context: User data updated successfully.");
    } catch (e) {
      console.error("Context Update Error:", e);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        loading, 
        login, 
        logout, 
        setUser: updateUserInfo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};