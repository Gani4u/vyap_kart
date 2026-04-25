import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type {
  CustomerRootStackParamList,
  CustomerTabParamList,
} from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

type Props = BottomTabScreenProps<CustomerTabParamList, 'CartTab'>;

export default function CartScreen(_props: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<CustomerRootStackParamList>>();

  const user = useAuthStore(state => state.user);

  const cart = useCartStore(state => state.cart);
  const deliveryFee = useCartStore(state => state.deliveryFee);
  const grandTotal = useCartStore(state => state.grandTotal);
  const isLoading = useCartStore(state => state.isLoading);
  const loadCart = useCartStore(state => state.loadCart);
  const updateItem = useCartStore(state => state.updateItem);
  const removeItem = useCartStore(state => state.removeItem);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadCart(user.id);
      }
    }, [user, loadCart])
  );

  const handleUpdate = async (productId: string, nextQty: number) => {
    if (!user) return;

    try {
      await updateItem(user.id, productId, nextQty);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update cart.';
      Alert.alert('Cart Error', message);
    }
  };

  const handleRemove = async (productId: string) => {
    if (!user) return;

    try {
      await removeItem(user.id, productId);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to remove item.';
      Alert.alert('Cart Error', message);
    }
  };

  if (isLoading && !cart) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  const hasItems = !!cart && cart.items.length > 0;

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>My Cart</Text>

      {!hasItems ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubTitle}>
            Add some products to continue shopping.
          </Text>

          <Pressable
            style={styles.primaryButton}
            onPress={() =>
              navigation.navigate('CustomerTabs', { screen: 'HomeTab' })
            }
          >
            <Text style={styles.primaryButtonText}>Go to Home</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            data={cart.items}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image source={{ uri: item.product.images[0] }} style={styles.image} />

                <View style={styles.content}>
                  <Text style={styles.name} numberOfLines={2}>
                    {item.product.name}
                  </Text>
                  <Text style={styles.brand}>{item.product.brand}</Text>
                  <Text style={styles.price}>₹{item.priceSnapshot}</Text>

                  <View style={styles.actionsRow}>
                    <View style={styles.qtyBox}>
                      <Pressable
                        style={styles.qtyButton}
                        onPress={() =>
                          handleUpdate(item.productId, item.quantity - 1)
                        }
                      >
                        <Text style={styles.qtyButtonText}>-</Text>
                      </Pressable>

                      <Text style={styles.qtyValue}>{item.quantity}</Text>

                      <Pressable
                        style={styles.qtyButton}
                        onPress={() =>
                          handleUpdate(item.productId, item.quantity + 1)
                        }
                      >
                        <Text style={styles.qtyButtonText}>+</Text>
                      </Pressable>
                    </View>

                    <Pressable onPress={() => handleRemove(item.productId)}>
                      <Text style={styles.removeText}>Remove</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
          />

          <View style={styles.summaryCard}>
            <View style={styles.rowBetween}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{cart.subtotal}</Text>
            </View>

            <View style={styles.rowBetween}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>₹{deliveryFee}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.rowBetween}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>₹{grandTotal}</Text>
            </View>

            <Pressable
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Address')}
            >
              <Text style={styles.primaryButtonText}>Proceed to Checkout</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 16,
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
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  image: {
    width: 84,
    height: 84,
    borderRadius: 12,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  brand: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748b',
  },
  price: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  actionsRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  qtyValue: {
    marginHorizontal: 12,
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  removeText: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#059669',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  emptySubTitle: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
    color: '#64748b',
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