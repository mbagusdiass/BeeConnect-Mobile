import React, { useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, 
  TouchableOpacity, ActivityIndicator, SafeAreaView, Alert, RefreshControl, Platform 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getSellerSalesHistory } from '../api/historyService';
import { BASE_URL_PICS } from '../api/apiClient';

const SellerOrderScreen = ({ navigation }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await getSellerSalesHistory();
      if (response && response.success) {
        setSales(response.data);
      }
    } catch (err) {
      console.error("Gagal ambil riwayat penjualan:", err);
      Alert.alert("Error", "Gagal mengambil data pesanan.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

 const renderSaleItem = ({ item }) => {
    const transactionObject = item.transaction_id;
    
    const transactionIdForAPI = transactionObject?._id;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.orderIdContainer}>
            <Ionicons name="receipt-outline" size={14} color="#666" />
            <Text style={styles.orderIdText}>
              {transactionObject?.order_id || 'ID Transaksi'}
            </Text>
          </View>
          <Text style={styles.dateText}>
            {item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID') : '-'}
          </Text>
        </View>

        <View style={styles.productSection}>
          <Image 
            source={{ uri: `${BASE_URL_PICS}${item.product_id?.product_image}` }} 
            style={styles.productImg} 
          />
          <View style={styles.productDetail}>
            <Text style={styles.productName} numberOfLines={1}>
              {item.product_name_snapshot || item.product_id?.product_name || 'Produk'}
            </Text>
            <Text style={styles.qtyText}>
                {item.quantity} x Rp {(item.price_snapshot || 0).toLocaleString()}
            </Text>
          </View>
          <View style={styles.subtotalContainer}>
            <Text style={styles.subtotalLabel}>Subtotal</Text>
            <Text style={styles.subtotalValue}>Rp {(item.subtotal || 0).toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.statusBadge}>
            <Ionicons name="checkmark-circle" size={12} color="#4CAF50" />
            <Text style={styles.statusText}>LUNAS</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.btnAction}
            onPress={() => {
              if (transactionIdForAPI) {
                navigation.navigate('TransactionDetail', { 
                  transactionId: transactionIdForAPI, 
                  orderId: transactionObject?.order_id || 'N/A',
                  totalPrice: transactionObject?.total_price || 0 
                });
              } else {
                Alert.alert("Data Error", "ID Transaksi tidak ditemukan.");
              }
            }}
          >
            <Text style={styles.btnActionText}>Detail Pesanan</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pesanan Masuk</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={{ marginTop: 10, color: '#666' }}>Memuat pesanan...</Text>
        </View>
      ) : (
        <FlatList
          data={sales}
          keyExtractor={(item) => item._id}
          renderItem={renderSaleItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="cart-outline" size={80} color="#ddd" />
              <Text style={styles.emptyText}>Belum ada pesanan yang masuk.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 15, 
    backgroundColor: '#fff',
    elevation: 2,
    paddingTop: Platform.OS === 'android' ? 40 : 15
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  listContent: { padding: 15, paddingBottom: 30 },
  centerLoading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    borderBottomWidth: 1, 
    borderBottomColor: '#F0F0F0',
    paddingBottom: 10,
    marginBottom: 12
  },
  orderIdContainer: { flexDirection: 'row', alignItems: 'center' },
  orderIdText: { fontSize: 12, fontWeight: '600', color: '#666', marginLeft: 5 },
  dateText: { fontSize: 11, color: '#999' },
  productSection: { flexDirection: 'row', alignItems: 'center' },
  productImg: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#F9F9F9' },
  productDetail: { flex: 1, marginLeft: 12 },
  productName: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  qtyText: { fontSize: 13, color: '#777', marginTop: 4 },
  subtotalContainer: { alignItems: 'flex-end' },
  subtotalLabel: { fontSize: 10, color: '#999' },
  subtotalValue: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  cardFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0'
  },
  statusBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#E8F5E9', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 6 
  },
  statusText: { fontSize: 10, fontWeight: 'bold', color: '#4CAF50', marginLeft: 4 },
  btnAction: { backgroundColor: '#000', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  btnActionText: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
  emptyBox: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#AAA', marginTop: 10, textAlign: 'center' }
});

export default SellerOrderScreen;