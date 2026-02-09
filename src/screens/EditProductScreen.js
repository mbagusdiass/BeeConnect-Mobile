import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  Image, Alert, ActivityIndicator, ScrollView, SafeAreaView, Platform 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { updateProduct, getCategories } from '../api/productService';
import { BASE_URL_PICS } from '../api/apiClient';

const EditProductScreen = ({ route, navigation }) => {
  const { product } = route.params; 

  const [product_name, setproduct_name] = useState(product?.product_name || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [stock, setStock] = useState(product?.stock?.toString() || '');
  const [description, setDescription] = useState(product?.description || '');
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(product?.category?._id || product?.category);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    if (!product_name || !price || !stock) {
      Alert.alert("Error", "Nama, harga, dan stok wajib diisi!");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', product_name);
      formData.append('price', price);
      formData.append('stock', stock);
      formData.append('description', description);
      formData.append('category', selectedCategory);

      if (image) {
        const fileName = image.split('/').pop();
        const match = /\.(\w+)$/.exec(fileName);
        const type = match ? `image/${match[1]}` : `image`;
        
        formData.append('product_image', {
          uri: image,
          name: fileName,
          type: type,
        });
      }

      await updateProduct(product._id, formData);

      Alert.alert("Sukses", "Produk berhasil diperbarui!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Gagal memperbarui produk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Produk</Text>
        <TouchableOpacity onPress={handleUpdate} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.saveText}>Update</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Image 
            source={{ 
              uri: image || `${BASE_URL_PICS}${product.product_image}` 
            }} 
            style={styles.previewImage} 
          />
          <View style={styles.editOverlay}>
            <Ionicons name="camera" size={20} color="#fff" />
            <Text style={styles.editText}>Ganti Foto</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.form}>
          <Text style={styles.label}>Nama Produk</Text>
          <TextInput 
            style={styles.input} 
            value={product_name} 
            onChangeText={setproduct_name} 
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>Harga (Rp)</Text>
              <TextInput 
                style={styles.input} 
                keyboardType="numeric"
                value={price} 
                onChangeText={setPrice} 
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Stok</Text>
              <TextInput 
                style={styles.input} 
                keyboardType="numeric"
                value={stock} 
                onChangeText={setStock} 
              />
            </View>
          </View>

          <Text style={styles.label}>Kategori</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
            {categories.map((cat) => (
              <TouchableOpacity 
                key={cat._id}
                style={[styles.chip, selectedCategory === cat._id && styles.chipSelected]}
                onPress={() => setSelectedCategory(cat._id)}
              >
                <Text style={[styles.chipText, selectedCategory === cat._id && styles.chipTextSelected]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Deskripsi</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            multiline
            numberOfLines={4}
            value={description} 
            onChangeText={setDescription} 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0',
    paddingTop: Platform.OS === 'android' ? 40 : 15 
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  saveText: { color: '#2196F3', fontWeight: 'bold', fontSize: 16 },
  content: { paddingBottom: 30 },
  imagePicker: { width: 140, height: 140, alignSelf: 'center', marginTop: 20, borderRadius: 15, overflow: 'hidden', backgroundColor: '#eee' },
  previewImage: { width: '100%', height: '100%' },
  editOverlay: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'rgba(0,0,0,0.5)', padding: 5, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  editText: { color: '#fff', fontSize: 10, marginLeft: 5 },
  form: { padding: 20 },
  row: { flexDirection: 'row' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginTop: 15, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#eee', borderRadius: 10, padding: 12, fontSize: 16, backgroundColor: '#fafafa' },
  textArea: { height: 100, textAlignVertical: 'top' },
  catScroll: { marginTop: 5 },
  chip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0', marginRight: 8 },
  chipSelected: { backgroundColor: '#000' },
  chipText: { fontSize: 13, color: '#666' },
  chipTextSelected: { color: '#fff', fontWeight: 'bold' }
});

export default EditProductScreen;