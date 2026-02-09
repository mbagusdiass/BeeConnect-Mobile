import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ActivityIndicator, 
  Alert, 
  SafeAreaView,
  TouchableOpacity,
  Text,
  Platform 
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

const CheckoutScreen = ({ route, navigation }) => {
  const { snapToken, transactionId, orderId, totalPrice } = route.params || {};
  const [loading, setLoading] = useState(true);

  // URL Midtrans Snap Sandbox
  const midtransUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${snapToken}`;
  const handleNavigationStateChange = (navState) => {
    const { url } = navState;
    console.log("Navigating to URL:", url);
    if (url.includes('finish') || url.includes('status_code=200')) {
      Alert.alert(
        "Pembayaran Berhasil", 
        "Terima kasih! Pesanan Anda sedang kami proses.", 
        [{ 
          text: "Lihat Detail Pesanan", 
          onPress: () => navigation.replace('TransactionDetail', { 
            transactionId, 
            orderId, 
            totalPrice 
          }) 
        }]
      );
    } 
    
    else if (url.includes('error') || url.includes('status_code=400')) {
      Alert.alert(
        "Pembayaran Gagal", 
        "Terjadi kendala saat memproses pembayaran Anda.", 
        [{ text: "Kembali ke Keranjang", onPress: () => navigation.goBack() }]
      );
    }

    else if (url.includes('pending') || url.includes('status_code=201')) {
      Alert.alert(
        "Pembayaran Pending", 
        "Selesaikan pembayaran Anda segera.", 
        [{ text: "Cek Riwayat", onPress: () => navigation.replace('History') }]
      );
    }
  };

  if (!snapToken) {
    return (
      <View style={styles.center}>
        <Text>Token pembayaran tidak ditemukan.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: 'blue', marginTop: 10 }}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Ionicons name="close" size={26} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Selesaikan Pembayaran</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={{ flex: 1 }}>
        <WebView
          source={{ uri: midtransUrl }}
          onNavigationStateChange={handleNavigationStateChange}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          onShouldStartLoadWithRequest={(request) => {
            if (request.url.includes('beeconnect.com')) {
              navigation.replace('TransactionDetail', { transactionId, orderId, totalPrice });
              return false;
            }
            return true;
          }}
        />
        
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.loaderText}>Menghubungkan ke Midtrans...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginTop: Platform.OS === 'android' ? 30 : 0
  },
  headerTitle: { fontSize: 16, fontWeight: 'bold' },
  closeBtn: { padding: 5 },
  loader: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)'
  },
  loaderText: { marginTop: 12, fontSize: 13, color: '#666' }
});

export default CheckoutScreen;