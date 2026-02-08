import React, { useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  ActivityIndicator, Image, Platform, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getMyStore } from '../api/storeService';
import { BASE_URL_PICS } from '../api/apiClient';

const StoreDashboard = ({ navigation }) => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasStore, setHasStore] = useState(false);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      const data = await getMyStore();
      setStore(data);
      setHasStore(true);
    } catch (err) {
      setHasStore(false);
      console.log("Belum punya toko atau error:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStoreData();
    }, [])
  );

  if (loading) return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#4F46E5" />
    </View>
  );

  if (!hasStore) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="storefront-outline" size={100} color="#ccc" />
        <Text style={styles.noStoreText}>Kamu belum memiliki toko</Text>
        <TouchableOpacity 
          style={styles.btnCreate}
          onPress={() => navigation.navigate('CreateStore')}
        >
          <Text style={styles.btnCreateText}>Buka Toko Sekarang</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const protectedNavigation = (screenName) => {
    if (!store?.is_active) {
      Alert.alert(
        "Toko Non-Aktif", 
        "Aksi ini dibatasi karena toko kamu sedang dinonaktifkan oleh Admin."
      );
    } else {
      navigation.navigate(screenName);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard Toko</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditStore', { store })}>
            <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.storeCard}>
          <View style={styles.imageWrapper}>
            <Image 
              source={{ uri: store?.store_image ? `${BASE_URL_PICS}${store.store_image}?t=${new Date().getTime()}` : 'https://via.placeholder.com/150' }} 
              style={styles.storeImage} 
            />
            <View style={[styles.statusDot, { backgroundColor: store?.is_active ? '#22C55E' : '#EF4444' }]} />
          </View>

          <Text style={styles.storeName}>{store?.store_name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: store?.is_active ? '#DCFCE7' : '#FEE2E2' }]}>
            <Text style={[styles.statusText, { color: store?.is_active ? '#166534' : '#991B1B' }]}>
              {store?.is_active ? 'Toko Aktif' : 'Toko Non-Aktif'}
            </Text>
          </View>

          <Text style={styles.storeDesc}>{store?.store_description || "Belum ada deskripsi toko."}</Text>
        </View>

        {!store?.is_active && (
          <View style={styles.warningBox}>
            <Ionicons name="warning" size={20} color="#92400E" />
            <Text style={styles.warningText}>
              Toko dinonaktifkan Admin. Kamu tidak dapat menambah produk atau memproses pesanan baru.
            </Text>
          </View>
        )}

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{store?.productCount || 0}</Text>
            <Text style={styles.statLabel}>Produk</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{store?.salesCount || 0}</Text>
            <Text style={styles.statLabel}>Terjual</Text>
          </View>
        </View>

        <View style={styles.menuGrid}>
          <TouchableOpacity 
            style={styles.menuBox}
            onPress={() => navigation.navigate('ManageProducts')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="list-outline" size={24} color="#0284C7" />
            </View>
            <Text style={styles.menuLabelText}>Kelola Produk</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuBox, !store?.is_active && { opacity: 0.6 }]}
            onPress={() => protectedNavigation('AddProduct')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="add-circle-outline" size={24} color="#166534" />
            </View>
            <Text style={styles.menuLabelText}>Tambah Produk</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.btnOrderHistory}
          onPress={() => navigation.navigate('SellerOrders')}
        >
          <Ionicons name="receipt-outline" size={20} color="#475569" />
          <Text style={styles.btnOrderText}>Lihat Pesanan Masuk</Text>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 45, 
    paddingBottom: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' 
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  
  storeCard: { 
    alignItems: 'center', padding: 20, backgroundColor: '#fff', borderRadius: 20, 
    marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 
  },
  imageWrapper: { position: 'relative' },
  storeImage: { width: 85, height: 85, borderRadius: 20, backgroundColor: '#F1F5F9' },
  statusDot: { 
    position: 'absolute', bottom: -2, right: -2, width: 20, height: 20, 
    borderRadius: 10, borderWidth: 3, borderColor: '#fff' 
  },
  storeName: { fontSize: 20, fontWeight: '800', marginTop: 15, color: '#1E293B' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 8 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  storeDesc: { color: '#64748B', textAlign: 'center', marginTop: 10, fontSize: 13 },

  warningBox: { 
    flexDirection: 'row', backgroundColor: '#FEF3C7', padding: 15, 
    borderRadius: 12, marginBottom: 20, alignItems: 'center', borderWidth: 1, borderColor: '#FDE68A' 
  },
  warningText: { flex: 1, color: '#92400E', fontSize: 12, marginLeft: 10, fontWeight: '500' },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statBox: { 
    flex: 1, alignItems: 'center', padding: 15, backgroundColor: '#fff', 
    borderRadius: 16, marginHorizontal: 5, elevation: 1 
  },
  statNum: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  statLabel: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
  
  menuGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  menuBox: { 
    flex: 0.48, backgroundColor: '#fff', paddingVertical: 20, 
    borderRadius: 16, alignItems: 'center', elevation: 1 
  },
  iconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  menuLabelText: { fontSize: 13, fontWeight: '700', color: '#334155' },

  btnOrderHistory: { 
    flexDirection: 'row', alignItems: 'center', padding: 18, 
    backgroundColor: '#fff', borderRadius: 16, elevation: 1, marginTop: 5 
  },
  btnOrderText: { flex: 1, marginLeft: 12, fontSize: 14, fontWeight: '600', color: '#334155' },

  noStoreText: { fontSize: 16, color: '#64748B', marginVertical: 20 },
  btnCreate: { backgroundColor: '#1E293B', paddingHorizontal: 35, paddingVertical: 14, borderRadius: 12 },
  btnCreateText: { color: '#fff', fontWeight: 'bold' }
});

export default StoreDashboard;