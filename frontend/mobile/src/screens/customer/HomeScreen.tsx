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
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type {
  CustomerRootStackParamList,
  CustomerTabParamList,
} from '../../navigation/types';
import { productService } from '../../services/productService';
import { useAppStore } from '../../store/appStore';
import type { Banner, Category, Product } from '../../types/models';

type Props = BottomTabScreenProps<CustomerTabParamList, 'HomeTab'>;

export default function HomeScreen(_props: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<CustomerRootStackParamList>>();

  const currentCity = useAppStore(state => state.currentCity);
  const currentPincode = useAppStore(state => state.currentPincode);
  const deliveryPromise = useAppStore(state => state.deliveryPromise);

  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [bannerData, categoryData, productData] = await Promise.all([
          productService.getBanners(),
          productService.getCategories(),
          productService.getFeaturedProducts(),
        ]);

        setBanners(bannerData);
        setCategories(categoryData);
        setFeaturedProducts(productData);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to load home screen.';
        Alert.alert('Error', message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Vyapkart</Text>
        <Text style={styles.heroSubTitle}>
          Fast city delivery in {currentCity} - {currentPincode}
        </Text>
        <Text style={styles.heroDescription}>{deliveryPromise}</Text>
      </View>

      <Text style={styles.sectionTitle}>Offers</Text>
      {banners.map(banner => (
        <Pressable key={banner.id} style={styles.bannerCard}>
          <Image source={{ uri: banner.image }} style={styles.bannerImage} />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>{banner.title}</Text>
            {!!banner.subtitle && (
              <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
            )}
          </View>
        </Pressable>
      ))}

      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <Pressable onPress={() => navigation.navigate('CustomerTabs', { screen: 'CategoriesTab' })}>
          <Text style={styles.linkText}>View All</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      >
        {categories.map(category => (
          <Pressable
            key={category.id}
            style={styles.categoryCard}
            onPress={() =>
              navigation.navigate('ProductList', {
                categoryId: category.id,
                title: category.name,
              })
            }
          >
            <Image source={{ uri: category.image }} style={styles.categoryImage} />
            <Text style={styles.categoryName}>{category.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
        <Pressable onPress={() => navigation.navigate('ProductList')}>
          <Text style={styles.linkText}>Browse More</Text>
        </Pressable>
      </View>

      {featuredProducts.map(product => (
        <Pressable
          key={product.id}
          style={styles.productCard}
          onPress={() =>
            navigation.navigate('ProductDetails', { productId: product.id })
          }
        >
          <Image source={{ uri: product.images[0] }} style={styles.productImage} />
          <View style={styles.productContent}>
            <View style={styles.rowBetween}>
              <Text style={styles.productName} numberOfLines={2}>
                {product.name}
              </Text>
              <Text style={styles.deliveryBadge}>{product.deliveryType}</Text>
            </View>

            <Text style={styles.brandText}>{product.brand}</Text>

            <View style={styles.priceRow}>
              <Text style={styles.sellingPrice}>₹{product.sellingPrice}</Text>
              <Text style={styles.mrp}>₹{product.mrp}</Text>
            </View>

            <Text style={styles.stockText}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </Text>
          </View>
        </Pressable>
      ))}
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
  heroCard: {
    backgroundColor: '#059669',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  heroSubTitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#d1fae5',
    fontWeight: '600',
  },
  heroDescription: {
    marginTop: 10,
    fontSize: 14,
    color: '#ecfdf5',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  bannerCard: {
    height: 160,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,
    backgroundColor: '#e2e8f0',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  bannerSubtitle: {
    color: '#e2e8f0',
    fontSize: 13,
    marginTop: 4,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  linkText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '700',
  },
  horizontalList: {
    paddingBottom: 8,
  },
  categoryCard: {
    width: 110,
    marginRight: 12,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryImage: {
    width: '100%',
    height: 78,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  productImage: {
    width: 92,
    height: 92,
    borderRadius: 14,
    marginRight: 12,
    backgroundColor: '#f1f5f9',
  },
  productContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginRight: 8,
  },
  deliveryBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065f46',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    textTransform: 'uppercase',
  },
  brandText: {
    marginTop: 6,
    fontSize: 13,
    color: '#64748b',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  sellingPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginRight: 8,
  },
  mrp: {
    fontSize: 13,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  stockText: {
    marginTop: 8,
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '600',
  },
});