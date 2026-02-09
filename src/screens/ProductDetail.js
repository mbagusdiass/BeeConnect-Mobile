import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BASE_URL } from '../api/apiClient';
import { addToCart } from '../api/cartService';

const ProductDetail = ({ route, navigation }) => {
  const { product } = route.params;
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart(product._id, 1);
      
      Alert.alert(
        "Berhasil", 
        "Produk telah ditambahkan ke keranjang.",
        [
          { text: "Lanjut Belanja", style: "cancel" },
          { text: "Lihat Keranjang", onPress: () => navigation.navigate('Cart') }
        ]
      );
    } catch (err) {
      console.error(err);
      Alert.alert("Gagal", "Tidak bisa menambahkan ke keranjang. Coba lagi nanti.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.backBtn}>
          <Ionicons name="cart-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image 
          source={{ uri: product.product_image ? `${BASE_URL}${product.product_image}` : 'https://via.placeholder.com/400' }} 
          style={styles.image} 
        />

        <View style={styles.infoContainer}>
          <Text style={styles.storeName}>{product.store_id?.store_name || "BeeConnect Store"}</Text>
          <Text style={styles.productName}>{product.product_name}</Text>
          <Text style={styles.productPrice}>Rp {product.price?.toLocaleString('id-ID')}</Text>

          <View style={styles.line} />

          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text style={styles.description}>
            {product.description || "Penjual tidak memberikan deskripsi untuk produk ini."}
          </Text>

          <View style={styles.specRow}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Stok</Text>
              <Text style={styles.specValue}>{product.stock} pcs</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Berat</Text>
              <Text style={styles.specValue}>{product.weight} gr</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Kategori</Text>
              <Text style={styles.specValue}>{product.category?.category_name || "Umum"}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.btnCart} 
          onPress={handleAddToCart}
          disabled={adding}
        >
          {adding ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Ionicons name="cart-outline" size={20} color="black" />
              <Text style={styles.btnCartText}>+ Keranjang</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.btnBuy}
          onPress={() => navigation.navigate('Cart')} 
        >
          <Text style={styles.btnBuyText}>Beli Sekarang</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: 50, 
    position: 'absolute', 
    top: 0, left: 0, right: 0, 
    zIndex: 10 
  },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.8)', padding: 10, borderRadius: 25 },
  image: { width: '100%', height: 400, backgroundColor: '#f9f9f9' },
  infoContainer: { 
    padding: 25, 
    backgroundColor: '#fff', 
    marginTop: -30, 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30 
  },
  storeName: { fontSize: 12, fontWeight: 'bold', color: '#888', textTransform: 'uppercase' },
  productName: { fontSize: 24, fontWeight: 'bold', marginVertical: 8 },
  productPrice: { fontSize: 20, fontWeight: '900', color: '#000' },
  line: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  description: { fontSize: 14, color: '#666', lineHeight: 22 },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 },
  specItem: { flex: 1, alignItems: 'center', backgroundColor: '#f8f8f8', padding: 10, borderRadius: 10, marginHorizontal: 5 },
  specLabel: { fontSize: 10, color: '#999', marginBottom: 4 },
  specValue: { fontSize: 13, fontWeight: 'bold' },
  footer: { 
    flexDirection: 'row', 
    padding: 20, 
    paddingBottom: 35, 
    borderTopWidth: 1, 
    borderTopColor: '#eee', 
    alignItems: 'center' 
  },
  btnCart: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#000', 
    marginRight: 10 
  },
  btnCartText: { marginLeft: 8, fontWeight: 'bold' },
  btnBuy: { 
    flex: 1, 
    backgroundColor: '#000', 
    padding: 15, 
    borderRadius: 12, 
    alignItems: 'center' 
  },
  btnBuyText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default ProductDetail;