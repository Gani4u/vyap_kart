import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type {
  AdminRootStackParamList,
  AdminTabParamList,
} from '../../navigation/types';
import type { Product } from '../../types/models';

import { categories, products } from '../../data';

type Props = BottomTabScreenProps<AdminTabParamList, 'ProductsTab'>;

export default function ProductsScreen(_props: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminRootStackParamList>>();

  const [query, setQuery] = useState('');
  const [productList, setProductList] = useState<Product[]>([]);

  const refreshProducts = useCallback(() => {
    setProductList([...products]);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshProducts();
    }, [refreshProducts])
  );

  const categoryMap = useMemo(() => {
    return categories.reduce<Record<string, string>>((acc, item) => {
      acc[item.id] = item.name;
      return acc;
    }, {});
  }, []);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return productList;
    }

    return productList.filter(item => {
      return (
        item.name.toLowerCase().includes(normalized) ||
        item.brand.toLowerCase().includes(normalized) ||
        item.slug.toLowerCase().includes(normalized)
      );
    });
  }, [productList, query]);

  const toggleProductStatus = (productId: string) => {
    const product = products.find(item => item.id === productId);

    if (!product) {
      return;
    }

    product.isActive = !product.isActive;
    refreshProducts();

    Alert.alert(
      'Updated',
      `${product.name} is now ${product.isActive ? 'active' : 'inactive'}.`
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Products</Text>

        <Pressable
          style={styles.addButton}
          onPress={() => navigation.navigate('ProductForm', { mode: 'create' })}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search product by name or brand"
        value={query}
        onChangeText={setQuery}
      />

      <View style={styles.topActions}>
        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Categories')}
        >
          <Text style={styles.secondaryButtonText}>Categories</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Coupons')}
        >
          <Text style={styles.secondaryButtonText}>Coupons</Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.images[0] }} style={styles.image} />

            <View style={styles.content}>
              <Text style={styles.name} numberOfLines={2}>
                {item.name}
              </Text>

              <Text style={styles.meta}>
                {item.brand} • {categoryMap[item.categoryId] || item.categoryId}
              </Text>

              <Text style={styles.price}>
                ₹{item.sellingPrice}{' '}
                <Text style={styles.mrp}>₹{item.mrp}</Text>
              </Text>

              <Text
                style={[
                  styles.stock,
                  item.stock <= 5 && styles.lowStock,
                ]}
              >
                Stock: {item.stock}
              </Text>

              <View style={styles.badgeRow}>
                <Text
                  style={[
                    styles.badge,
                    item.isActive ? styles.activeBadge : styles.inactiveBadge,
                  ]}
                >
                  {item.isActive ? 'Active' : 'Inactive'}
                </Text>

                {item.isFeatured && (
                  <Text style={[styles.badge, styles.featuredBadge]}>
                    Featured
                  </Text>
                )}
              </View>

              <View style={styles.actionsRow}>
                <Pressable
                  style={styles.editButton}
                  onPress={() =>
                    navigation.navigate('ProductForm', {
                      mode: 'edit',
                      productId: item.id,
                    })
                  }
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </Pressable>

                <Pressable
                  style={styles.toggleButton}
                  onPress={() => toggleProductStatus(item.id)}
                >
                  <Text style={styles.toggleButtonText}>
                    {item.isActive ? 'Deactivate' : 'Activate'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptySubTitle}>
              Add products or change search text.
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
    paddingTop: 16,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  addButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  searchInput: {
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0f172a',
  },
  topActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
  },
  secondaryButton: {
    marginRight: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '700',
  },
  list: {
    padding: 16,
    paddingTop: 8,
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
    width: 88,
    height: 88,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#f1f5f9',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  meta: {
    marginTop: 6,
    fontSize: 12,
    color: '#64748b',
  },
  price: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  mrp: {
    color: '#94a3b8',
    textDecorationLine: 'line-through',
    fontSize: 13,
  },
  stock: {
    marginTop: 8,
    fontSize: 13,
    color: '#065f46',
    fontWeight: '700',
  },
  lowStock: {
    color: '#dc2626',
  },
  badgeRow: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 6,
  },
  activeBadge: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  inactiveBadge: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  featuredBadge: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  actionsRow: {
    marginTop: 8,
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 10,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  toggleButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  toggleButtonText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  emptySubTitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});