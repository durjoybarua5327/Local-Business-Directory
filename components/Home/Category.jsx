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

// Helpers
const vw = width / 100;
const vh = height / 100;

export default function Category() {
  const [categories, setCategories] = useState([]);
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
    console.log('Category pressed:', category.name);
    router.push('/BusinessList/' + encodeURIComponent(category.name));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Category</Text>
        <Text style={styles.viewAll}>View All</Text>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: vw * 2.5 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
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
