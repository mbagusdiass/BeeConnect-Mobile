import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/context/AuthContext';

// Import Navigator & Auth
import TabNavigator from './src/navigation/TabNavigator';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

// Import Admin Screens
import AdminDashboard from './src/screens/AdminDashboard';
import ManageUsersScreen from './src/screens/ManageUsersScreen';
import EditUserScreen from './src/screens/EditUserScreen';
import ManageStoresScreen from './src/screens/ManageStoresScreen'; 
import ManageCategoriesScreen from './src/screens/ManageCategoriesScreen'; 

// Import User & Shop Screens
import ProfileScreen from './src/screens/ProfileScreen';
import ProductDetailScreen from "./src/screens/ProductDetail";
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import TransactionDetailScreen from './src/screens/TransactionDetailScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';

// Import Seller Screens
import EditStoreScreen from './src/screens/EditStoreScreen';
import ManageProductsScreen from './src/screens/ManageProductsScreen';
import EditProductScreen from './src/screens/EditProductScreen';
import AddProductScreen from './src/screens/AddProductScreen';
import SellerOrderScreen from './src/screens/SellerOrderScreen';
import AddUserScreen from './src/screens/AddUserScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login" 
          screenOptions={{ headerShown: false }}
        >
          {/* Auth Screens */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          
          {/* Main App (Tabs) */}
          <Stack.Screen name="Main" component={TabNavigator} />

          {/* Admin Section */}
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="ManageUsers" component={ManageUsersScreen} />
          <Stack.Screen name="EditUser" component={EditUserScreen} />
          <Stack.Screen name="ManageStores" component={ManageStoresScreen} />
          <Stack.Screen name="ManageCategories" component={ManageCategoriesScreen} />
          <Stack.Screen name="AddUser" component={AddUserScreen} />

          {/* User Section */}
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />

          {/* Seller Section */}
          <Stack.Screen name="EditStore" component={EditStoreScreen} />
          <Stack.Screen name="ManageProducts" component={ManageProductsScreen} />
          <Stack.Screen name="AddProduct" component={AddProductScreen} />
          <Stack.Screen name="EditProduct" component={EditProductScreen} />
          <Stack.Screen name="SellerOrders" component={SellerOrderScreen} />
          
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}