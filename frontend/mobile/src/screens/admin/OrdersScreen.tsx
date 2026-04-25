import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';

import type { AdminTabParamList } from '../../navigation/types';
import { inventory, products } from '../../data';

type Props = BottomTabScreenProps<AdminTabParamList, 'OrdersTab'>;

export default function OrdersScreen(_props: Props) {
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => {
    setTick(prev => prev + 1);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const inventoryList = useMemo(() => {
    return inventory.map(item => {
      const product = products.find(productItem => productItem.id === item.productId);

      return {
        ...item,
        productName: product?.name || item.productId,
      };
    });
  }, [tick]);

  const updateQty = (productId: string, change: number) => {
    const inventoryItem = inventory.find(item => item.productId === productId);
    const product = products.find(item => item.id === productId);

    if (!inventoryItem || !product) {
      return;
    }

    const nextQty = Math.max(inventoryItem.availableQty + change, 0);
    inventoryItem.availableQty = nextQty;
    product.stock = nextQty;

    refresh();
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Inventory</Text>

      <FlatList
        data={inventoryList}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isLowStock = item.availableQty <= item.reorderLevel;

          return (
            <View style={styles.card}>
              <Text style={styles.name}>{item.productName}</Text>

              <Text style={styles.meta}>
                Available: {item.availableQty} | Reserved: {item.reservedQty}
              </Text>

              <Text
                style={[
                  styles.reorderText,
                  isLowStock && styles.lowStockText,
                ]}
              >
                Reorder Level: {item.reorderLevel}
              </Text>

              <View style={styles.actionsRow}>
                <Pressable
                  style={styles.qtyButton}
                  onPress={() => updateQty(item.productId, -1)}
                >
                  <Text style={styles.qtyButtonText}>-1</Text>
                </Pressable>

                <Pressable
                  style={styles.qtyButton}
                  onPress={() => updateQty(item.productId, 1)}
                >
                  <Text style={styles.qtyButtonText}>+1</Text>
                </Pressable>

                <Pressable
                  style={styles.qtyButton}
                  onPress={() => updateQty(item.productId, 5)}
                >
                  <Text style={styles.qtyButtonText}>+5</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
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
    marginBottom: 8,
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
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  meta: {
    marginTop: 8,
    fontSize: 13,
    color: '#475569',
  },
  reorderText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  lowStockText: {
    color: '#dc2626',
  },
  actionsRow: {
    marginTop: 14,
    flexDirection: 'row',
  },
  qtyButton: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 10,
  },
  qtyButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});