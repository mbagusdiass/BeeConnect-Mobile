import React, { useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, 
  TouchableOpacity, Alert, ActivityIndicator, SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getMyProducts, deleteProduct } from '../api/productService';
import { BASE_URL, BASE_URL_PICS } from '../api/apiClient';

const ManageProductsScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getMyProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Gagal memuat daftar produk.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert("Hapus Produk", "Produk ini akan dihapus permanen. Lanjutkan?", [
      { text: "Batal", style: "cancel" },
      { 
        text: "Hapus", 
        style: "destructive", 
        onPress: async () => {
          try {
            await deleteProduct(id);
            fetchProducts(); 
          } catch (err) {
            Alert.alert("Gagal", "Terjadi kesalahan saat menghapus produk.");
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.productRow}>
      <Image 
        source={{ uri: `${BASE_URL_PICS}${item.product_image}` }} 
        style={styles.productImg} 
      />
      <View style={styles.productDetails}>
        <Text style={styles.productName} numberOfLines={1}>{item.product_name}</Text>
        <Text style={styles.productPrice}>Rp {item.price.toLocaleString('id-ID')}</Text>
        <View style={styles.stockBadge}>
          <Text style={styles.productStock}>Stok: {item.stock}</Text>
        </View>
      </View>
      <View style={styles.actionGroup}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('EditProduct', { product: item })}
          style={[styles.actionBtn, { backgroundColor: '#E3F2FD' }]}
        >
          <Ionicons name="pencil" size={18} color="#2196F3" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => handleDelete(item._id)}
          style={[styles.actionBtn, { backgroundColor: '#FFEBEE' }]}
        >
          <Ionicons name="trash" size={18} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kelola Produk</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('AddProduct')}
          style={styles.addBtn}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="cube-outline" size={80} color="#ddd" />
              <Text style={styles.emptyText}>Belum ada produk di tokomu.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#fff',
    elevation: 2
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  backBtn: { padding: 5 },
  addBtn: { backgroundColor: '#000', borderRadius: 10, padding: 8 },
  listContent: { padding: 15 },
  productRow: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    padding: 12, 
    borderRadius: 15, 
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3
  },
  productImg: { width: 70, height: 70, borderRadius: 10, backgroundColor: '#f0f0f0' },
  productDetails: { flex: 1, marginLeft: 15 },
  productName: { fontSize: 16, fontWeight: '600', color: '#333' },
  productPrice: { fontSize: 14, color: '#000', fontWeight: '700', marginTop: 4 },
  stockBadge: { backgroundColor: '#F1F3F5', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5, marginTop: 5 },
  productStock: { fontSize: 11, color: '#666' },
  actionGroup: { flexDirection: 'row' },
  actionBtn: { padding: 10, marginLeft: 8, borderRadius: 10 },
  emptyBox: { marginTop: 100, alignItems: 'center' },
  emptyText: { color: '#999', marginTop: 10 }
});

export default ManageProductsScreen;