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

import type { DeliveryZone } from '../../types/models';
import { zones } from '../../data';

export default function DeliveryZonesScreen() {
  const [zoneList, setZoneList] = useState<DeliveryZone[]>([]);
  const [name, setName] = useState('');
  const [city, setCity] = useState('Ilkal');
  const [pincode, setPincode] = useState('587125');
  const [areasInput, setAreasInput] = useState('');

  const refresh = useCallback(() => {
    setZoneList([...zones]);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const handleAddZone = () => {
    if (!name.trim() || !city.trim() || !pincode.trim() || !areasInput.trim()) {
      Alert.alert('Validation Error', 'Fill all zone fields.');
      return;
    }

    const areas = areasInput
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);

    zones.unshift({
      id: `z-${Date.now()}`,
      name: name.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
      areas,
      isActive: true,
    });

    setName('');
    setCity('Ilkal');
    setPincode('587125');
    setAreasInput('');
    refresh();

    Alert.alert('Success', 'Delivery zone added.');
  };

  const toggleZone = (zoneId: string) => {
    const zone = zones.find(item => item.id === zoneId);

    if (!zone) {
      return;
    }

    zone.isActive = !zone.isActive;
    refresh();
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Delivery Zones</Text>

      <View style={styles.formCard}>
        <TextInput
          style={styles.input}
          placeholder="Zone name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={setCity}
        />

        <TextInput
          style={styles.input}
          placeholder="Pincode"
          value={pincode}
          onChangeText={setPincode}
          keyboardType="number-pad"
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Areas comma separated"
          value={areasInput}
          onChangeText={setAreasInput}
          multiline
        />

        <Pressable style={styles.addButton} onPress={handleAddZone}>
          <Text style={styles.addButtonText}>Add Zone</Text>
        </Pressable>
      </View>

      <FlatList
        data={zoneList}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>
              {item.city} - {item.pincode}
            </Text>
            <Text style={styles.meta}>Areas: {item.areas.join(', ')}</Text>

            <Pressable
              style={[
                styles.statusButton,
                item.isActive ? styles.activeButton : styles.inactiveButton,
              ]}
              onPress={() => toggleZone(item.id)}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  item.isActive ? styles.activeText : styles.inactiveText,
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
  formCard: {
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
    marginBottom: 10,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  addButton: {
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
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  meta: {
    marginTop: 6,
    fontSize: 13,
    color: '#64748b',
  },
  statusButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
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
  activeText: {
    color: '#065f46',
  },
  inactiveText: {
    color: '#991b1b',
  },
});