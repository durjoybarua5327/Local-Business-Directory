import { useRouter } from 'expo-router';
import { collection, getDocs, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from './../../Configs/FireBaseConfig';

const { width, height } = Dimensions.get('window');
const RADISH = '#D32F2F';

const vw = width / 100;
const vh = height / 100;

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const router = useRouter();

  const getCategories = async () => {
    try {
      const q = query(collection(db, 'Category'));
      const querySnapshot = await getDocs(q);
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setCategories(items);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const onCategoryPress = (category) => {
    router.push('/BusinessList/' + encodeURIComponent(category.name));
  };

  // Calculate number of items per row dynamically
  const itemWidth = vw * 20; // width of one category item including margin
  const numColumns = viewAll ? Math.floor(width / itemWidth) : 1;

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

      <FlatList
        key={viewAll ? 'VERTICAL' : 'HORIZONTAL'} // forces re-render
        data={categories}
        keyExtractor={(item) => item.id}
        horizontal={!viewAll}
        numColumns={numColumns}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: vw * 2.5,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, viewAll && styles.itemVertical]}
            onPress={() => onCategoryPress(item)}
          >
            <Image source={{ uri: item.icon }} style={styles.icon} />
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
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
  item: {
    width: vw * 14,
    marginRight: vw * 4,
    alignItems: 'center',
  },
  itemVertical: {
    flex: 1,
    margin: vw * 1,
    alignItems: 'center',
  },
  icon: {
    width: vw * 11,
    height: vw * 11,
    borderRadius: vw * 2,
    marginBottom: vh * 0.6,
  },
  name: {
    fontFamily: 'Outfit-Regular',
    fontSize: vw * 3.2,
    textAlign: 'center',
    color: '#333',
  },
});
