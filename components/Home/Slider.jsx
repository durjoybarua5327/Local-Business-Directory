import { collection, getDocs, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { db } from './../../Configs/FireBaseConfig';

const { width, height } = Dimensions.get('window');
const RADISH = '#D32F2F';


const vw = width / 100;
const vh = height / 100;

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
    marginVertical: vh * 2,
    marginTop: vh * 1.5,
  },
  title: {
    fontFamily: 'Outfit-Medium',
    fontSize: vw * 4.2, 
    marginBottom: vh * 0.8,
    marginLeft: vw * 4,
    color: RADISH,
  },
  card: {
    marginRight: vw * 4,
    borderRadius: vw * 5,
    overflow: 'visible',
  },
  imageShadow: {
    borderRadius: vw * 5,
    overflow: 'hidden',
    boxShadowColor: RADISH,
    boxShadowOpacity: 0.4,
    boxShadowRadius: vw * 4,
    boxShadowOffset: { width: 0, height: vh },
    elevation: 8,
  },
  image: {
    width: width * 0.6,      
    height: height * 0.14,        
    borderRadius: vw * 5,
  },
});
