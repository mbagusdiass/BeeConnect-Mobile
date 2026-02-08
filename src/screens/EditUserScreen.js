import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  SafeAreaView, Alert, ActivityIndicator, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../api/apiClient';

const EditUserScreen = ({ route, navigation }) => {
  const { user } = route.params;

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!name || !email) {
      return Alert.alert("Error", "Nama dan Email tidak boleh kosong");
    }

    try {
      setLoading(true);
      const response = await apiClient.put(`/admin/users/${user._id}`, {
        name,
        email,
        role
      });

      if (response.data) {
        Alert.alert("Sukses", "Data user berhasil diperbarui", [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Gagal memperbarui data user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit User</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput 
          style={styles.input} 
          value={name} 
          onChangeText={setName} 
          placeholder="Masukkan nama"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input} 
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address"
          placeholder="Masukkan email"
        />

        <Text style={styles.label}>Role</Text>
        <View style={styles.roleContainer}>
          {['user', 'seller', 'admin'].map((r) => (
            <TouchableOpacity 
              key={r}
              style={[styles.roleOption, role === r && styles.roleSelected]}
              onPress={() => setRole(r)}
            >
              <Text style={[styles.roleText, role === r && styles.roleTextSelected]}>
                {r.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.btnSave} 
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnSaveText}>Simpan Perubahan</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f5f5f5',
    marginTop: Platform.OS === 'android' ? 30 : 0
  },
  headerTitle: { fontSize: 16, fontWeight: 'bold' },
  content: { padding: 25 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { 
    backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', 
    borderRadius: 12, padding: 15, marginBottom: 20, fontSize: 15 
  },
  roleContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  roleOption: { 
    flex: 1, paddingVertical: 10, alignItems: 'center', 
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, marginHorizontal: 4 
  },
  roleSelected: { backgroundColor: '#000', borderColor: '#000' },
  roleText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  roleTextSelected: { color: '#fff' },
  btnSave: { 
    backgroundColor: '#000', padding: 18, borderRadius: 14, 
    alignItems: 'center', marginTop: 10 
  },
  btnSaveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default EditUserScreen;