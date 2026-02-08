import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { getBuyerPurchaseHistory } from '../api/historyService';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const HistoryScreen = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await getBuyerPurchaseHistory();
      if (res.success) setHistory(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchHistory(); }, []));

  const getStatusLabel = (status) => {
    switch (status) {
      case 'settlement': return { text: 'Selesai', color: '#27ae60', bg: '#eafaf1' };
      case 'pending': return { text: 'Menunggu', color: '#f39c12', bg: '#fef9e7' };
      default: return { text: 'Batal', color: '#e74c3c', bg: '#fdedec' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pesanan Saya</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchHistory(); }} />}
        renderItem={({ item }) => {
          const status = getStatusLabel(item.payment_status);
          return (
            <TouchableOpacity 
              style={styles.card}
              onPress={() => navigation.navigate('TransactionDetail', { 
                transactionId: item._id, 
                orderId: item.order_id, 
                totalPrice: item.total_price 
              })}
            >
              <View style={styles.cardTop}>
                <Text style={styles.orderId}>{item.order_id}</Text>
                <View style={[styles.badge, { backgroundColor: status.bg }]}>
                  <Text style={[styles.badgeText, { color: status.color }]}>{status.text}</Text>
                </View>
              </View>
              <View style={styles.cardBottom}>
                <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString('id-ID')}</Text>
                <Text style={styles.price}>Rp {item.total_price.toLocaleString()}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  headerTitle: { fontSize: 16, fontWeight: 'bold' },
  card: { padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#eee', marginBottom: 15 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  orderId: { fontWeight: 'bold', fontSize: 13 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: 'bold' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { fontSize: 12, color: 'gray' },
  price: { fontWeight: 'bold', fontSize: 15 }
});

export default HistoryScreen;