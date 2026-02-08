import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AdminDashboard = ({ navigation }) => {

  const menuItems = [
    { id: 1, title: 'Kelola User', icon: 'people', color: '#4F46E5', screen: 'ManageUsers' },
    { id: 2, title: 'Kelola Toko', icon: 'business', color: '#10B981', screen: 'ManageStores' },
    { id: 3, title: 'Kelola Produk', icon: 'cube', color: '#F59E0B', screen: 'ManageProducts' },
    { id: 4, title: 'Kelola Kategori', icon: 'grid', color: '#EF4444', screen: 'ManageCategories' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="log-out-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.welcomeText}>Selamat Datang, Admin!</Text>
        
        <View style={styles.grid}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.card}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon} size={30} color="white" />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Tambahan */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#666" />
          <Text style={styles.infoText}>
            Gunakan panel ini untuk mengawasi seluruh aktivitas aplikasi.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 40 : 20
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  content: { padding: 20 },
  welcomeText: { fontSize: 16, color: '#6B7280', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { 
    backgroundColor: '#fff', 
    width: '47%', 
    padding: 20, 
    borderRadius: 15, 
    alignItems: 'center', 
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5
  },
  iconContainer: { padding: 15, borderRadius: 12, marginBottom: 10 },
  cardTitle: { fontWeight: '600', fontSize: 14, color: '#374151' },
  infoBox: { flexDirection: 'row', backgroundColor: '#E5E7EB', padding: 15, borderRadius: 10, marginTop: 10 },
  infoText: { marginLeft: 10, fontSize: 13, color: '#4B5563', flex: 1 }
});

export default AdminDashboard;