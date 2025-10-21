import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // added for navigation
import { collection, getDocs } from 'firebase/firestore';

import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { db } from './../../Configs/FireBaseConfig';

const { width } = Dimensions.get('window');
const horizontalPadding = width * 0.04;
const spacing = width * 0.02;

const LIGHT_RED = '#ffeaea';
const RED_ACCENT = '#ff6f6f';
const TEXT_RED = '#d42525';

// Category Component fetching from Firebase
const Category = ({ selectedCategory, setSelectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Category'));
        const fetchedCategories = querySnapshot.docs.map((doc) => doc.data().name);
        // Add "All" option at the beginning
        setCategories(['All', ...fetchedCategories]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <ActivityIndicator color={RED_ACCENT} style={{ marginVertical: 10 }} />;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginBottom: spacing * 3 }}
    >
      {categories.map((cat, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => setSelectedCategory(cat)}
          style={{
            backgroundColor: selectedCategory === cat ? TEXT_RED : RED_ACCENT,
            paddingVertical: 6,
            paddingHorizontal: 15,
            borderRadius: 20,
            marginRight: spacing,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>{cat}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default function Explore() {
  const router = useRouter(); // initialize router
  const [search, setSearch] = useState('');
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All'); // Default to All

  // Navigate to BusinessDetails on press
  const onBusinessPress = (business) => {
    router.push('/BusinessDetails/' + encodeURIComponent(business.id));
  };

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Business List'));
        const fetchedData = querySnapshot.docs.map((doc) => {
          const docData = doc.data();
          const reviews = Array.isArray(docData.reviews) ? docData.reviews : [];
          const avgRating =
            reviews.length > 0
              ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
              : null;
          return {
            id: doc.id,
            name: docData.name || 'Unnamed',
            about: docData.about || '',
            address: docData.address || 'No Address',
            category: docData.category || '',
            imageUrl: docData.imageUrl || null,
            website: docData.website || '',
            reviews,
            avgRating,
            firstReview: reviews.length > 0 ? reviews[0] : null,
          };
        });
        setBusinesses(fetchedData);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  // Filter by search and category
  const filteredData = businesses.filter((item) => {
    const searchLower = search.toLowerCase().trim();
    const address = item.address ? item.address.toLowerCase() : '';
    const matchesSearch = address.includes(searchLower);
    const matchesCategory =
      selectedCategory && selectedCategory !== 'All' ? item.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Explore Businesses</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={RFValue(18)}
          color={RED_ACCENT}
          style={{ marginRight: spacing }}
        />
        <TextInput
          placeholder="Search by location..."
          style={styles.searchInput}
          placeholderTextColor={RED_ACCENT}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Category Component */}
      <Category selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

      {/* Dynamic Heading for business list with icon */}
      {!loading && filteredData.length > 0 && (
        <View style={styles.sectionTitleContainer}>
          <Ionicons
            name="location-sharp"
            size={RFValue(15)}
            color={RED_ACCENT}
            style={{ marginRight: 4 }}
          />
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'All'
              ? 'All Shops Nearby'
              : `${selectedCategory} Shops Nearby`}
          </Text>
        </View>
      )}

      {/* Business List */}
      {loading ? (
        <ActivityIndicator size="large" color={RED_ACCENT} style={{ marginTop: 20 }} />
      ) : filteredData.length === 0 ? (
        <Text style={{ textAlign: 'center', color: TEXT_RED, marginTop: 20 }}>
          No businesses found
        </Text>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => onBusinessPress(item)}>
              {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />}
              <View style={styles.cardContent}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.address}>{item.address}</Text>
                {item.avgRating && <Text style={styles.review}>Rating: ⭐{item.avgRating}/5</Text>}
                {/* Show View Reviews button when reviews exist */}
                {item.reviews && item.reviews.length > 0 && (
                  <TouchableOpacity
                    style={styles.viewReviewsBtn}
                    onPress={() => {
                      setSelectedReviews(item.reviews);
                      setModalVisible(true);
                    }}
                  >
                    <Text style={styles.viewReviewsText}>View Reviews</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Reviews Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>All Reviews</Text>
            <ScrollView style={{ marginVertical: 10 }}>
              {selectedReviews.length > 0 ? (
                selectedReviews.map((review, index) => (
                  <View key={index} style={styles.reviewCard}>
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                    <Text style={styles.reviewRating}>
                      Rating: {review.rating}/5 - {review.userName}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={{ textAlign: 'center', color: TEXT_RED }}>No reviews yet</Text>
              )}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[styles.viewReviewsBtn, { alignSelf: 'center', marginTop: 10 }]}
            >
              <Text style={styles.viewReviewsText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={{ height: 30 }} />
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
    marginBottom: spacing * 2,
  },
  searchInput: {
    flex: 1,
    fontSize: RFValue(15),
    color: TEXT_RED,
    paddingVertical: 0,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing * 2,
  },
  sectionTitle: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    color: TEXT_RED,
    textTransform: 'uppercase',
    borderBottomWidth: 3,
    borderBottomColor: RED_ACCENT,
    paddingBottom: 4,
    textShadowColor: 'rgba(255, 111, 111, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff5f5',
    borderRadius: 12,
    marginBottom: spacing * 2,
    padding: spacing * 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: spacing * 2,
  },
  cardContent: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: TEXT_RED },
  address: { fontSize: 13, color: '#666' },
  review: { fontSize: 12, color: '#888', marginTop: 2 },
  viewReviewsBtn: {
    marginTop: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: RED_ACCENT,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  viewReviewsText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    maxHeight: '70%',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: TEXT_RED, textAlign: 'center' },
  reviewCard: { marginBottom: 10, borderBottomWidth: 0.5, borderColor: '#ccc', paddingBottom: 6 },
  reviewComment: { fontSize: 13, color: '#444' },
  reviewRating: { fontSize: 12, color: '#888', marginTop: 2 },
});
