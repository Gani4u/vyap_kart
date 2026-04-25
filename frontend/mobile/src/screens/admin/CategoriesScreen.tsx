import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import type { Category } from '../../types/models';
import { categories } from '../../data';

export default function CategoriesScreen() {
  const [name, setName] = useState('');
  const [categoryList, setCategoryList] = useState<Category[]>([]);

  const refresh = useCallback(() => {
    setCategoryList([...categories]);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const handleAddCategory = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      Alert.alert('Validation Error', 'Enter category name.');
      return;
    }

    const slug = trimmedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    categories.unshift({
      id: `c${Date.now()}`,
      name: trimmedName,
      slug,
      image: `https://placehold.co/400x400/png?text=${encodeURIComponent(trimmedName)}`,
      isActive: true,
    });

    setName('');
    refresh();
    Alert.alert('Success', 'Category added.');
  };

  const toggleStatus = (categoryId: string) => {
    const item = categories.find(cat => cat.id === categoryId);

    if (!item) {
      return;
    }

    item.isActive = !item.isActive;
    refresh();
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Categories</Text>

      <View style={styles.addCard}>
        <TextInput
          style={styles.input}
          placeholder="Enter category name"
          value={name}
          onChangeText={setName}
        />

        <Pressable style={styles.addButton} onPress={handleAddCategory}>
          <Text style={styles.addButtonText}>Add Category</Text>
        </Pressable>
      </View>

      <FlatList
        data={categoryList}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.content}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.slug}>{item.slug}</Text>
            </View>

            <Pressable
              style={[
                styles.statusButton,
                item.isActive ? styles.activeButton : styles.inactiveButton,
              ]}
              onPress={() => toggleStatus(item.id)}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  item.isActive ? styles.activeButtonText : styles.inactiveButtonText,
                ]}
              >
                {item.isActive ? 'Active' : 'Inactive'}
              </Text>
            </Pressable>
          </View>
        )}
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
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  addCard: {
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0f172a',
  },
  addButton: {
    marginTop: 12,
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  slug: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748b',
  },
  statusButton: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  activeButton: {
    backgroundColor: '#d1fae5',
  },
  inactiveButton: {
    backgroundColor: '#fee2e2',
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: '800',
  },
  activeButtonText: {
    color: '#065f46',
  },
  inactiveButtonText: {
    color: '#991b1b',
  },
});