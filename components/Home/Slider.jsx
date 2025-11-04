import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { db } from './../../Configs/FireBaseConfig';

const { width, height } = Dimensions.get('window');
const RADISH = '#D32F2F';
const LIGHT_RED = '#FFE5E5';

const vw = width / 100;
const vh = height / 100;

const extractPlaceName = (url) => {
  try {
    const searchParams = new URL(url).searchParams;
    let query = searchParams.get('q');
    if (query) return query;
    return '';
  } catch (_error) {
    return '';
  }
};

export default function Slider() {
  const [recentBusinesses, setRecentBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 🔥 Fetch the most recently added businesses
    const q = query(
      collection(db, 'Business List'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const businesses = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          businesses.push({
            id: doc.id,
            name: data.name || 'Unnamed Business',
            about: data.about || '',
            address: data.address || '',
            category: data.category || '',
            imageUrl: data.imageUrl || null,
            mobile: data.mobile || '',
            website: data.website || '',
            createdAt: data.createdAt || '',
          });
        });
        setRecentBusinesses(businesses);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching recent businesses:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleBusinessPress = (business) => {
    router.push('/BusinessDetails/' + encodeURIComponent(business.id));
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', minHeight: vh * 15 }]}>
        <ActivityIndicator size="large" color={RADISH} />
      </View>
    );
  }

  if (recentBusinesses.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="sparkles" size={vw * 5} color={RADISH} />
        <Text style={styles.title}>New on the List</Text>
      </View>

      <FlatList
        data={recentBusinesses}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => handleBusinessPress(item)}
            activeOpacity={0.9}
          >
            <View style={styles.imageContainer}>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
              ) : (
                <View style={[styles.image, styles.placeholderImage]}>
                  <Ionicons name="business" size={vw * 12} color={RADISH} />
                </View>
              )}
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            </View>

            <View style={styles.infoOverlay}>
              <Text style={styles.businessName} numberOfLines={1}>{item.name}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-sharp" size={vw * 3.5} color="#fff" />
                <Text style={styles.locationText} numberOfLines={1}>
                  {extractPlaceName(item.address) || 'Location not available'}
                </Text>
              </View>
              <Text style={styles.reviewCount}>Added recently</Text>
            </View>
          </TouchableOpacity>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vh * 1.2,
    marginLeft: vw * 4,
  },
  title: {
    fontFamily: 'Outfit-Medium',
    fontSize: vw * 4.5, 
    marginLeft: vw * 2,
    color: RADISH,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingLeft: vw * 4,
    paddingVertical: vh * 0.5,
  },
  card: {
    marginRight: vw * 4,
    borderRadius: vw * 4,
    overflow: 'hidden',
    width: width * 0.75,
    shadowColor: RADISH,
    shadowOpacity: 0.3,
    shadowRadius: vw * 3,
    shadowOffset: { width: 0, height: vh * 0.5 },
    elevation: 6,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: height * 0.2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: LIGHT_RED,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    top: vw * 3,
    left: vw * 3,
    backgroundColor: RADISH,
    paddingHorizontal: vw * 3,
    paddingVertical: vh * 0.5,
    borderRadius: vw * 3,
  },
  categoryText: {
    fontFamily: 'Outfit-Medium',
    fontSize: vw * 3,
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  infoOverlay: {
    backgroundColor: 'rgba(211, 47, 47, 0.95)',
    padding: vw * 3.5,
  },
  businessName: {
    fontFamily: 'Outfit-Bold',
    fontSize: vw * 4.2,
    color: '#fff',
    marginBottom: vh * 0.5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vh * 0.3,
  },
  locationText: {
    fontFamily: 'Outfit-Regular',
    fontSize: vw * 3.2,
    color: '#fff',
    marginLeft: vw * 1,
    flex: 1,
  },
  reviewCount: {
    fontFamily: 'Outfit-Regular',
    fontSize: vw * 2.8,
    color: '#fff',
    marginTop: vh * 0.4,
    opacity: 0.9,
  },
});
