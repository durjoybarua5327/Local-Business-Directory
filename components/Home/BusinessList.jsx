import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from './../../Configs/FireBaseConfig';

const RADISH = '#D32F2F';
const { width: screenWidth } = Dimensions.get('window');

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
    if (url) Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Popular Business</Text>
        <Text style={styles.viewAll}>View All</Text>
      </View>

      <FlatList
        data={businesses}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openWebsite(item.website)}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            
            <View style={styles.infoBox}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.location}>{item.address}</Text>

              <View style={styles.bottomRow}>
                <View style={styles.ratingRow}>
                  <Image source={require('./../../assets/images/star.png')} style={styles.star} />
                  <Text style={styles.rating}>4.5</Text>
                </View>
                <View style={styles.categoryBox}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
              </View>
            </View>
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
    fontSize: 15,
    color: RADISH,
  },
  viewAll: {
    fontFamily: 'Outfit-Medium',
    fontSize: 14,
    color: RADISH,
  },
  card: {
    width: screenWidth * 0.65,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: '100%',
    aspectRatio: 5 / 2,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  infoBox: {
    padding: 10,
    alignItems: 'flex-start',
  },
  name: {
    fontFamily: 'Outfit-Medium',
    fontSize: 14,
    color: RADISH,
    marginBottom: 2,
  },
  location: {
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    color: '#555',
    marginBottom: 5,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    width: 14,
    height: 14,
    marginRight: 4,
  },
  rating: {
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    color: '#333',
  },
  categoryBox: {
    backgroundColor: RADISH,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoryText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    color: '#fff',
  },
});
