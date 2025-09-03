import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Linking, TouchableOpacity, ScrollView } from 'react-native';
import { db } from './../../Configs/FireBaseConfig';
import { collection, query, getDocs } from 'firebase/firestore';

const RADISH = '#D32F2F';

export default function BusinessList() {
  const [businesses, setBusinesses] = useState([]);

  const GetBusinesses = async () => {
    try {
      const q = query(collection(db, 'Business List'));
      const querySnapshot = await getDocs(q);
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setBusinesses(items);
    } catch (error) {
      console.error('Error fetching Business List:', error);
    }
  };

  useEffect(() => {
    GetBusinesses();
  }, []);

  const openWebsite = (url) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openWebsite(item.website)} style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.address}>{item.address}</Text>
        <Text style={styles.about}>{item.about}</Text>
        {item.website ? <Text style={styles.website}>{item.website}</Text> : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Business List</Text>
      <FlatList
        data={businesses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontFamily: 'Outfit-Medium',
    fontSize: 24,
    color: RADISH,
    marginBottom: 15,
  },
  card: {
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: RADISH,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 150,
  },
  info: {
    padding: 10,
  },
  name: {
    fontFamily: 'Outfit-Medium',
    fontSize: 18,
    color: RADISH,
    marginBottom: 3,
  },
  category: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  address: {
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    color: '#777',
    marginBottom: 3,
  },
  about: {
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    color: '#555',
    marginBottom: 3,
  },
  website: {
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    color: RADISH,
    textDecorationLine: 'underline',
  },
});
