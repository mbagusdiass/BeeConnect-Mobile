import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { getProducts, getCategories } from '../api/productService';
import Navbar from '../components/Navbar';
import { BASE_URL, BASE_URL_PICS } from '../api/apiClient';

const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
      setCategories(cats);
      setProducts(prods);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <Image source={{ uri: `${BASE_URL_PICS}${item.product_image}` }} style={styles.img} />
      <View style={styles.info}>
        <Text style={styles.store}>{item.store_id?.store_name || 'BeeConnect'}</Text>
        <Text style={styles.pName} numberOfLines={1}>{item.product_name}</Text>
        <Text style={styles.price}>Rp {item.price.toLocaleString('id-ID')}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator style={{flex:1}} size="large" color="#000" />;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Navbar navigation={navigation} />
      <ScrollView 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.secTitle}>Kategori</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {categories.map((cat) => (
            <TouchableOpacity key={cat._id} style={styles.catItem}>
              <View style={styles.catBox}>
                <Image source={{ uri: `${BASE_URL_PICS}${cat.category_image}` }} style={styles.catImg} />
              </View>
              <Text style={styles.catText}>{cat.category_name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.secTitle}>Produk Populer</Text>
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  secTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginTop: 20 },
  catScroll: { paddingLeft: 20, marginVertical: 15 },
  catItem: { marginRight: 20, alignItems: 'center' },
  catBox: { width: 55, height: 55, borderRadius: 15, backgroundColor: '#f9f9f9', overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
  catImg: { width: '100%', height: '100%' },
  catText: { fontSize: 11, marginTop: 5, color: '#333' },
  list: { paddingHorizontal: 10, paddingBottom: 20 },
  card: { flex: 1, margin: 8, backgroundColor: '#fff', borderRadius: 12, elevation: 2, overflow: 'hidden', borderWeight: 1, borderColor: '#f0f0f0' },
  img: { width: '100%', height: 160, backgroundColor: '#f0f0f0' },
  info: { padding: 10 },
  store: { fontSize: 10, color: 'gray', textTransform: 'uppercase' },
  pName: { fontSize: 14, fontWeight: 'bold', marginVertical: 2 },
  price: { fontSize: 14, fontWeight: '800', color: '#000' }
});

export default HomeScreen;