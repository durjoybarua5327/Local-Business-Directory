import { collection, getDocs, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { db } from './../../Configs/FireBaseConfig';

const { width } = Dimensions.get('window');
const RADISH = '#D32F2F';

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
  marginBottom: 0,
  },
  title: {
    fontFamily: 'Outfit-Medium',
    fontSize: 20,
    marginBottom: 15,
    marginLeft: 15
  },
  card: {
    marginRight: 15,
    borderRadius: 20,
    overflow: 'visible',
  },
  imageShadow: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: RADISH,
    shadowOpacity: 0.4,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  image: {
    width: width * 0.6,
    height: 120,
    borderRadius: 20,
  },
});
