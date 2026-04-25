import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { CustomerRootStackParamList } from '../../navigation/types';
import { productService } from '../../services/productService';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import type { Product } from '../../types/models';

type Props = NativeStackScreenProps<CustomerRootStackParamList, 'ProductDetails'>;

export default function ProductDetailsScreen({ route, navigation }: Props) {
  const { productId } = route.params;

  const user = useAuthStore(state => state.user);
  const addItem = useCartStore(state => state.addItem);
  const cartLoading = useCartStore(state => state.isLoading);

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);

        const [productData, relatedData] = await Promise.all([
          productService.getProductById(productId),
          productService.getRelatedProducts(productId),
        ]);

        setProduct(productData);
        setRelatedProducts(relatedData);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to load product.';
        Alert.alert('Error', message);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!user || !product) return;

    try {
      await addItem(user.id, product.id, 1);

      Alert.alert('Added to cart', `${product.name} has been added to your cart.`, [
        { text: 'Continue' },
        {
          text: 'Go to Cart',
          onPress: () =>
            navigation.navigate('CustomerTabs', {
              screen: 'CartTab',
            }),
        },
      ]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to add to cart.';
      Alert.alert('Cart Error', message);
    }
  };

  if (loading || !product) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  const savings = product.mrp - product.sellingPrice;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Image source={{ uri: product.images[0] }} style={styles.mainImage} />

      <View style={styles.card}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.brand}>{product.brand}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{product.sellingPrice}</Text>
          <Text style={styles.mrp}>₹{product.mrp}</Text>
          <Text style={styles.savings}>Save ₹{savings}</Text>
        </View>

        <Text style={styles.unitText}>
          {product.weight} {product.unit}
        </Text>

        <Text style={styles.deliveryType}>
          Delivery type: {product.deliveryType}
        </Text>

        <Text
          style={[
            styles.stock,
            product.stock <= 0 && styles.stockOut,
          ]}
        >
          {product.stock > 0 ? `${product.stock} items available` : 'Currently out of stock'}
        </Text>

        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>

        <Pressable
          style={[
            styles.primaryButton,
            product.stock <= 0 && styles.disabledButton,
          ]}
          disabled={product.stock <= 0 || cartLoading}
          onPress={handleAddToCart}
        >
          <Text style={styles.primaryButtonText}>
            {product.stock <= 0
              ? 'Out of Stock'
              : cartLoading
              ? 'Please wait...'
              : 'Add to Cart'}
          </Text>
        </Pressable>
      </View>

      {relatedProducts.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Related products</Text>

          {relatedProducts.map(item => (
            <Pressable
              key={item.id}
              style={styles.relatedCard}
              onPress={() =>
                navigation.push('ProductDetails', { productId: item.id })
              }
            >
              <Image source={{ uri: item.images[0] }} style={styles.relatedImage} />
              <View style={styles.relatedContent}>
                <Text style={styles.relatedName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.relatedPrice}>₹{item.sellingPrice}</Text>
              </View>
            </Pressable>
          ))}
        </>
      )}
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
  mainImage: {
    width: '100%',
    height: 300,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  brand: {
    marginTop: 6,
    fontSize: 14,
    color: '#64748b',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 14,
  },
  price: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    marginRight: 10,
  },
  mrp: {
    fontSize: 15,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
    marginRight: 10,
  },
  savings: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16a34a',
  },
  unitText: {
    marginTop: 10,
    fontSize: 14,
    color: '#475569',
  },
  deliveryType: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '700',
    color: '#065f46',
  },
  stock: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '700',
    color: '#16a34a',
  },
  stockOut: {
    color: '#dc2626',
  },
  descriptionTitle: {
    marginTop: 18,
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  description: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
  },
  primaryButton: {
    marginTop: 20,
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#94a3b8',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  sectionTitle: {
    marginTop: 22,
    marginBottom: 12,
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  relatedCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  relatedImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },
  relatedContent: {
    flex: 1,
    justifyContent: 'center',
  },
  relatedName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  relatedPrice: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '800',
    color: '#059669',
  },
});