import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { AdminRootStackParamList } from '../../navigation/types';
import type { DeliveryType, Product } from '../../types/models';
import { categories, inventory, products } from '../../data';

type Props = NativeStackScreenProps<AdminRootStackParamList, 'ProductForm'>;

export default function ProductFormScreen({ route, navigation }: Props) {
  const isEdit = route.params.mode === 'edit';
  const editingProductId = isEdit ? route.params.productId : null;

  const editingProduct = useMemo(() => {
    if (!editingProductId) {
      return null;
    }

    return products.find(item => item.id === editingProductId) || null;
  }, [editingProductId]);

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [mrp, setMrp] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [stock, setStock] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState('kg');
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('24hr');

  useEffect(() => {
    if (!editingProduct) {
      return;
    }

    setName(editingProduct.name);
    setBrand(editingProduct.brand);
    setDescription(editingProduct.description);
    setCategoryId(editingProduct.categoryId);
    setMrp(String(editingProduct.mrp));
    setSellingPrice(String(editingProduct.sellingPrice));
    setStock(String(editingProduct.stock));
    setWeight(String(editingProduct.weight));
    setUnit(editingProduct.unit);
    setImageUrl(editingProduct.images[0] || '');
    setIsFeatured(editingProduct.isFeatured);
    setIsActive(editingProduct.isActive);
    setDeliveryType(editingProduct.deliveryType);
  }, [editingProduct]);

  const handleSave = () => {
    if (
      !name.trim() ||
      !brand.trim() ||
      !description.trim() ||
      !categoryId ||
      !mrp.trim() ||
      !sellingPrice.trim() ||
      !stock.trim() ||
      !weight.trim() ||
      !unit.trim()
    ) {
      Alert.alert('Validation Error', 'Please fill all required fields.');
      return;
    }

    const parsedMrp = Number(mrp);
    const parsedSellingPrice = Number(sellingPrice);
    const parsedStock = Number(stock);
    const parsedWeight = Number(weight);

    if (
      Number.isNaN(parsedMrp) ||
      Number.isNaN(parsedSellingPrice) ||
      Number.isNaN(parsedStock) ||
      Number.isNaN(parsedWeight)
    ) {
      Alert.alert('Validation Error', 'MRP, price, stock and weight must be numeric.');
      return;
    }

    if (parsedSellingPrice > parsedMrp) {
      Alert.alert('Validation Error', 'Selling price cannot be greater than MRP.');
      return;
    }

    const normalizedName = name.trim();
    const slug = normalizedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const productPayload: Product = {
      id: editingProduct?.id || `p${Date.now()}`,
      name: normalizedName,
      slug,
      description: description.trim(),
      categoryId,
      brand: brand.trim(),
      images: [
        imageUrl.trim() ||
          `https://placehold.co/600x600/png?text=${encodeURIComponent(normalizedName)}`,
      ],
      mrp: parsedMrp,
      sellingPrice: parsedSellingPrice,
      stock: parsedStock,
      weight: parsedWeight,
      unit: unit.trim(),
      isActive,
      isFeatured,
      deliveryType,
    };

    if (isEdit && editingProduct) {
      const productIndex = products.findIndex(item => item.id === editingProduct.id);

      if (productIndex >= 0) {
        products[productIndex] = productPayload;
      }

      const inventoryItem = inventory.find(item => item.productId === editingProduct.id);
      if (inventoryItem) {
        inventoryItem.availableQty = parsedStock;
      }

      Alert.alert('Success', 'Product updated successfully.');
      navigation.goBack();
      return;
    }

    products.unshift(productPayload);

    inventory.unshift({
      id: `inv-${Date.now()}`,
      productId: productPayload.id,
      availableQty: parsedStock,
      reservedQty: 0,
      reorderLevel: 5,
    });

    Alert.alert('Success', 'Product created successfully.');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{isEdit ? 'Edit Product' : 'Create Product'}</Text>

      <Text style={styles.label}>Product Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Brand</Text>
      <TextInput style={styles.input} value={brand} onChangeText={setBrand} />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.chipsRow}>
        {categories.map(item => (
          <Pressable
            key={item.id}
            style={[styles.chip, categoryId === item.id && styles.chipActive]}
            onPress={() => setCategoryId(item.id)}
          >
            <Text style={[styles.chipText, categoryId === item.id && styles.chipTextActive]}>
              {item.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>MRP</Text>
      <TextInput
        style={styles.input}
        value={mrp}
        onChangeText={setMrp}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Selling Price</Text>
      <TextInput
        style={styles.input}
        value={sellingPrice}
        onChangeText={setSellingPrice}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Stock</Text>
      <TextInput
        style={styles.input}
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Weight</Text>
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Unit</Text>
      <TextInput style={styles.input} value={unit} onChangeText={setUnit} />

      <Text style={styles.label}>Image URL</Text>
      <TextInput
        style={styles.input}
        value={imageUrl}
        onChangeText={setImageUrl}
        placeholder="Optional image URL"
      />

      <Text style={styles.label}>Delivery Type</Text>
      <View style={styles.chipsRow}>
        {(['24hr', 'same-day', 'next-day'] as DeliveryType[]).map(item => (
          <Pressable
            key={item}
            style={[styles.chip, deliveryType === item && styles.chipActive]}
            onPress={() => setDeliveryType(item)}
          >
            <Text style={[styles.chipText, deliveryType === item && styles.chipTextActive]}>
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.toggleRow}>
        <Pressable
          style={[styles.toggleButton, isFeatured && styles.toggleButtonActive]}
          onPress={() => setIsFeatured(prev => !prev)}
        >
          <Text
            style={[
              styles.toggleButtonText,
              isFeatured && styles.toggleButtonTextActive,
            ]}
          >
            Featured
          </Text>
        </Pressable>

        <Pressable
          style={[styles.toggleButton, isActive && styles.toggleButtonActive]}
          onPress={() => setIsActive(prev => !prev)}
        >
          <Text
            style={[
              styles.toggleButtonText,
              isActive && styles.toggleButtonTextActive,
            ]}
          >
            Active
          </Text>
        </Pressable>
      </View>

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>
          {isEdit ? 'Update Product' : 'Create Product'}
        </Text>
      </Pressable>
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
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0f172a',
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  chipText: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  toggleRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  toggleButton: {
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  toggleButtonActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  toggleButtonText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '800',
  },
  toggleButtonTextActive: {
    color: '#ffffff',
  },
  saveButton: {
    marginTop: 22,
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
});