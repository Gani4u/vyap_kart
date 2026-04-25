import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type {
  AdminRootStackParamList,
  AdminTabParamList,
} from './types';

import DashboardScreen from '../screens/admin/DashboardScreen';
import ProductsScreen from '../screens/admin/ProductsScreen';
import OrdersScreen from '../screens/admin/OrdersScreen';
import InventoryScreen from '../screens/admin/InventoryScreen';
import UsersScreen from '../screens/admin/UsersScreen';
import ProductFormScreen from '../screens/admin/ProductFormScreen';
import CategoriesScreen from '../screens/admin/CategoriesScreen';
import CouponsScreen from '../screens/admin/CouponsScreen';
import DeliveryZonesScreen from '../screens/admin/DeliveryZonesScreen';
import OrderDetailsScreen from '../screens/admin/OrderDetailsScreen';

const Tab = createBottomTabNavigator<AdminTabParamList>();
const Stack = createNativeStackNavigator<AdminRootStackParamList>();

function AdminTabs() {
  return (
    <Tab.Navigator
      initialRouteName="DashboardTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0f766e',
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
        name="DashboardTab"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="ProductsTab"
        component={ProductsScreen}
        options={{ title: 'Products' }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersScreen}
        options={{ title: 'Orders' }}
      />
      <Tab.Screen
        name="InventoryTab"
        component={InventoryScreen}
        options={{ title: 'Inventory' }}
      />
      <Tab.Screen
        name="UsersTab"
        component={UsersScreen}
        options={{ title: 'Users' }}
      />
    </Tab.Navigator>
  );
}

export default function AdminNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="AdminTabs"
      screenOptions={{
        contentStyle: { backgroundColor: '#f8fafc' },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '700',
        },
      }}
    >
      <Stack.Screen
        name="AdminTabs"
        component={AdminTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductForm"
        component={ProductFormScreen}
        options={{ title: 'Product Form' }}
      />
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ title: 'Categories' }}
      />
      <Stack.Screen
        name="Coupons"
        component={CouponsScreen}
        options={{ title: 'Coupons' }}
      />
      <Stack.Screen
        name="DeliveryZones"
        component={DeliveryZonesScreen}
        options={{ title: 'Delivery Zones' }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{ title: 'Order Details' }}
      />
    </Stack.Navigator>
  );
}