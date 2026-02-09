import React, { useState, useCallback } from 'react';
import { 
  View, Text, FlatList, StyleSheet, TouchableOpacity, 
  RefreshControl, ActivityIndicator, Alert, SafeAreaView, Platform, Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import apiClient, {BASE_URL_PICS} from '../api/apiClient';

const ManageUsersScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get('/admin/users');
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Gagal memuat daftar user.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleDelete = (id, name) => {
    Alert.alert(
      "Konfirmasi Hapus",
      `Apakah kamu yakin ingin menghapus user ${name}?`,
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Hapus", 
          style: "destructive", 
          onPress: async () => {
            try {
              await apiClient.delete(`/admin/users/${id}`);
              setUsers(users.filter(u => u._id !== id));
            } catch (err) {
              Alert.alert("Error", "Gagal menghapus user.");
            }
          } 
        }
      ]
    );
  };

  const renderUserItem = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.userInfo}>
      <View style={styles.avatarPlaceholder}>
        {item?.profile_picture ? (
          <Image 
            source={{ uri: `${BASE_URL_PICS}${item.profile_picture}` }} 
            style={styles.avatarImage} 
            onError={(e) => console.log("Gagal memuat gambar:", e.nativeEvent.error)}
          />
        ) : (
          <Text style={styles.avatarText}>
            {item?.name ? item.name.charAt(0).toUpperCase() : 'U'}
          </Text>
        )}
      </View>

      <View style={styles.textDetails}>
        <Text style={styles.userName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.userEmail} numberOfLines={1}>{item.email}</Text>
        <View style={[
          styles.roleBadge, 
          { backgroundColor: item.role === 'admin' ? '#FFE4E6' : item.role === 'seller' ? '#DBEAFE' : '#DCFCE7' }
        ]}>
          <Text style={[
            styles.roleText, 
            { color: item.role === 'admin' ? '#E11D48' : item.role === 'seller' ? '#1E40AF' : '#166534' }
          ]}>
            {item.role.toUpperCase()}
          </Text>
        </View>
      </View>
    </View>

    <View style={styles.actions}>
      <TouchableOpacity 
        style={[styles.actionBtn, { backgroundColor: '#F0F9FF' }]} 
        onPress={() => navigation.navigate('EditUser', { user: item })}
      >
        <Ionicons name="create-outline" size={18} color="#0369A1" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.actionBtn, { backgroundColor: '#FEF2F2' }]} 
        onPress={() => handleDelete(item._id, item.name)}
      >
        <Ionicons name="trash-outline" size={18} color="#991B1B" />
      </TouchableOpacity>
    </View>
  </View>
);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manajemen User</Text>
        <TouchableOpacity 
          style={styles.addBtnHeader} 
          onPress={() => navigation.navigate('AddUser')}
        >
          <Ionicons name="person-add" size={22} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderUserItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Tidak ada data user.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 45 : 10, 
    paddingBottom: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' 
  },
  headerTitle: { fontSize: 16, fontWeight: 'bold' },
  addBtnHeader: { padding: 5, backgroundColor: '#EEF2FF', borderRadius: 8 },
  listContent: { padding: 20 },
  card: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 15, borderRadius: 12, backgroundColor: '#fff', marginBottom: 12,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatarPlaceholder: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: '#F3F4F6', 
    justifyContent: 'center', 
    alignItems: 'center',
    overflow: 'hidden' 
  },
  
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },

  avatarText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#9CA3AF' 
  },
  textDetails: { marginLeft: 15, flex: 1 },
  userName: { fontSize: 15, fontWeight: 'bold', color: '#111827' },
  userEmail: { fontSize: 12, color: '#6B7280', marginBottom: 5 },
  roleBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  roleText: { fontSize: 10, fontWeight: 'bold' },
  actions: { flexDirection: 'row' },
  actionBtn: { marginLeft: 10, padding: 8, borderRadius: 8 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#9CA3AF' }
});

export default ManageUsersScreen;