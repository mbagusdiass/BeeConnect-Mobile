import React, { useContext, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  Platform, 
  Image,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native'; 
import { AuthContext } from '../context/AuthContext';
import { BASE_URL_PICS } from '../api/apiClient';
import { getMyProfile } from '../api/userService'; 

const ProfileScreen = ({ navigation }) => {
  const { user, setUser, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const fetchLatestProfile = async () => {
    try {
      setLoading(true);
      const latestData = await getMyProfile();
      if (latestData) {
        setUser(latestData);
      }
    } catch (error) {
      console.log("Sinkronisasi profil gagal:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLatestProfile();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert(
      "Keluar",
      "Apakah Anda yakin ingin keluar?",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Keluar", 
          style: "destructive", 
          onPress: async () => {
            await logout();
            navigation.replace('Login');
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 24 }} /> 
        <Text style={styles.headerTitle}>Profil Saya</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            {user?.profile_picture ? (
              <Image 
                source={{ uri: `${BASE_URL_PICS}${user.profile_picture}?t=${new Date().getTime()}` }} 
                style={styles.avatarImage} 
                onError={(e) => console.log("Gagal memuat gambar:", e.nativeEvent.error)}
              />
            ) : (
              <Text style={styles.avatarChar}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            )}
          </View>

          <Text style={styles.name}>{user?.name || 'User'}</Text>
          
          <View style={styles.roleBadge}>
            <Text style={styles.roleLabel}>{user?.role?.toUpperCase() || 'MEMBER'}</Text>
          </View>

          <TouchableOpacity 
            style={styles.editProfileBtn} 
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Ionicons name="pencil-sharp" size={14} color="#666" />
            <Text style={styles.editProfileText}>Edit Profil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Aktivitas Saya</Text>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigation.navigate('History')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="receipt-outline" size={22} color="black" />
              <Text style={styles.menuText}>Pesanan Saya</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          
          {user?.role === 'user' && (
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('Main', { screen: 'Manage' })}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="storefront-outline" size={22} color="green" />
                <Text style={[styles.menuText, { color: 'green' }]}>Mulai Berjualan</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          )}

          <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Akun</Text>

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={styles.menuLeft}>
              <Ionicons name="log-out-outline" size={22} color="red" />
              <Text style={[styles.menuText, { color: 'red' }]}>Keluar</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'ios' ? 50 : 40, 
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9'
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { alignItems: 'center', paddingTop: 20, paddingBottom: 40 },
  userCard: { alignItems: 'center', marginBottom: 30, width: '100%' },
  avatar: { 
    width: 90, 
    height: 90, 
    borderRadius: 45, 
    backgroundColor: '#000', 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 5, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4,
    overflow: 'hidden'
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarChar: { color: '#fff', fontSize: 36, fontWeight: 'bold' },
  name: { fontSize: 22, fontWeight: 'bold', marginTop: 15 },
  roleBadge: { 
    backgroundColor: '#f0f0f0', 
    paddingHorizontal: 12, 
    paddingVertical: 4, 
    borderRadius: 20, 
    marginTop: 8 
  },
  roleLabel: { fontSize: 10, color: '#666', fontWeight: 'bold', letterSpacing: 1 },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#eee'
  },
  editProfileText: { marginLeft: 6, fontSize: 13, fontWeight: '600', color: '#666' },
  menuContainer: { width: '100%', paddingHorizontal: 25 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#bbb', marginBottom: 10, textTransform: 'uppercase' },
  menuItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center', 
    paddingVertical: 18, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f9f9f9' 
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuText: { marginLeft: 15, fontSize: 15, fontWeight: '500' },
});

export default ProfileScreen;