import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getCart, removeFromCart, processCheckout } from '../api/cartService';
import { BASE_URL } from '../api/apiClient';
import { Ionicons } from '@expo/vector-icons';

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCartItems(data.items || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    await removeFromCart(id);
    fetchCart(); 
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product_id.price * item.quantity), 0);
  };

const handleCheckout = async () => {
  try {
    const res = await processCheckout();
    
    if (res.snap_token) {
      navigation.navigate('Checkout', { 
        snapToken: res.snap_token 
      });
    } else {
      alert("Gagal mendapatkan token pembayaran");
    }
  } catch (err) {
    console.error(err);
    alert("Checkout gagal: " + (err.response?.data?.message || err.message));
  }
};
  if (loading) return <ActivityIndicator style={{flex:1}} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Keranjang Belanja</Text>
        <View style={{width: 24}} />
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.product_id._id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: `${BASE_URL}${item.product_id.product_image}` }} style={styles.prodImg} />
            <View style={styles.info}>
              <Text style={styles.storeName}>{item.product_id.store_id?.store_name}</Text>
              <Text style={styles.prodName}>{item.product_id.product_name}</Text>
              <Text style={styles.price}>Rp {item.product_id.price.toLocaleString()}</Text>
              <Text style={styles.qty}>Jumlah: {item.quantity}</Text>
            </View>
            <TouchableOpacity onPress={() => handleRemove(item.product_id._id)}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>Total Pembayaran</Text>
          <Text style={styles.totalPrice}>Rp {calculateTotal().toLocaleString()}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.btnCheckout, cartItems.length === 0 && { backgroundColor: '#ccc' }]} 
          onPress={handleCheckout}
          disabled={cartItems.length === 0}
        >
          <Text style={styles.btnText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  cartItem: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#f5f5f5', alignItems: 'center' },
  prodImg: { width: 80, height: 80, borderRadius: 10, backgroundColor: '#f0f0f0' },
  info: { flex: 1, marginLeft: 15 },
  storeName: { fontSize: 10, color: 'gray', fontWeight: 'bold' },
  prodName: { fontSize: 15, fontWeight: '600', marginVertical: 3 },
  price: { fontSize: 14, fontWeight: 'bold' },
  qty: { fontSize: 12, color: 'gray' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderTopWidth: 1, borderTopColor: '#eee', paddingBottom: 40 },
  totalLabel: { fontSize: 12, color: 'gray' },
  totalPrice: { fontSize: 18, fontWeight: 'bold' },
  btnCheckout: { backgroundColor: '#000', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 10, justifyContent: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});

export default CartScreen;