import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';

import type { CustomerRootStackParamList } from '../../navigation/types';
import { useOrderStore } from '../../store/orderStore';

type Props = NativeStackScreenProps<CustomerRootStackParamList, 'OrderTracking'>;

export default function OrderTrackingScreen({ route }: Props) {
  const orderId = route.params?.orderId;

  const activeOrder = useOrderStore(state => state.activeOrder);
  const trackingSteps = useOrderStore(state => state.trackingSteps);
  const isLoading = useOrderStore(state => state.isLoading);
  const loadTracking = useOrderStore(state => state.loadTracking);

  useFocusEffect(
    useCallback(() => {
      if (orderId) {
        loadTracking(orderId);
      }
    }, [orderId, loadTracking])
  );

  if (!orderId) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Order tracking not available.</Text>
      </View>
    );
  }

  if (isLoading || !activeOrder) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.summaryCard}>
        <Text style={styles.orderId}>Order ID: {activeOrder.id}</Text>
        <Text style={styles.total}>Total: ₹{activeOrder.total}</Text>
        <Text style={styles.meta}>
          Payment: {activeOrder.paymentMethod} | Status: {activeOrder.paymentStatus}
        </Text>
        <Text style={styles.meta}>Delivery slot: {activeOrder.deliverySlot}</Text>
      </View>

      <Text style={styles.sectionTitle}>Tracking Status</Text>

      {trackingSteps.map(step => (
        <View key={step.key} style={styles.stepRow}>
          <View
            style={[
              styles.stepDot,
              step.completed && styles.stepDotCompleted,
              step.current && styles.stepDotCurrent,
            ]}
          />
          <View style={styles.stepContent}>
            <Text
              style={[
                styles.stepLabel,
                step.completed && styles.stepLabelCompleted,
              ]}
            >
              {step.label}
            </Text>
            {step.current && <Text style={styles.currentText}>Current status</Text>}
          </View>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Delivery Address</Text>

      <View style={styles.addressCard}>
        <Text style={styles.addressLine}>{activeOrder.addressSnapshot.area}</Text>
        <Text style={styles.addressLine}>{activeOrder.addressSnapshot.fullAddress}</Text>
        <Text style={styles.addressMeta}>
          {activeOrder.addressSnapshot.city} - {activeOrder.addressSnapshot.pincode}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 24 },
  center: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFound: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  orderId: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  total: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: '800',
    color: '#059669',
  },
  meta: { marginTop: 8, fontSize: 13, color: '#64748b' },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 12,
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepDot: {
    width: 18,
    height: 18,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    marginTop: 2,
    marginRight: 12,
  },
  stepDotCompleted: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  stepDotCurrent: {
    borderColor: '#059669',
    borderWidth: 3,
  },
  stepContent: { flex: 1 },
  stepLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748b',
  },
  stepLabelCompleted: { color: '#0f172a' },
  currentText: {
    marginTop: 4,
    fontSize: 13,
    color: '#059669',
    fontWeight: '700',
  },
  addressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  addressLine: { fontSize: 15, color: '#334155', marginBottom: 6 },
  addressMeta: { marginTop: 4, fontSize: 13, color: '#64748b' },
});