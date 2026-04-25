import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function SupportScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>Help & Support</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Customer Care</Text>
        <Text style={styles.value}>Phone: +91 98765 43210</Text>
        <Text style={styles.value}>Email: support@vyapkart.com</Text>
        <Text style={styles.note}>
          Support timing: 8:00 AM to 9:00 PM, all days
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Delivery Support</Text>
        <Text style={styles.value}>Service area: Ilkal - 587125</Text>
        <Text style={styles.note}>
          For delivery issues, contact support with your order ID.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Returns and Cancellations
        </Text>
        <Text style={styles.note}>
          Returns and cancellations are subject to order status and product type.
          This is a mock MVP flow and policies can be added later.
        </Text>
      </View>
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
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 10,
  },
  value: {
    fontSize: 15,
    color: '#334155',
    marginBottom: 8,
  },
  note: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
});