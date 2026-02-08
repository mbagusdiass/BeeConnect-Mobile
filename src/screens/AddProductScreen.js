import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  Image, Alert, ActivityIndicator, ScrollView, SafeAreaView, Platform 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { addProduct, getCategories } from '../api/productService';

const AddProductScreen = ({ navigation }) => {
  const [product_name, setProduct_name] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [product_image, setProduct_image] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.log("Gagal muat kategori:", err);
      }
    };
    fetchCats();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProduct_image(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!product_name || !price || !stock || !product_image || !selectedCategory) {
      Alert.alert("Data Belum Lengkap", "Harap isi semua data dan pilih foto.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('product_name', product_name);
      formData.append('price', price);
      formData.append('stock', stock);
      formData.append('description', description);
      formData.append('category', selectedCategory);
      formData.append('weight', '500');

      // PERBAIKAN FILE UPLOAD
      const uriParts = product_image.split('.');
      const fileType = uriParts[uriParts.length - 1];
      const fileName = `photo-${Date.now()}.${fileType}`;

      formData.append('product_image', {
        uri: product_image,
        name: fileName,
        type: `image/${fileType}`,
      });

      await addProduct(formData);

      Alert.alert("Sukses", "Produk berhasil ditambahkan!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      console.error("Error Detail:", err.response?.data || err.message);
      Alert.alert("Gagal", err.response?.data?.message || "Terjadi kesalahan backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tambah Produk</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
          {product_image ? (
            <Image source={{ uri: product_image }} style={styles.previewImg} />
          ) : (
            <View style={styles.placeholderImg}>
              <Ionicons name="camera-outline" size={40} color="#ccc" />
              <Text style={styles.placeholderText}>Klik untuk Upload</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.form}>
          <Text style={styles.label}>Nama Produk</Text>
          <TextInput 
            style={styles.input} 
            value={product_name}
            onChangeText={setProduct_name}
            placeholder="Masukkan nama produk"
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>Harga</Text>
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
          <View style={styles.catWrapper}>
            {categories.map((cat) => (
              <TouchableOpacity 
                key={cat._id}
                style={[styles.catChip, selectedCategory === cat._id && styles.catChipActive]}
                onPress={() => setSelectedCategory(cat._id)}
              >
                <Text style={[styles.catText, selectedCategory === cat._id && styles.catTextActive]}>
                  {cat.category_name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Deskripsi</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            multiline
            value={description}
            onChangeText={setDescription}
            placeholder="Tulis deskripsi produk..."
          />

          <TouchableOpacity 
            style={[styles.btnSubmit, loading && { backgroundColor: '#ccc' }]} 
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnSubmitText}>Posting Produk</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee', paddingTop: Platform.OS === 'android' ? 40 : 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  scrollContainer: { paddingBottom: 40 },
  imageBox: { width: '90%', height: 200, backgroundColor: '#f9f9f9', alignSelf: 'center', marginTop: 20, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc' },
  previewImg: { width: '100%', height: '100%', borderRadius: 15 },
  placeholderImg: { alignItems: 'center' },
  placeholderText: { color: '#aaa', marginTop: 10 },
  form: { padding: 20 },
  label: { fontWeight: 'bold', marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#eee' },
  row: { flexDirection: 'row' },
  catWrapper: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 },
  catChip: { padding: 10, backgroundColor: '#eee', borderRadius: 20, marginRight: 8, marginBottom: 8 },
  catChipActive: { backgroundColor: '#000' },
  catText: { fontSize: 12 },
  catTextActive: { color: '#fff' },
  textArea: { height: 100, textAlignVertical: 'top' },
  btnSubmit: { backgroundColor: '#000', padding: 18, borderRadius: 12, marginTop: 30, alignItems: 'center' },
  btnSubmitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default AddProductScreen;