import React, { useEffect, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type {
  CustomerRootStackParamList,
  CustomerTabParamList,
} from '../../navigation/types';
import { productService } from '../../services/productService';
import type { Category } from '../../types/models';

type Props = BottomTabScreenProps<CustomerTabParamList, 'CategoriesTab'>;

export default function CategoriesScreen(_props: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<CustomerRootStackParamList>>();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await productService.getCategories();
        setCategories(data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to load categories.';
        Alert.alert('Error', message);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <FlatList
      data={categories}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Pressable
          style={styles.card}
          onPress={() =>
            navigation.navigate('ProductList', {
              categoryId: item.id,
              title: item.name,
            })
          }
        >
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.content}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.subText}>Browse products in this category</Text>
          </View>
        </Pressable>
      )}
      ListHeaderComponent={
        <Text style={styles.headerTitle}>Shop by categories</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  image: {
    width: 86,
    height: 86,
    borderRadius: 14,
    marginRight: 12,
    backgroundColor: '#f1f5f9',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  subText: {
    marginTop: 6,
    fontSize: 13,
    color: '#64748b',
  },
});