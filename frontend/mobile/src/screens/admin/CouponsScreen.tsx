import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { AdminRootStackParamList } from '../../navigation/types';
import type { Coupon, CouponType } from '../../types/models';
import { coupons } from '../../data';

type Props = NativeStackScreenProps<AdminRootStackParamList, 'Coupons'>;

export default function CouponsScreen(_props: Props) {
  const [couponList, setCouponList] = useState<Coupon[]>([]);
  const [code, setCode] = useState('');
  const [type, setType] = useState<CouponType>('flat');
  const [value, setValue] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('');

  const refresh = useCallback(() => {
    setCouponList([...coupons]);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const handleAddCoupon = () => {
    const normalizedCode = code.trim().toUpperCase();
    const parsedValue = Number(value);
    const parsedMinOrderAmount = Number(minOrderAmount);

    if (!normalizedCode || Number.isNaN(parsedValue) || Number.isNaN(parsedMinOrderAmount)) {
      Alert.alert('Validation Error', 'Enter valid coupon details.');
      return;
    }

    coupons.unshift({
      id: `cp-${Date.now()}`,
      code: normalizedCode,
      type,
      value: parsedValue,
      minOrderAmount: parsedMinOrderAmount,
      expiryDate: '2026-12-31T23:59:59.000Z',
      usageLimit: 100,
      isActive: true,
    });

    setCode('');
    setValue('');
    setMinOrderAmount('');
    setType('flat');
    refresh();

    Alert.alert('Success', 'Coupon added successfully.');
  };

  const toggleCoupon = (couponId: string) => {
    const coupon = coupons.find(item => item.id === couponId);

    if (!coupon) return;

    coupon.isActive = !coupon.isActive;
    refresh();
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Coupons</Text>

      <View style={styles.formCard}>
        <TextInput
          style={styles.input}
          placeholder="Coupon code"
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
        />

        <View style={styles.typeRow}>
          <Pressable
            style={[styles.typeButton, type === 'flat' && styles.typeButtonActive]}
            onPress={() => setType('flat')}
          >
            <Text
              style={[styles.typeButtonText, type === 'flat' && styles.typeButtonTextActive]}
            >
              Flat
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.typeButton,
              type === 'percentage' && styles.typeButtonActive,
            ]}
            onPress={() => setType('percentage')}
          >
            <Text
              style={[
                styles.typeButtonText,
                type === 'percentage' && styles.typeButtonTextActive,
              ]}
            >
              Percentage
            </Text>
          </Pressable>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Value"
          value={value}
          onChangeText={setValue}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Minimum order amount"
          value={minOrderAmount}
          onChangeText={setMinOrderAmount}
          keyboardType="numeric"
        />

        <Pressable style={styles.addButton} onPress={handleAddCoupon}>
          <Text style={styles.addButtonText}>Add Coupon</Text>
        </Pressable>
      </View>

      <FlatList
        data={couponList}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.code}>{item.code}</Text>
              <Text style={styles.meta}>
                {item.type} • value {item.value}
              </Text>
              <Text style={styles.meta}>
                Min order: ₹{item.minOrderAmount}
              </Text>
            </View>

            <Pressable
              style={[
                styles.statusButton,
                item.isActive ? styles.activeButton : styles.inactiveButton,
              ]}
              onPress={() => toggleCoupon(item.id)}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  item.isActive ? styles.activeText : styles.inactiveText,
                ]}
              >
                {item.isActive ? 'Active' : 'Inactive'}
              </Text>
            </Pressable>
          </View>
        )}
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
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  formCard: {
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
    marginBottom: 10,
  },
  typeRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  typeButton: {
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  typeButtonActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  typeButtonText: {
    color: '#0f172a',
    fontWeight: '800',
    fontSize: 13,
  },
  typeButtonTextActive: {
    color: '#ffffff',
  },
  addButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  list: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  code: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  meta: {
    marginTop: 6,
    fontSize: 13,
    color: '#64748b',
  },
  statusButton: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  activeButton: {
    backgroundColor: '#d1fae5',
  },
  inactiveButton: {
    backgroundColor: '#fee2e2',
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: '800',
  },
  activeText: {
    color: '#065f46',
  },
  inactiveText: {
    color: '#991b1b',
  },
});