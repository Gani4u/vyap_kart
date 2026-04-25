import React, { useEffect, useMemo, useState } from 'react';
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
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { CustomerRootStackParamList } from '../../navigation/types';
import { productService } from '../../services/productService';
import type { Product } from '../../types/models';

type Props = NativeStackScreenProps<CustomerRootStackParamList, 'ProductList'>;
type SortOption = 'default' | 'low' | 'high';

export default function ProductListScreen({ route, navigation }: Props) {
  const categoryId = route.params?.categoryId;
  const headerTitle = route.params?.title || 'All Products';

  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    navigation.setOptions({ title: headerTitle });
  }, [headerTitle, navigation]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        const data = categoryId
          ? await productService.getProductsByCategory(categoryId)
          : await productService.getAllProducts();

        setProducts(data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to load products.';
        Alert.alert('Error', message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryId]);

  const sortedProducts = useMemo(() => {
    const items = [...products];

    if (sortBy === 'low') {
      items.sort((a, b) => a.sellingPrice - b.sellingPrice);
    }

    if (sortBy === 'high') {
      items.sort((a, b) => b.sellingPrice - a.sellingPrice);
    }

    return items;
  }, [products, sortBy]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.sortRow}>
        <Text style={styles.resultCount}>{sortedProducts.length} products</Text>

        <View style={styles.sortActions}>
          <Pressable
            style={[styles.sortButton, sortBy === 'default' && styles.sortButtonActive]}
            onPress={() => setSortBy('default')}
          >
            <Text style={[styles.sortText, sortBy === 'default' && styles.sortTextActive]}>
              Default
            </Text>
          </Pressable>
          <Pressable
            style={[styles.sortButton, sortBy === 'low' && styles.sortButtonActive]}
            onPress={() => setSortBy('low')}
          >
            <Text style={[styles.sortText, sortBy === 'low' && styles.sortTextActive]}>
              Low
            </Text>
          </Pressable>
          <Pressable
            style={[styles.sortButton, sortBy === 'high' && styles.sortButtonActive]}
            onPress={() => setSortBy('high')}
          >
            <Text style={[styles.sortText, sortBy === 'high' && styles.sortTextActive]}>
              High
            </Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={sortedProducts}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              navigation.navigate('ProductDetails', { productId: item.id })
            }
          >
            <Image source={{ uri: item.images[0] }} style={styles.image} />
            <View style={styles.content}>
              <Text style={styles.name} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.brand}>{item.brand}</Text>

              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{item.sellingPrice}</Text>
                <Text style={styles.mrp}>₹{item.mrp}</Text>
              </View>

              <Text
                style={[
                  styles.stock,
                  item.stock <= 0 && styles.stockOut,
                ]}
              >
                {item.stock > 0 ? `${item.stock} available` : 'Out of stock'}
              </Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No products available</Text>
            <Text style={styles.emptySubTitle}>
              Products will appear here once available.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  center: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortRow: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  resultCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 10,
  },
  sortActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sortButton: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  sortButtonActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  sortText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  sortTextActive: {
    color: '#ffffff',
  },
  list: {
    padding: 16,
    paddingTop: 4,
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
    width: 90,
    height: 90,
    borderRadius: 14,
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  brand: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0f172a',
    marginRight: 8,
  },
  mrp: {
    fontSize: 13,
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  stock: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    color: '#16a34a',
  },
  stockOut: {
    color: '#dc2626',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  emptySubTitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});