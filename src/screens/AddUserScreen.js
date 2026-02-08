import React, { useState } from 'react';
import { 
  View, Text, TextInput, StyleSheet, TouchableOpacity, 
  SafeAreaView, Alert, ActivityIndicator, ScrollView, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../api/apiClient';

const AddUserScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    const { name, email, password, role } = form;
    if (!name || !email || !password) {
      return Alert.alert("Error", "Nama, Email, dan Password wajib diisi!");
    }

    try {
      setLoading(true);
      await apiClient.post('/auth/register', form);
      Alert.alert("Sukses", "User baru berhasil dibuat!");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Gagal membuat user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tambah User Baru</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.formContent}>
        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Masukkan nama..." 
          value={form.name}
          onChangeText={(val) => setForm({...form, name: val})}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input} 
          placeholder="email@example.com" 
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(val) => setForm({...form, email: val})}
        />

        <Text style={styles.label}>Nomor Telepon</Text>
        <TextInput 
          style={styles.input} 
          placeholder="08123xxx" 
          keyboardType="phone-pad"
          value={form.phone_number}
          onChangeText={(val) => setForm({...form, phone_number: val})}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Minimal 6 karakter" 
          secureTextEntry
          value={form.password}
          onChangeText={(val) => setForm({...form, password: val})}
        />

        <Text style={styles.label}>Pilih Role User</Text>
        <View style={styles.roleGrid}>
          {['user', 'seller', 'admin'].map((r) => (
            <TouchableOpacity 
              key={r} 
              style={[styles.roleBtn, form.role === r && styles.roleBtnActive]}
              onPress={() => setForm({...form, role: r})}
            >
              <Text style={[styles.roleBtnText, form.role === r && styles.roleBtnTextActive]}>
                {r.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.submitBtn} 
          onPress={handleAdd}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Simpan User</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 45 : 10, 
    paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' 
  },
  headerTitle: { fontSize: 16, fontWeight: 'bold' },
  formContent: { padding: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: '#F9FAFB', padding: 15, borderRadius: 10, marginBottom: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  roleGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  roleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10, backgroundColor: '#F3F4F6', marginHorizontal: 4, borderWidth: 1, borderColor: '#E5E7EB' },
  roleBtnActive: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  roleBtnText: { fontSize: 12, fontWeight: 'bold', color: '#6B7280' },
  roleBtnTextActive: { color: '#fff' },
  submitBtn: { backgroundColor: '#000', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default AddUserScreen;