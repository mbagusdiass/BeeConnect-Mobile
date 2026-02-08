import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Alert, 
  ActivityIndicator, 
  SafeAreaView, 
  ScrollView,
  Platform 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { updateProfileFull } from '../api/userService';
import { BASE_URL_PICS } from '../api/apiClient'; 

const EditProfileScreen = ({ navigation }) => {
  const { user, setUser } = useContext(AuthContext);
  
  const [name, setName] = useState(user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null); 
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin Ditolak', 'Aplikasi butuh akses galeri.');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType ? ImagePicker.MediaType.Images : 'images', 
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Gagal membuka galeri.");
    }
  };

  const handleSave = async () => {
    if (!name || !phoneNumber) {
      Alert.alert("Error", "Nama dan Nomor Telepon wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const res = await updateProfileFull({
        name: name,
        phone_number: phoneNumber,
        password: password || undefined, 
        profile_picture: image 
      });

      if (res.user) {
        setUser(res.user); 
        Alert.alert("Sukses", "Profil berhasil diperbarui!", [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      }
    } catch (err) {
      console.log("Error Save:", err.response?.data || err.message);
      Alert.alert("Gagal", err.response?.data?.message || "Gagal menyimpan perubahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profil</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Image Section */}
        <View style={styles.imageSection}>
          <TouchableOpacity onPress={pickImage} activeOpacity={0.8} style={styles.imageContainer}>
            <View style={styles.imageWrapper}>
              <Image 
                source={{ 
                  uri: image || (user?.profile_picture ? `${BASE_URL_PICS}${user.profile_picture}` : 'https://via.placeholder.com/150') 
                }} 
                style={styles.profileImg} 
              />
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={20} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
          <Text style={styles.hintText}>Ketuk foto untuk mengubah</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <TextInput 
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Masukkan nama"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nomor Telepon</Text>
            <TextInput 
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              placeholder="0812xxxx"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ganti Password (Opsional)</Text>
            <TextInput 
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Isi hanya jika ingin ganti password"
            />
          </View>

          <TouchableOpacity 
            style={[styles.saveBtn, loading && { backgroundColor: '#888' }]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>Simpan Perubahan</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0',
    marginTop: Platform.OS === 'android' ? 25 : 0
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  backBtn: { padding: 5 },
  content: { paddingBottom: 40 },
  imageSection: { alignItems: 'center', marginVertical: 30 },
  imageContainer: { padding: 5 },
  imageWrapper: { position: 'relative' },
  profileImg: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#f0f0f0' },
  cameraIcon: { 
    position: 'absolute', 
    bottom: 0, 
    right: 5, 
    backgroundColor: '#000', 
    padding: 8, 
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 1
  },
  hintText: { marginTop: 10, fontSize: 12, color: '#999' },
  form: { paddingHorizontal: 25 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 8 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 10, 
    padding: 12, 
    fontSize: 16,
    backgroundColor: '#fafafa'
  },
  saveBtn: { 
    backgroundColor: '#000', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 20 
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default EditProfileScreen;