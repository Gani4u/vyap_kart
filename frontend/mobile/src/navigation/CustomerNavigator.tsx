import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type {
  CustomerRootStackParamList,
  CustomerTabParamList,
} from './types';

import HomeScreen from '../screens/customer/HomeScreen';
import CategoriesScreen from '../screens/customer/CategoriesScreen';
import SearchScreen from '../screens/customer/SearchScreen';
import CartScreen from '../screens/customer/CartScreen';
import MyOrdersScreen from '../screens/customer/MyOrdersScreen';
import ProfileScreen from '../screens/customer/ProfileScreen';
import ProductListScreen from '../screens/customer/ProductListScreen';
import ProductDetailsScreen from '../screens/customer/ProductDetailsScreen';
import AddressScreen from '../screens/customer/AddressScreen';
import CheckoutScreen from '../screens/customer/CheckoutScreen';
import PaymentScreen from '../screens/customer/PaymentScreen';
import OrderSuccessScreen from '../screens/customer/OrderSuccessScreen';
import OrderTrackingScreen from '../screens/customer/OrderTrackingScreen';
import SupportScreen from '../screens/customer/SupportScreen';

const Tab = createBottomTabNavigator<CustomerTabParamList>();
const Stack = createNativeStackNavigator<CustomerRootStackParamList>();

function CustomerTabs() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarStyle: {
          height: 62,
          paddingTop: 6,
          paddingBottom: 8,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="CategoriesTab"
        component={CategoriesScreen}
        options={{ title: 'Categories' }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{ title: 'Search' }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{ title: 'Cart' }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={MyOrdersScreen}
        options={{ title: 'Orders' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

export default function CustomerNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="CustomerTabs"
      screenOptions={{
        contentStyle: { backgroundColor: '#f8fafc' },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '700',
        },
      }}
    >
      <Stack.Screen
        name="CustomerTabs"
        component={CustomerTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{ title: 'Products' }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: 'Product Details' }}
      />
      <Stack.Screen
        name="Address"
        component={AddressScreen}
        options={{ title: 'Select Address' }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: 'Checkout' }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{ title: 'Payment' }}
      />
      <Stack.Screen
        name="OrderSuccess"
        component={OrderSuccessScreen}
        options={{
          title: 'Order Success',
          headerLeft: () => null,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="OrderTracking"
        component={OrderTrackingScreen}
        options={{ title: 'Track Order' }}
      />
      <Stack.Screen
        name="Support"
        component={SupportScreen}
        options={{ title: 'Support' }}
      />
    </Stack.Navigator>
  );
}