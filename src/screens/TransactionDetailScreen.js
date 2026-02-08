import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  SafeAreaView,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTransactionItemsDetail } from '../api/historyService';
import { BASE_URL, BASE_URL_PICS } from '../api/apiClient';

const TransactionDetailScreen = ({ route, navigation }) => {
  const { transactionId, orderId, totalPrice } = route.params;
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [transactionId]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await getTransactionItemsDetail(transactionId);
      
      if (res.success) {
        setDetails(res.data);
      } else {
        console.log("Gagal mengambil data:", res.message);
      }
    } catch (err) {
      console.error("Fetch Detail Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.productCard}>
      <Image 
        source={{ 
          uri: item.product_id?.product_image 
            ? `${BASE_URL_PICS}${item.product_id.product_image}` 
            : 'https://via.placeholder.com/150' 
        }} 
        style={styles.productImage} 
      />
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.product_name_snapshot || "Produk tidak tersedia"}
        </Text>
        <Text style={styles.productQty}>{item.quantity} x Rp {item.price_snapshot?.toLocaleString('id-ID')}</Text>
      </View>

      <View style={styles.subtotalBox}>
        <Text style={styles.subtotalValue}>Rp {item.subtotal?.toLocaleString('id-ID')}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10, color: '#666' }}>Memuat detail...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Transaksi</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={details}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
        ListHeaderComponent={
          <View style={styles.headerSection}>
            <View style={styles.orderRow}>
              <View>
                <Text style={styles.label}>Nomor Pesanan</Text>
                <Text style={styles.orderId}>{orderId}</Text>
              </View>
              <Ionicons name="receipt" size={30} color="#eee" />
            </View>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Rincian Produk</Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Pembayaran</Text>
              <Text style={styles.totalPrice}>Rp {totalPrice?.toLocaleString('id-ID')}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.btnHome}
              onPress={() => navigation.navigate('Main', { screen: 'Home' })}
            >
              <Text style={styles.btnHomeText}>Belanja Lagi</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={{ color: '#999' }}>Item tidak ditemukan.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    marginTop: Platform.OS === 'android' ? 30 : 0
  },
  headerTitle: { fontSize: 16, fontWeight: 'bold' },
  backBtn: { padding: 5 },
  headerSection: { marginBottom: 10 },
  orderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 12, color: '#888', marginBottom: 2 },
  orderId: { fontSize: 15, fontWeight: 'bold', color: '#000' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 15 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#000', marginBottom: 10 },
  productCard: { 
    flexDirection: 'row', 
    marginBottom: 15, 
    alignItems: 'center',
    backgroundColor: '#fff' 
  },
  productImage: { width: 60, height: 60, borderRadius: 10, backgroundColor: '#f9f9f9' },
  productInfo: { flex: 1, marginLeft: 15 },
  productName: { fontSize: 14, fontWeight: '600', color: '#333' },
  productQty: { fontSize: 12, color: '#888', marginTop: 4 },
  subtotalBox: { alignItems: 'flex-end' },
  subtotalValue: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  footer: { marginTop: 10, paddingBottom: 30 },
  totalRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 25 
  },
  totalLabel: { fontSize: 15, fontWeight: 'bold' },
  totalPrice: { fontSize: 20, fontWeight: '900', color: '#000' },
  btnHome: { 
    backgroundColor: '#000', 
    padding: 16, 
    borderRadius: 14, 
    alignItems: 'center' 
  },
  btnHomeText: { color: '#fff', fontWeight: 'bold', fontSize: 15 }
});

export default TransactionDetailScreen;