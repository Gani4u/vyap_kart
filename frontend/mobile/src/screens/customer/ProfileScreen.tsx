import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type {
  CustomerRootStackParamList,
  CustomerTabParamList,
} from '../../navigation/types';

import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';

type Props = BottomTabScreenProps<CustomerTabParamList, 'ProfileTab'>;

export default function ProfileScreen(_props: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<CustomerRootStackParamList>>();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const currentCity = useAppStore((state) => state.currentCity);
  const currentPincode = useAppStore((state) => state.currentPincode);
  const deliveryPromise = useAppStore((state) => state.deliveryPromise);

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
      <Text style={styles.title}>My Profile</Text>

      <View style={styles.card}>
        <Text style={styles.name}>{user?.name || 'Customer'}</Text>
        <Text style={styles.meta}>Mobile: {user?.mobile}</Text>
        <Text style={styles.meta}>Role: {user?.role}</Text>
        {!!user?.email && (
          <Text style={styles.meta}>Email: {user.email}</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Service Area</Text>
        <Text style={styles.meta}>City: {currentCity}</Text>
        <Text style={styles.meta}>Pincode: {currentPincode}</Text>
        <Text style={styles.note}>{deliveryPromise}</Text>
      </View>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('Support')}
      >
        <Text style={styles.secondaryButtonText}>Help & Support</Text>
      </Pressable>

      <Pressable
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  name: {
    fontSize: 22,
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
    marginBottom: 8,
  },
  note: {
    marginTop: 12,
    fontSize: 14,
    color: '#065f46',
    lineHeight: 20,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#059669',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: '#059669',
    fontSize: 15,
    fontWeight: '800',
  },
  logoutButton: {
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