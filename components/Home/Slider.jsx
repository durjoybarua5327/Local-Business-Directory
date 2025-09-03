import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions } from 'react-native';
import { db } from './../../Configs/FireBaseConfig';
import { collection, query, getDocs } from 'firebase/firestore';

const { width } = Dimensions.get('window');
const RADISH = '#D32F2F'; // Radish-like theme color

export default function Slider() {
  const [sliderslist, setSliderslist] = useState([]);

  const GetSlider = async () => {
    try {
      const q = query(collection(db, 'Slider'));
      const querySnapshot = await getDocs(q);
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setSliderslist(items);
    } catch (error) {
      console.error('Error fetching Slider data:', error);
    }
  };

  useEffect(() => {
    GetSlider();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>#Special for you</Text>

      <FlatList
        data={sliderslist}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.imageShadow}>
              <Image
                source={{ uri: item.ImageUrl }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingLeft: 15,
  },
  title: {
    fontFamily: 'Outfit-Medium',
    fontSize: 22,
    marginBottom: 15,
    marginLeft: 15,
    color: RADISH,
  },
  card: {
    marginRight: 15,
    borderRadius: 20,
    overflow: 'visible',
  },
  imageShadow: {
    borderRadius: 20,
    overflow: 'hidden',
    // iOS shadow
    shadowColor: RADISH,
    shadowOpacity: 0.4,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    // Android shadow
    elevation: 8,
  },
  image: {
    width: width * 0.65,
    height: 140,
    borderRadius: 20,
  },
});
