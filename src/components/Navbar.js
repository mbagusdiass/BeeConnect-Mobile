import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ navigation }) => {
  const { userToken } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.brandName}>BeeConnect</Text>
      </TouchableOpacity>
      
      <View style={styles.iconGroup}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search-outline" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.iconBtn} 
          onPress={() => navigation.navigate(userToken ? 'Profile' : 'Login')}
        >
          <Ionicons name={userToken ? "person" : "person-outline"} size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  brandName: { fontSize: 22, fontWeight: 'bold', color: '#000' },
  iconGroup: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { marginLeft: 15 }
});

export default Navbar;