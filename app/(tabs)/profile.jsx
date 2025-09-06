import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';

const { width } = Dimensions.get('window');
const horizontalPadding = width * 0.06;
const RED_ACCENT = '#ff6f6f';
const TEXT_RED = '#d42525';
const LIGHT_RED = '#ffeaea';

export default function Profile() {
  const { user } = useUser(); // Clerk hook

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: TEXT_RED, fontSize: RFValue(16) }}>Loading user info...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: user.profileImageUrl || 'https://i.pravatar.cc/150?img=12' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.fullName || 'User Name'}</Text>
        <Text style={styles.email}>{user.primaryEmailAddress?.emailAddress || 'No Email'}</Text>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        {user.primaryPhoneNumber && (
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={RFValue(20)} color={RED_ACCENT} style={{ marginRight: 10 }} />
            <Text style={styles.infoText}>{user.primaryPhoneNumber.phoneNumber}</Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={RFValue(20)} color={RED_ACCENT} style={{ marginRight: 10 }} />
          <Text style={styles.infoText}>{user.primaryEmailAddress?.emailAddress}</Text>
        </View>
        {/* Additional stats can be added here if you have them */}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="create-outline" size={RFValue(20)} color="#fff" />
          <Text style={styles.actionText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#fff', borderWidth: 1, borderColor: RED_ACCENT }]}>
          <Ionicons name="log-out-outline" size={RFValue(20)} color={RED_ACCENT} />
          <Text style={[styles.actionText, { color: RED_ACCENT }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalPadding,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: RED_ACCENT,
    marginBottom: 15,
  },
  name: {
    fontSize: RFValue(24),
    fontWeight: 'bold',
    color: TEXT_RED,
  },
  email: {
    fontSize: RFValue(14),
    color: '#666',
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: LIGHT_RED,
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    fontSize: RFValue(15),
    color: TEXT_RED,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: RED_ACCENT,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: RFValue(14),
  },
});
