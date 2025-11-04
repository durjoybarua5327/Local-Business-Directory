import { useRouter } from 'expo-router';
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { db } from './../../Configs/FireBaseConfig';

const { width, height } = Dimensions.get('window');
const RADISH = '#D32F2F';

const vw = width / 100;
const vh = height / 100;

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewAll, setViewAll] = useState(false);
  const router = useRouter();

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
              if (data.category) {
                uniqueCategories.add(data.category);
              }
            });

            // Convert to array, sort alphabetically, and add IDs
            const categoriesArray = Array.from(uniqueCategories).sort();
            const categoriesWithIds = categoriesArray.map((category, index) => ({
              id: index.toString(),
              name: category
            }));

            setCategories(categoriesWithIds);
            setLoading(false);
          },
          (error) => {
            console.error('Error fetching categories snapshot:', error);
            setLoading(false);
          }
        );

        return unsubscribe;
      } catch (error) {
        console.error('Error fetching categories:', error);
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

  const onCategoryPress = (category) => {
    router.push('/BusinessList/' + encodeURIComponent(category.name));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, viewAll ? styles.itemVertical : null]}
      onPress={() => onCategoryPress(item)}
    >
      <Text style={[styles.name, viewAll ? styles.nameVertical : styles.nameHorizontal]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={RADISH} style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Category</Text>
        <TouchableOpacity onPress={() => setViewAll(!viewAll)}>
          <Text style={styles.viewAll}>
            {viewAll ? 'Show Less' : 'View All'}
          </Text>
        </TouchableOpacity>
      </View>

      {viewAll ? (
        <View style={styles.verticalContainer}>
          {categories.map((item) => renderItem({ item }))}
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalContainer}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: vh * 1,
    marginBottom: vh * 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: vw * 4,
    marginBottom: vh * 1.2,
  },
  title: {
    fontFamily: 'Outfit-Medium',
    fontSize: vw * 4.2,
    color: RADISH,
  },
  viewAll: {
    fontFamily: 'Outfit-Medium',
    fontSize: vw * 3.8,
    color: RADISH,
  },
  horizontalContainer: {
    paddingHorizontal: vw * 2.5,
    paddingVertical: vh * 1,
  },
  verticalContainer: {
    paddingHorizontal: vw * 2.5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  item: {
    backgroundColor: '#FFE5E5',
    padding: vw * 3,
    marginHorizontal: vw * 2,
    marginVertical: vh * 1,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: vw * 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  itemVertical: {
    width: vw * 28,
    margin: vw * 1.5,
  },
  name: {
    fontFamily: 'Outfit-Regular',
    fontSize: vw * 3.2,
    textAlign: 'center',
    color: RADISH,
    fontWeight: '600',
  },
  nameVertical: {
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  nameHorizontal: {
    maxWidth: vw * 20,
  },
});