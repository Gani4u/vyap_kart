import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type {
  CustomerRootStackParamList,
  CustomerTabParamList,
} from '../../navigation/types';

import { useAuthStore } from '../../store/authStore';
import { useOrderStore } from '../../store/orderStore';

type Props = BottomTabScreenProps<
  CustomerTabParamList,
  'OrdersTab'
>;

export default function MyOrdersScreen(_props: Props) {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<CustomerRootStackParamList>
    >();

  const user = useAuthStore((state) => state.user);
  const myOrders = useOrderStore((state) => state.myOrders);
  const isLoading = useOrderStore((state) => state.isLoading);
  const loadMyOrders = useOrderStore((state) => state.loadMyOrders);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadMyOrders(user.id);
      }
    }, [user, loadMyOrders])
  );

  if (isLoading && myOrders.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>My Orders</Text>

      <FlatList
        data={myOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              navigation.navigate('OrderTracking', {
                orderId: item.id,
              })
            }
          >
            <View style={styles.rowBetween}>
              <Text style={styles.orderId}>{item.id}</Text>
              <Text style={styles.status}>
                {item.orderStatus.replace(/_/g, ' ')}
              </Text>
            </View>

            <Text style={styles.dateText}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>

            <Text style={styles.total}>₹{item.total}</Text>
            <Text style={styles.itemsCount}>
              {item.items.length} items
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubTitle}>
              Your placed orders will appear here.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 16,
  },
  center: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  list: { padding: 16 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  orderId: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  status: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065f46',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    textTransform: 'capitalize',
  },
  dateText: {
    marginTop: 8,
    fontSize: 13,
    color: '#64748b',
  },
  total: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: '800',
    color: '#059669',
  },
  itemsCount: {
    marginTop: 6,
    fontSize: 13,
    color: '#475569',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  emptySubTitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});