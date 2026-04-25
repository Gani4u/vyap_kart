import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';

import type { CustomerRootStackParamList } from '../../navigation/types';
import { addressService } from '../../services/addressService';
import { orderService } from '../../services/orderService';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import type { Address } from '../../types/models';

type Props = NativeStackScreenProps<CustomerRootStackParamList, 'Address'>;

export default function AddressScreen({ navigation }: Props) {
  const user = useAuthStore(state => state.user);
  const selectedAddressId = useCartStore(state => state.selectedAddressId);
  const setSelectedAddressId = useCartStore(state => state.setSelectedAddressId);

  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const loadAddresses = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await addressService.getAddressesByUser(user.id);
      setAddresses(data);

      if (!selectedAddressId) {
        const defaultAddress = data.find(item => item.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        }
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load addresses.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  }, [user, selectedAddressId, setSelectedAddressId]);

  useFocusEffect(
    useCallback(() => {
      loadAddresses();
    }, [loadAddresses])
  );

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const handleContinue = async () => {
    if (!selectedAddressId) {
      Alert.alert('Select Address', 'Please select an address to continue.');
      return;
    }

    try {
      const result = await orderService.checkServiceability(selectedAddressId);

      if (!result.serviceable) {
        Alert.alert('Not Serviceable', result.message);
        return;
      }

      navigation.navigate('Checkout');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to validate address.';
      Alert.alert('Error', message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Choose delivery address</Text>
      <Text style={styles.subTitle}>Delivery available only in Ilkal - 587125</Text>

      {addresses.map(address => {
        const isSelected = selectedAddressId === address.id;
        const isServiceable =
          address.city.toLowerCase() === 'ilkal' && address.pincode === '587125';

        return (
          <Pressable
            key={address.id}
            style={[styles.card, isSelected && styles.selectedCard]}
            onPress={() => setSelectedAddressId(address.id)}
          >
            <View style={styles.rowBetween}>
              <Text style={styles.area}>{address.area}</Text>
              {address.isDefault && (
                <Text style={styles.defaultBadge}>Default</Text>
              )}
            </View>

            <Text style={styles.addressText}>{address.fullAddress}</Text>

            {!!address.landmark && (
              <Text style={styles.metaText}>Landmark: {address.landmark}</Text>
            )}

            <Text style={styles.metaText}>
              {address.city} - {address.pincode}
            </Text>

            <Text
              style={[
                styles.serviceText,
                !isServiceable && styles.notServiceText,
              ]}
            >
              {isServiceable ? 'Serviceable' : 'Not serviceable'}
            </Text>
          </Pressable>
        );
      })}

      <Pressable style={styles.primaryButton} onPress={handleContinue}>
        <Text style={styles.primaryButtonText}>Continue to Checkout</Text>
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
  },
  subTitle: {
    marginTop: 6,
    marginBottom: 16,
    fontSize: 14,
    color: '#64748b',
  },
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  selectedCard: {
    borderColor: '#059669',
    borderWidth: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  area: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  defaultBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065f46',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  addressText: {
    marginTop: 10,
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  metaText: {
    marginTop: 6,
    fontSize: 13,
    color: '#64748b',
  },
  serviceText: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '700',
    color: '#16a34a',
  },
  notServiceText: {
    color: '#dc2626',
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});