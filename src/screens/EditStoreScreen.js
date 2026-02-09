import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  Image, Alert, ActivityIndicator, ScrollView, SafeAreaView, Platform 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { updateStoreData, uploadStoreImage } from '../api/storeService';
import { BASE_URL } from '../api/apiClient';

const EditStoreScreen = ({ route, navigation }) => {
  const { store } = route.params;

  const [name, setName] = useState(store?.store_name || '');
  const [description, setDescription] = useState(store?.store_description || '');
  const [address, setAddress] = useState(store?.store_address || '');
  const [image, setImage] = useState(null); 
  const [loading, setLoading] = useState(false);

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
    try {
      setLoading(true);

      if (image) {
        await uploadStoreImage(image);
      }

      await updateStoreData({
        store_name: name,
        store_description: description,
        store_address: address
      });

      Alert.alert("Sukses", "Profil toko berhasil diperbarui!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.response?.data?.message || "Gagal memperbarui toko");
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
        <Text style={styles.headerTitle}>Edit Profil Toko</Text>
        <TouchableOpacity onPress={handleUpdate} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.saveText}>Simpan</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageSection}>
          <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
            <Image 
              source={{ 
                uri: image || (store?.store_image ? `${BASE_URL}${store.store_image}` : 'https://via.placeholder.com/150') 
              }} 
              style={styles.storeImg} 
            />
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.changeText}>Ganti Foto Profil Toko</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama Toko</Text>
            <TextInput 
              style={styles.input} 
              value={name} 
              onChangeText={setName} 
              placeholder="Masukkan nama toko"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Deskripsi Toko</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              value={description} 
              onChangeText={setDescription} 
              multiline 
              placeholder="Jelaskan apa yang toko Anda tawarkan..."
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Alamat Toko</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              value={address} 
              onChangeText={setAddress} 
              multiline
              placeholder="Alamat lengkap toko Anda..."
            />
          </View>
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
  saveText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  content: { paddingBottom: 30 },
  imageSection: { alignItems: 'center', marginVertical: 30 },
  imageWrapper: { position: 'relative' },
  storeImg: { width: 120, height: 120, borderRadius: 15, backgroundColor: '#f5f5f5' },
  cameraIcon: { 
    position: 'absolute', 
    bottom: -5, 
    right: -5, 
    backgroundColor: '#000', 
    padding: 8, 
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff'
  },
  changeText: { marginTop: 10, color: '#666', fontSize: 13 },
  form: { paddingHorizontal: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  input: { 
    borderWidth: 1, 
    borderColor: '#eee', 
    borderRadius: 12, 
    padding: 12, 
    fontSize: 16, 
    backgroundColor: '#fafafa' 
  },
  textArea: { height: 100, textAlignVertical: 'top' }
});

export default EditStoreScreen;