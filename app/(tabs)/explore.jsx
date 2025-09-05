import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import Category from '../../components/Home/Category.jsx';

const { width } = Dimensions.get('window');
const avatarSize = width * 0.12;
const horizontalPadding = width * 0.04;
const spacing = width * 0.02;

const LIGHT_RED = '#ffeaea';
const RED_ACCENT = '#ff6f6f';
const TEXT_RED = '#d42525';

const categoriesData = [
  { id: '1', name: 'Books' },
  { id: '2', name: 'Stationery' },
  { id: '3', name: 'Cafes' },
  { id: '4', name: 'Restaurants' },
  { id: '5', name: 'Grocery' },
];

export default function Explore() {
  const [search, setSearch] = useState('');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Explore More</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={RFValue(18)}
          color={RED_ACCENT}
          style={{ marginRight: spacing }}
        />
        <TextInput
          placeholder="Search businesses..."
          style={styles.searchInput}
          placeholderTextColor={RED_ACCENT}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Categories */}
      <Category />

      {/* Popular Business (Add your BusinessList component here) */}
      <Text style={styles.sectionTitle}>Popular Businesses</Text>
      {/* <BusinessList /> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalPadding,
    backgroundColor: '#fff',
    paddingTop: spacing * 4,
  },
  title: {
    fontSize: RFValue(24),
    fontWeight: 'bold',
    color: TEXT_RED,
    marginBottom: spacing * 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: RFValue(45),
    backgroundColor: LIGHT_RED,
    borderRadius: 12,
    paddingHorizontal: spacing * 1.5,
    borderWidth: 1,
    borderColor: RED_ACCENT,
    shadowColor: TEXT_RED,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: spacing * 3,
  },
  searchInput: {
    flex: 1,
    fontSize: RFValue(15),
    fontFamily: 'Outfit-Regular',
    color: TEXT_RED,
    paddingVertical: 0,
  },
  categoriesWrapper: {
    marginBottom: spacing * 4,
  },
  categoryBox: {
    backgroundColor: RED_ACCENT,
    paddingVertical: spacing * 2,
    paddingHorizontal: spacing * 4,
    borderRadius: 20,
    marginRight: spacing * 2,
    shadowColor: TEXT_RED,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryText: {
    color: '#fff',
    fontSize: RFValue(14),
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: RFValue(20),
    fontWeight: 'bold',
    color: TEXT_RED,
    marginBottom: spacing * 2,
  },
});
