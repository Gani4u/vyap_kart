import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { PublicStackParamList } from './types';

import SplashScreen from '../screens/customer/SplashScreen';
import LoginScreen from '../screens/customer/LoginScreen';
import AdminLoginScreen from '../screens/admin/AdminLoginScreen';

import CustomerNavigator from './CustomerNavigator';
import AdminNavigator from './AdminNavigator';

import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/appStore';

const PublicStack = createNativeStackNavigator<PublicStackParamList>();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f8fafc',
    card: '#ffffff',
    text: '#0f172a',
    border: '#e2e8f0',
    primary: '#059669',
  },
};

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#059669" />
      <Text style={styles.loadingText}>Loading Vyapkart...</Text>
    </View>
  );
}

function PublicNavigator() {
  const hasCompletedOnboarding = useAppStore(
    state => state.hasCompletedOnboarding
  );

  return (
    <PublicStack.Navigator
      initialRouteName={hasCompletedOnboarding ? 'Login' : 'Splash'}
      screenOptions={{
        headerShown: false,
      }}
    >
      <PublicStack.Screen name="Splash" component={SplashScreen} />
      <PublicStack.Screen name="Login" component={LoginScreen} />
      <PublicStack.Screen name="AdminLogin" component={AdminLoginScreen} />
    </PublicStack.Navigator>
  );
}

export default function AppNavigator() {
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isHydrated = useAuthStore(state => state.isHydrated);

  const setActiveRoleView = useAppStore(state => state.setActiveRoleView);
  const setAppReady = useAppStore(state => state.setAppReady);

  useEffect(() => {
    if (isHydrated) {
      setAppReady(true);
    }
  }, [isHydrated, setAppReady]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setActiveRoleView('public');
      return;
    }

    if (user.role === 'admin') {
      setActiveRoleView('admin');
      return;
    }

    setActiveRoleView('customer');
  }, [isAuthenticated, user, setActiveRoleView]);

  if (!isHydrated) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer theme={theme}>
      {!isAuthenticated || !user ? (
        <PublicNavigator />
      ) : user.role === 'admin' ? (
        <AdminNavigator />
      ) : (
        <CustomerNavigator />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
});