import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { CustomerRootStackParamList } from '../../navigation/types';
import { orderService } from '../../services/orderService';
import type { Order } from '../../types/models';

type Props = NativeStackScreenProps<CustomerRootStackParamList, 'OrderSuccess'>;

export default function OrderSuccessScreen({ route, navigation }: Props) {
  const orderId = route.params?.orderId;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const loadOrder = async () => {
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
      setLoading(false);
    };

    loadOrder().catch(() => setLoading(false));
  }, [orderId]);

  if (!orderId) {
    return (
      <View style={styles.center}>
        <Text style={styles.subTitle}>Order details not available.</Text>
        <Pressable
          style={styles.secondaryButton}
          onPress={() =>
            navigation.navigate('CustomerTabs', {
              screen: 'HomeTab',
            })
          }
        >
          <Text style={styles.secondaryButtonText}>Go to Home</Text>
        </Pressable>
      </View>
    );
  }

  if (loading || !order) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.icon}>✅</Text>
      <Text style={styles.title}>Order placed successfully</Text>
      <Text style={styles.subTitle}>Your order id is {order.id}</Text>
      <Text style={styles.amount}>Total: ₹{order.total}</Text>

      <Pressable
        style={styles.primaryButton}
        onPress={() =>
          navigation.replace('OrderTracking', {
            orderId: order.id,
          })
        }
      >
        <Text style={styles.primaryButtonText}>Track Order</Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() =>
          navigation.navigate('CustomerTabs', {
            screen: 'HomeTab',
          })
        }
      >
        <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  center: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  icon: { fontSize: 64, marginBottom: 12 },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  subTitle: {
    marginTop: 10,
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
  },
  amount: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: '800',
    color: '#059669',
  },
  primaryButton: {
    marginTop: 26,
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#059669',
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
  },
  secondaryButtonText: {
    color: '#059669',
    fontSize: 16,
    fontWeight: '800',
  },
});