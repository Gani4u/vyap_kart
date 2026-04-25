import React, { useCallback, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { AdminRootStackParamList } from '../../navigation/types';
import type { Order, OrderStatus } from '../../types/models';
import { orders } from '../../data';

type Props = NativeStackScreenProps<AdminRootStackParamList, 'OrderDetails'>;

const statusOptions: OrderStatus[] = [
  'placed',
  'confirmed',
  'assigned',
  'packed',
  'out_for_delivery',
  'delivered',
  'cancelled',
];

export default function OrderDetailsScreen({ route }: Props) {
  const { orderId } = route.params;

  const [order, setOrder] = useState<Order | null>(null);
  const [assignedTo, setAssignedTo] = useState('');

  const refresh = useCallback(() => {
    const currentOrder = orders.find(item => item.id === orderId) || null;
    setOrder(currentOrder);
    setAssignedTo(currentOrder?.assignedTo || '');
  }, [orderId]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const handleAssign = () => {
    const currentOrder = orders.find(item => item.id === orderId);

    if (!currentOrder) {
      return;
    }

    const trimmed = assignedTo.trim();

    if (!trimmed) {
      Alert.alert('Validation Error', 'Enter assigned person name.');
      return;
    }

    currentOrder.assignedTo = trimmed;

    if (currentOrder.orderStatus === 'placed') {
      currentOrder.orderStatus = 'assigned';
    }

    refresh();
    Alert.alert('Success', 'Order assigned successfully.');
  };

  const handleUpdateStatus = (status: OrderStatus) => {
    const currentOrder = orders.find(item => item.id === orderId);

    if (!currentOrder) {
      return;
    }

    currentOrder.orderStatus = status;
    refresh();
    Alert.alert('Updated', `Order marked as ${status.replace(/_/g, ' ')}.`);
  };

  if (!order) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Order not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <View style={styles.card}>
        <Text style={styles.orderId}>Order ID: {order.id}</Text>
        <Text style={styles.meta}>Total: ₹{order.total}</Text>
        <Text style={styles.meta}>Payment Method: {order.paymentMethod}</Text>
        <Text style={styles.meta}>Payment Status: {order.paymentStatus}</Text>
        <Text style={styles.meta}>
          Current Status: {order.orderStatus.replace(/_/g, ' ')}
        </Text>
        <Text style={styles.meta}>Delivery Slot: {order.deliverySlot}</Text>
        {!!order.assignedTo && (
          <Text style={styles.meta}>Assigned To: {order.assignedTo}</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Assign Order</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter staff/rider name"
          value={assignedTo}
          onChangeText={setAssignedTo}
        />
        <Pressable style={styles.primaryButton} onPress={handleAssign}>
          <Text style={styles.primaryButtonText}>Assign Order</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Update Status</Text>

        <View style={styles.statusRow}>
          {statusOptions.map(item => (
            <Pressable
              key={item}
              style={[
                styles.statusButton,
                order.orderStatus === item && styles.statusButtonActive,
              ]}
              onPress={() => handleUpdateStatus(item)}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  order.orderStatus === item && styles.statusButtonTextActive,
                ]}
              >
                {item.replace(/_/g, ' ')}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Items</Text>

        {order.items.map(item => (
          <View key={item.id} style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.nameSnapshot}</Text>
              <Text style={styles.itemMeta}>
                Qty: {item.quantity} • ₹{item.priceSnapshot}
              </Text>
            </View>
            <Text style={styles.itemTotal}>
              ₹{item.quantity * item.priceSnapshot}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Address</Text>
        <Text style={styles.meta}>{order.addressSnapshot.fullAddress}</Text>
        <Text style={styles.meta}>{order.addressSnapshot.area}</Text>
        <Text style={styles.meta}>
          {order.addressSnapshot.city} - {order.addressSnapshot.pincode}
        </Text>
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
  center: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFound: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  orderId: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  meta: {
    marginTop: 8,
    fontSize: 14,
    color: '#475569',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0f172a',
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statusButton: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  statusButtonActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    textTransform: 'capitalize',
  },
  statusButtonTextActive: {
    color: '#ffffff',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  itemMeta: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748b',
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#059669',
  },
});