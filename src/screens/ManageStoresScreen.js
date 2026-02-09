import React, { useState, useCallback } from 'react';
import { 
  View, Text, FlatList, StyleSheet, TouchableOpacity, 
  RefreshControl, ActivityIndicator, Alert, SafeAreaView, Image, Platform, Switch, TextInput 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import apiClient, { BASE_URL_PICS } from '../api/apiClient';

const ManageStoresScreen = ({ navigation }) => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStores = async () => {
    try {
      const response = await apiClient.get('/admin/stores'); 
      setStores(response.data);
      setFilteredStores(response.data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Gagal memuat daftar toko.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchStores(); }, []));

  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const filtered = stores.filter(item => 
        item.store_name.toLowerCase().includes(text.toLowerCase()) ||
        item.user_id?.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredStores(filtered);
    } else {
      setFilteredStores(stores);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await apiClient.put(`/admin/stores/${id}/status`, { is_active: newStatus });
      
      const updated = stores.map(s => s._id === id ? { ...s, is_active: newStatus } : s);
      setStores(updated);
      setFilteredStores(updated);
    } catch (err) {
      Alert.alert("Error", "Gagal mengubah status toko.");
    }
  };

  const handleDeleteStore = (id, name) => {
    Alert.alert("Hapus Toko", `Yakin ingin menghapus toko ${name}?`, [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: async () => {
          try {
            await apiClient.delete(`/admin/stores/${id}`);
            const remaining = stores.filter(s => s._id !== id);
            setStores(remaining);
            setFilteredStores(remaining);
          } catch (err) {
            Alert.alert("Error", "Gagal menghapus toko.");
          }
        }
      }
    ]);
  };

  const renderStoreItem = ({ item }) => (
    <View style={styles.card}>
      <Image 
        source={{ uri: item.store_image ? `${BASE_URL_PICS}${item.store_image}` : 'https://via.placeholder.com/150' }} 
        style={styles.storeImage} 
      />
      <View style={styles.storeInfo}>
        <Text style={styles.storeName}>{item.store_name}</Text>
        <Text style={styles.storeOwner}>Pemilik: {item.user_id?.name || 'N/A'}</Text>
        
        <View style={styles.switchContainer}>
          <Switch
            trackColor={{ false: "#CBD5E1", true: "#A5B4FC" }}
            thumbColor={item.is_active ? "#4F46E5" : "#F1F5F9"}
            onValueChange={() => handleToggleActive(item._id, item.is_active)}
            value={item.is_active}
          />
          <Text style={[styles.statusLabel, { color: item.is_active ? '#059669' : '#DC2626' }]}>
            {item.is_active ? 'AKTIF' : 'NON-AKTIF'}
          </Text>
        </View>
      </View>

      <View style={styles.actionColumn}>
        <TouchableOpacity 
          onPress={() => handleDeleteStore(item._id, item.store_name)} 
          style={styles.deleteBtn}
        >
          <Ionicons name="trash" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manajemen Toko</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddStore')} style={styles.addIcon}>
          <Ionicons name="add-circle" size={30} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#94A3B8" style={{ marginLeft: 10 }} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Cari toko atau pemilik..."
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredStores}
          keyExtractor={item => item._id}
          renderItem={renderStoreItem}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchStores(); }} />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Toko tidak ditemukan.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 45 : 10, 
    paddingBottom: 15, backgroundColor: '#fff' 
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  addIcon: { padding: 2 },
  searchContainer: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', 
    margin: 20, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' 
  },
  searchInput: { flex: 1, padding: 12, fontSize: 14, color: '#1E293B' },
  card: { 
    flexDirection: 'row', padding: 15, backgroundColor: '#fff', 
    borderRadius: 16, marginBottom: 15, alignItems: 'center',
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2
  },
  storeImage: { width: 70, height: 70, borderRadius: 12, backgroundColor: '#F1F5F9' },
  storeInfo: { flex: 1, marginLeft: 15 },
  storeName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  storeOwner: { fontSize: 13, color: '#64748B', marginTop: 3 },
  switchContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  statusLabel: { fontSize: 11, fontWeight: '900', marginLeft: 8 },
  actionColumn: { alignItems: 'center', justifyContent: 'space-around' },
  editBtn: { padding: 8, backgroundColor: '#EEF2FF', borderRadius: 10, marginBottom: 8 },
  deleteBtn: { padding: 8, backgroundColor: '#FEF2F2', borderRadius: 10 },
  emptyBox: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#94A3B8', fontSize: 14 }
});

export default ManageStoresScreen;