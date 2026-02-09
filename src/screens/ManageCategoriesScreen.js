import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, 
  Image, Alert, ActivityIndicator, SafeAreaView, Platform, Keyboard 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import apiClient, { BASE_URL_PICS } from '../api/apiClient';

const ManageCategoriesScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.log("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Izin Ditolak", "Kami butuh akses galeri untuk mengunggah foto.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
  if (!name) return Alert.alert("Error", "Nama kategori harus diisi!");
  if (!isEdit && !image) return Alert.alert("Error", "Pilih gambar untuk kategori baru!");

  const formData = new FormData();
  formData.append('category_name', name);

  if (image && image.uri) {
    const uri = image.uri;
    const fileType = uri.split('.').pop(); 
    const filename = `cat-${Date.now()}.${fileType}`;

    formData.append('category_image', {
      uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
      name: filename,
      type: `image/${fileType === 'jpg' ? 'jpeg' : fileType}`,
    });
  }

  try {
    setLoading(true);
    Keyboard.dismiss();
    const config = {
      headers: { 
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      }
    };

    if (isEdit) {
      await apiClient.put(`/admin/categories/${editId}`, formData, config);
      Alert.alert("Sukses", "Kategori berhasil diperbarui");
    } else {
      await apiClient.post('/admin/categories', formData, config);
      Alert.alert("Sukses", "Kategori berhasil ditambahkan");
    }

    resetForm();
    fetchCategories();
  } catch (err) {
    console.log("UPLOAD ERROR:", err.response?.data || err.message);
    
    const errorMsg = err.response?.data?.message || "Cek koneksi/server.";
    Alert.alert("Error", `Gagal menyimpan: ${errorMsg}`);
  } finally {
    setLoading(false);
  }
};

  const handleEditPress = (item) => {
    setIsEdit(true);
    setEditId(item._id);
    setName(item.category_name);
    setImage(item.category_image); 
  };

  const resetForm = () => {
    setIsEdit(false);
    setEditId(null);
    setName('');
    setImage(null);
  };

  const handleDelete = (id, catName) => {
    Alert.alert("Hapus Kategori", `Yakin ingin menghapus "${catName}"?`, [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: async () => {
          try {
            await apiClient.delete(`/admin/categories/${id}`);
            fetchCategories();
          } catch (err) {
            Alert.alert("Error", "Gagal menghapus kategori");
          }
      }}
    ]);
  };

  const renderImagePreview = () => {
    if (!image) return <Ionicons name="camera" size={30} color="#ccc" />;
    
    if (image.uri) return <Image source={{ uri: image.uri }} style={styles.preview} />;
    
    return <Image source={{ uri: `${BASE_URL_PICS}${image}` }} style={styles.preview} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kelola Kategori</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>{isEdit ? "Edit Kategori" : "Tambah Kategori Baru"}</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Contoh: Elektronik, Fashion..." 
          value={name} 
          onChangeText={setName} 
        />
        
        <View style={styles.row}>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {renderImagePreview()}
            <View style={styles.cameraOverlay}>
              <Ionicons name="pencil" size={12} color="white" />
            </View>
          </TouchableOpacity>

          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={[styles.btnAction, { backgroundColor: isEdit ? '#F59E0B' : '#000' }]} 
              onPress={handleSubmit} 
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : (
                <Text style={styles.btnText}>{isEdit ? "Update" : "Simpan"}</Text>
              )}
            </TouchableOpacity>

            {isEdit && (
              <TouchableOpacity style={styles.btnCancel} onPress={resetForm}>
                <Text style={styles.btnCancelText}>Batal</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <FlatList
        data={categories}
        keyExtractor={item => item._id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={styles.catItem}>
            <Image 
              source={{ uri: `${BASE_URL_PICS}${item.category_image}` }} 
              style={styles.catImg} 
            />
            <View style={styles.catInfo}>
              <Text style={styles.catName}>{item.category_name}</Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => handleEditPress(item)} style={styles.iconBtn}>
                <Ionicons name="create-outline" size={20} color="#4F46E5" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item._id, item.category_name)} style={styles.iconBtn}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 45 : 10, 
    paddingBottom: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' 
  },
  headerTitle: { fontSize: 16, fontWeight: 'bold' },
  formCard: { backgroundColor: '#fff', padding: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, elevation: 2, shadowOpacity: 0.1 },
  formTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: '#374151' },
  input: { backgroundColor: '#F3F4F6', padding: 12, borderRadius: 10, marginBottom: 15 },
  row: { flexDirection: 'row', alignItems: 'center' },
  imagePicker: { 
    width: 70, height: 70, backgroundColor: '#F3F4F6', borderRadius: 12, 
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' 
  },
  preview: { width: '100%', height: '100%' },
  cameraOverlay: { position: 'absolute', bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', padding: 4, borderTopLeftRadius: 8 },
  buttonGroup: { flex: 1, marginLeft: 15 },
  btnAction: { padding: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  btnCancel: { marginTop: 8, alignItems: 'center' },
  btnCancelText: { color: '#6B7280', fontSize: 12 },
  catItem: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', 
    padding: 12, borderRadius: 15, marginBottom: 10, elevation: 1 
  },
  catImg: { width: 50, height: 50, borderRadius: 10, backgroundColor: '#F3F4F6' },
  catInfo: { flex: 1, marginLeft: 15 },
  catName: { fontWeight: '600', fontSize: 15 },
  itemActions: { flexDirection: 'row' },
  iconBtn: { padding: 8, marginLeft: 5 }
});

export default ManageCategoriesScreen;