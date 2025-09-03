import { collection, getDocs, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from './../../Configs/FireBaseConfig';

const RADISH = '#D32F2F';

export default function Category() {
  const [categories, setCategories] = useState([]);

  const GetCategories = async () => {
    try {
      const q = query(collection(db, 'Category'));
      const querySnapshot = await getDocs(q);
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setCategories(items);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    GetCategories();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Category</Text>
        <Text style={styles.viewAll}>View All</Text>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item}>
            <Image source={{ uri: item.icon }} style={styles.icon} />
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  title: {
    fontFamily: 'Outfit-Medium',
    fontSize: 20,
    color: RADISH,
  },
  viewAll: {
    fontFamily: 'Outfit-Medium',
    fontSize: 14,
    color: RADISH,
  },
  item: {
    width: 50,
    marginRight: 15,
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginBottom: 5,
  },
  name: {
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
});
