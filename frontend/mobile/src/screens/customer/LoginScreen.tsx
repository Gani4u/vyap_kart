import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { PublicStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';

type Props = NativeStackScreenProps<PublicStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const sendOtp = useAuthStore(state => state.sendOtp);
  const login = useAuthStore(state => state.login);
  const isLoading = useAuthStore(state => state.isLoading);

  const [mobile, setMobile] = useState('9876543210');
  const [otp, setOtp] = useState('1234');

  const handleCustomerLogin = async () => {
    try {
      await sendOtp(mobile);
      await login(mobile, otp);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Login failed.';
      Alert.alert('Login Error', message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Login</Text>
      <Text style={styles.subtitle}>Use mock OTP 1234</Text>

      <TextInput
        style={styles.input}
        placeholder="Mobile number"
        keyboardType="phone-pad"
        maxLength={10}
        value={mobile}
        onChangeText={setMobile}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        keyboardType="number-pad"
        maxLength={4}
        value={otp}
        onChangeText={setOtp}
      />

      <Pressable
        style={styles.primaryButton}
        onPress={handleCustomerLogin}
        disabled={isLoading}
      >
        <Text style={styles.primaryButtonText}>
          {isLoading ? 'Please wait...' : 'Login as Customer'}
        </Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('AdminLogin')}
      >
        <Text style={styles.secondaryButtonText}>Go to Admin Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 14,
    color: '#0f172a',
  },
  primaryButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#059669',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#059669',
    fontSize: 16,
    fontWeight: '700',
  },
});