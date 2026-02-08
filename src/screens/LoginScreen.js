import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import apiClient from '../api/apiClient';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

const handleLogin = async () => {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    
    if (response.data.token) {
      await login(response.data.user, response.data.token); 
      
      navigation.replace('Main');
    }
  } catch (error) {
    Alert.alert("Login Gagal", error.response?.data?.message || "Email atau password salah");
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BeeConnect</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Masuk</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: 20 }}>
        <Text style={{ textAlign: 'center' }}>Belum punya akun? <Text style={{ fontWeight: 'bold' }}>Daftar</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 40 },
  input: { borderWidth: 1, borderColor: '#eee', padding: 15, borderRadius: 10, marginBottom: 15, backgroundColor: '#f9f9f9' },
  btn: { backgroundColor: '#000', padding: 18, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});

export default LoginScreen;