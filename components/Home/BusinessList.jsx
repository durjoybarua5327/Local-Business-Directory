import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from './../../Configs/FireBaseConfig';
import { useRouter } from 'expo-router';

const RADISH = '#D32F2F';
const { width: screenWidth } = Dimensions.get('window');
const vw = screenWidth / 100;

export default function BusinessList() {
  const [businesses, setBusinesses] = useState([]);
  const router = useRouter();

  // Function to calculate average rating
  const getAverageRating = (business) => {
    if (!business?.reviews || business.reviews.length === 0) return 0;
    const total = business.reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return total / business.reviews.length;
  };

  const GetBusinesses = async () => {
    try {
      const q = query(collection(db, 'Business List'));
      const querySnapshot = await getDocs(q);
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });

      // Filter businesses with average rating >= 4
      const popularBusinesses = items.filter((b) => getAverageRating(b) >= 4);
      setBusinesses(popularBusinesses);
    } catch (error) {
      console.error('Error fetching Business List:', error);
    }
  };

  useEffect(() => {
    GetBusinesses();
  }, []);

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
        contentContainerStyle={{ paddingHorizontal: vw * 2.5 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push('/BusinessDetails/' + encodeURIComponent(item.id))
            }
          >
            <Image source={{ uri: item.imageUrl }} style={styles.image} />

            <View style={styles.infoBox}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.location}>{item.address}</Text>

              <View style={styles.bottomRow}>
                <View style={styles.ratingRow}>
                  <Image
                    source={require('./../../assets/images/star.png')}
                    style={styles.star}
                  />
                  <Text style={styles.rating}>
                    ⭐ {getAverageRating(item).toFixed(1)}
                    {item.reviews?.length
                      ? ` (${item.reviews.length})`
                      : ''}
                  </Text>
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
    marginVertical: vw * 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: vw * 4,
    marginBottom: vw * 2,
  },
  title: {
    fontFamily: 'Outfit-Medium',
    fontSize: vw * 4.2,
    color: RADISH,
  },
  viewAll: {
    fontFamily: 'Outfit-Medium',
    fontSize: vw * 4,
    color: RADISH,
  },
  card: {
    width: screenWidth * 0.65,
    backgroundColor: '#fff',
    borderRadius: vw * 3,
    marginRight: vw * 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: vw * 1.2,
    shadowOffset: { width: 0, height: vw * 0.5 },
  },
  image: {
    width: '100%',
    aspectRatio: 5 / 2,
    borderTopLeftRadius: vw * 3,
    borderTopRightRadius: vw * 3,
  },
  infoBox: {
    padding: vw * 3,
    alignItems: 'flex-start',
  },
  name: {
    fontFamily: 'Outfit-Medium',
    fontSize: vw * 3.8,
    color: RADISH,
    marginBottom: vw * 0.8,
  },
  location: {
    fontFamily: 'Outfit-Regular',
    fontSize: vw * 3.2,
    color: '#555',
    marginBottom: vw * 1.2,
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
    width: vw * 3.8,
    height: vw * 3.8,
    marginRight: vw * 1,
  },
  rating: {
    fontFamily: 'Outfit-Regular',
    fontSize: vw * 3.2,
    color: '#333',
  },
  categoryBox: {
    backgroundColor: RADISH,
    paddingHorizontal: vw * 2.5,
    paddingVertical: vw * 1,
    borderRadius: vw * 3,
  },
  categoryText: {
    fontFamily: 'Outfit-Regular',
    fontSize: vw * 3.2,
    color: '#fff',
  },
});
