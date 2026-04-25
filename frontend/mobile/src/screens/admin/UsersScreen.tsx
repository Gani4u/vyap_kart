import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';

import type { AdminTabParamList } from '../../navigation/types';
import type { User } from '../../types/models';
import { users } from '../../data';

type Props = BottomTabScreenProps<AdminTabParamList, 'UsersTab'>;

export default function UsersScreen(_props: Props) {
  const [query, setQuery] = useState('');
  const [userList, setUserList] = useState<User[]>([]);

  const refresh = useCallback(() => {
    setUserList([...users]);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const filteredUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return userList;
    }

    return userList.filter(item => {
      return (
        item.name.toLowerCase().includes(normalized) ||
        item.mobile.toLowerCase().includes(normalized) ||
        item.role.toLowerCase().includes(normalized)
      );
    });
  }, [query, userList]);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Users</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by name, mobile, role"
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>Mobile: {item.mobile}</Text>
            {!!item.email && <Text style={styles.meta}>Email: {item.email}</Text>}
            <Text
              style={[
                styles.roleBadge,
                item.role === 'admin' ? styles.adminBadge : styles.customerBadge,
              ]}
            >
              {item.role}
            </Text>
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
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  meta: {
    marginTop: 6,
    fontSize: 13,
    color: '#64748b',
  },
  roleBadge: {
    marginTop: 10,
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  adminBadge: {
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
  },
  customerBadge: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
});