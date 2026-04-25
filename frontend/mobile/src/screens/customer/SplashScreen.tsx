import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { PublicStackParamList } from '../../navigation/types';
import { useAppStore } from '../../store/appStore';

type Props = NativeStackScreenProps<PublicStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  const completeOnboarding = useAppStore(state => state.completeOnboarding);

  useEffect(() => {
    const timer = setTimeout(() => {
      completeOnboarding();
      navigation.replace('Login');
    }, 1200);

    return () => clearTimeout(timer);
  }, [completeOnboarding, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Vyapkart</Text>
      <Text style={styles.tagline}>24 hour delivery in Ilkal</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    fontSize: 34,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#dcfce7',
    fontWeight: '500',
  },
});