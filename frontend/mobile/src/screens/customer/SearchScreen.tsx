import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type {
  CustomerRootStackParamList,
  CustomerTabParamList,
} from '../../navigation/types';
import { productService } from '../../services/productService';
import type { Product } from '../../types/models';

type Props = BottomTabScreenProps<CustomerTabParamList, 'SearchTab'>;

export default function SearchScreen(_props: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<CustomerRootStackParamList>>();

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const runSearch = async () => {
      try {
        setLoading(true);
        const results = query.trim()
          ? await productService.searchProducts(query)
          : await productService.getAllProducts();

        setProducts(results);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Search failed.';
        Alert.alert('Error', message);
      } finally {
        setLoading(false);
      }
    };

    runSearch();
  }, [query]);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Search Products</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by product, brand, keyword..."
        value={query}
        onChangeText={setQuery}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#059669" />
        </View>
      ) : (
        <FlatList
          data={products}
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
                <Text style={styles.stock}>
                  {item.stock > 0 ? 'Available' : 'Out of stock'}
                </Text>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No products found</Text>
              <Text style={styles.emptySubTitle}>
                Try another keyword or browse categories.
              </Text>
            </View>
          }
        />
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
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    paddingHorizontal: 16,
  },
  searchInput: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0f172a',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 18,
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
    fontWeight: '600',
    color: '#16a34a',
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