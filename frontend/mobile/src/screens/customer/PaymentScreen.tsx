import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CustomerRootStackParamList } from '../../navigation/types';

import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useOrderStore } from '../../store/orderStore';

import type { PaymentMethod } from '../../types/models';

type Props = NativeStackScreenProps<CustomerRootStackParamList, 'Payment'>;

export default function PaymentScreen({ navigation }: Props) {
  const user = useAuthStore((state) => state.user);
  const selectedAddressId = useCartStore((state) => state.selectedAddressId);
  const appliedCouponCode = useCartStore((state) => state.appliedCouponCode);
  const grandTotal = useCartStore((state) => state.grandTotal);

  const placeOrder = useOrderStore((state) => state.placeOrder);
  const isLoading = useOrderStore((state) => state.isLoading);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('cod');

  const handlePlaceOrder = async () => {
    if (!user) {
      Alert.alert('Error', 'User not found.');
      return;
    }

    if (!selectedAddressId) {
      Alert.alert('Error', 'Please select an address first.');
      navigation.navigate('Address');
      return;
    }

    try {
      const order = await placeOrder({
        userId: user.id,
        addressId: selectedAddressId,
        paymentMethod,
        couponCode: appliedCouponCode || undefined,
        deliverySlot: 'Next available slot',
      });

      navigation.replace('OrderSuccess', {
        orderId: order.id,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to place order.';
      Alert.alert('Order Error', message);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>Select payment method</Text>

      <Pressable
        style={[
          styles.optionCard,
          paymentMethod === 'cod' && styles.optionCardSelected,
        ]}
        onPress={() => setPaymentMethod('cod')}
      >
        <Text style={styles.optionTitle}>Cash on Delivery</Text>
        <Text style={styles.optionSubTitle}>
          Pay when the order is delivered
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.optionCard,
          paymentMethod === 'online' && styles.optionCardSelected,
        ]}
        onPress={() => setPaymentMethod('online')}
      >
        <Text style={styles.optionTitle}>Online Payment</Text>
        <Text style={styles.optionSubTitle}>
          Mock payment success for this MVP
        </Text>
      </Pressable>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Amount to pay</Text>
        <Text style={styles.amount}>₹{grandTotal}</Text>
      </View>

      <Pressable
        style={styles.primaryButton}
        onPress={handlePlaceOrder}
        disabled={isLoading}
      >
        <Text style={styles.primaryButtonText}>
          {isLoading ? 'Processing...' : 'Place Order'}
        </Text>
      </Pressable>
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
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
  },
  optionCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  optionCardSelected: {
    borderColor: '#059669',
    borderWidth: 2,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  optionSubTitle: {
    marginTop: 6,
    fontSize: 13,
    color: '#64748b',
  },
  summaryCard: {
    marginTop: 10,
    backgroundColor: '#ecfdf5',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  summaryTitle: {
    fontSize: 14,
    color: '#065f46',
    fontWeight: '700',
  },
  amount: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: '800',
    color: '#064e3b',
  },
  primaryButton: {
    marginTop: 22,
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
});