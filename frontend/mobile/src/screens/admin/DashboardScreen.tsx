import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type {
  AdminRootStackParamList,
  AdminTabParamList,
} from '../../navigation/types';

import { inventory, orders, products, users } from '../../data';
import { useAuthStore } from '../../store/authStore';

type Props = BottomTabScreenProps<AdminTabParamList, 'DashboardTab'>;

export default function DashboardScreen({ navigation }: Props) {
  const rootNavigation =
    useNavigation<NativeStackNavigationProp<AdminRootStackParamList>>();

  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const [tick, setTick] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setTick(prev => prev + 1);
    }, [])
  );

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const activeProducts = products.filter(item => item.isActive).length;
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(item =>
      ['placed', 'confirmed', 'assigned', 'packed', 'out_for_delivery'].includes(
        item.orderStatus
      )
    ).length;
    const lowStockItems = inventory.filter(
      item => item.availableQty <= item.reorderLevel
    ).length;
    const customerCount = users.filter(item => item.role === 'customer').length;

    return {
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      lowStockItems,
      customerCount,
    };
  }, [tick]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to logout.';
      Alert.alert('Logout Error', message);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <View style={styles.headerCard}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>
          Welcome {user?.name || 'Admin'}
        </Text>
        <Text style={styles.cityText}>Ilkal - 587125 operations</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Products</Text>
          <Text style={styles.statValue}>{stats.totalProducts}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Active Products</Text>
          <Text style={styles.statValue}>{stats.activeProducts}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Orders</Text>
          <Text style={styles.statValue}>{stats.totalOrders}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Pending Orders</Text>
          <Text style={[styles.statValue, { color: '#d97706' }]}>
            {stats.pendingOrders}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Low Stock</Text>
          <Text style={[styles.statValue, { color: '#dc2626' }]}>
            {stats.lowStockItems}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Customers</Text>
          <Text style={styles.statValue}>{stats.customerCount}</Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => rootNavigation.navigate('ProductForm', { mode: 'create' })}
        >
          <Text style={styles.primaryButtonText}>Add Product</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('ProductsTab')}
        >
          <Text style={styles.secondaryButtonText}>Manage Products</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('OrdersTab')}
        >
          <Text style={styles.secondaryButtonText}>Manage Orders</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('InventoryTab')}
        >
          <Text style={styles.secondaryButtonText}>Inventory</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => rootNavigation.navigate('Categories')}
        >
          <Text style={styles.secondaryButtonText}>Categories</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => rootNavigation.navigate('Coupons')}
        >
          <Text style={styles.secondaryButtonText}>Coupons</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => rootNavigation.navigate('DeliveryZones')}
        >
          <Text style={styles.secondaryButtonText}>Delivery Zones</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('UsersTab')}
        >
          <Text style={styles.secondaryButtonText}>Users</Text>
        </Pressable>

        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: '#334155',
  },
  cityText: {
    marginTop: 6,
    fontSize: 13,
    color: '#059669',
    fontWeight: '700',
  },
  statsGrid: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '700',
  },
  statValue: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButtonText: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '700',
  },
  logoutButton: {
    marginTop: 8,
    backgroundColor: '#dc2626',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});