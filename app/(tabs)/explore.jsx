import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
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

// Helper function to extract place name from Google Maps URL
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

// Category Component fetching unique categories from "Business List"
const Category = ({ selectedCategory, setSelectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const q = collection(db, 'Business List');
        const unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            // Extract unique categories
            const uniqueCategories = new Set();
            querySnapshot.docs.forEach((doc) => {
              const data = doc.data();
              if (data.category) uniqueCategories.add(data.category);
            });

            setCategories(['All', ...Array.from(uniqueCategories)]);
            setLoading(false);
          },
          (error) => {
            console.error('Error fetching businesses snapshot for categories:', error);
            setLoading(false);
          }
        );

        return unsubscribe;
      } catch (error) {
        console.error('Error fetching categories from businesses:', error);
        setLoading(false);
      }
    };

    const unsubPromise = fetchCategories();
    return () => {
      if (typeof unsubPromise === 'function') unsubPromise();
      else if (unsubPromise && typeof unsubPromise.then === 'function') {
        unsubPromise.then((u) => { if (typeof u === 'function') u(); }).catch(() => {});
      }
    };
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
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Navigate to BusinessDetails on press
  const onBusinessPress = (business) => {
    router.push('/BusinessDetails/' + encodeURIComponent(business.id));
  };

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const q = collection(db, 'Business List');
        const unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            const fetchedData = querySnapshot.docs.map((doc) => {
              const docData = doc.data();
              const reviews = Array.isArray(docData.reviews) ? docData.reviews : [];
              const avgRating =
                reviews.length > 0
                  ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                  : '0';
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
            setLoading(false);
          },
          (error) => {
            console.error('Error fetching businesses snapshot:', error);
            setLoading(false);
          }
        );
        return unsubscribe;
      } catch (error) {
        console.error('Error fetching businesses:', error);
      }
    };
    const unsubPromise = fetchBusinesses();
    return () => {
      if (typeof unsubPromise === 'function') unsubPromise();
      else if (unsubPromise && typeof unsubPromise.then === 'function') {
        unsubPromise.then((u) => { if (typeof u === 'function') u(); }).catch(() => {});
      }
    };
  }, []);

  // Filter by search (supports multiple space-separated tokens) and category
  // Each token must match at least one searchable field (AND behavior across tokens)
  const filteredData = businesses.filter((item) => {
    const searchLower = (search || '').toLowerCase().trim();

    const matchesCategory =
      selectedCategory && selectedCategory !== 'All' ? item.category === selectedCategory : true;

    // If no search text, just return category-matched items
    if (!searchLower) return matchesCategory;

    // Split into tokens so queries like "parkview chattogram x-ray" work
    const tokens = searchLower.split(/\s+/).filter(Boolean);

    // Prepare searchable values
    const placeName = extractPlaceName(item.address || '').toLowerCase();
    const rawAddress = (item.address || '').toLowerCase();
    const name = (item.name || '').toLowerCase();
    const category = (item.category || '').toLowerCase();
    const about = (item.about || '').toLowerCase();

    // For each token, require it to appear in at least one searchable field
    const allTokensMatch = tokens.every((t) => {
      return (
        name.includes(t) ||
        placeName.includes(t) ||
        rawAddress.includes(t) ||
        category.includes(t) ||
        about.includes(t)
      );
    });

    return allTokensMatch && matchesCategory;
  });

  const ListHeader = useMemo(() => (
    <>
      <Text style={styles.title}>Explore Businesses</Text>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={RFValue(18)}
          color={RED_ACCENT}
          style={{ marginRight: spacing }}
        />
        <TextInput
          placeholder="Search by location,category, items name..."
          style={styles.searchInput}
          placeholderTextColor={RED_ACCENT}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      <Category selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

      {filteredData.length > 0 && (
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
    </>
  ), [search, selectedCategory, filteredData.length]);

  if (loading) {
    return <ActivityIndicator size="large" color={RED_ACCENT} style={{ marginTop: 20 }} />;
  }

  return (
    <>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => onBusinessPress(item)}>
            {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />}
            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.address}>{extractPlaceName(item.address) || 'No Address'}</Text>
              <Text style={styles.review}>Rating: ⭐{item.avgRating}/5</Text>
              <TouchableOpacity
                style={styles.viewReviewsBtn}
                onPress={() => {
                  setSelectedReviews(item.reviews || []);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.viewReviewsText}>View Reviews</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        style={styles.flatList}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={() => <View style={{ height: 30 }} />}
        nestedScrollEnabled={true}  // ✅ fixes scroll issue
      />

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
    </>
  );
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingHorizontal: horizontalPadding,
    paddingTop: spacing * 4,
    backgroundColor: '#fff',
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
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff5f5',
    borderRadius: 12,
    marginBottom: spacing * 2,
    padding: spacing * 2,
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
