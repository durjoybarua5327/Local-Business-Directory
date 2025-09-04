import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StatusBar, ActivityIndicator, StyleSheet } from 'react-native'; 
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './../../Configs/FireBaseConfig';
import BusinessListCard from '../../components/BusinessList/BusinessListCard';

export default function BusinessListByCategory() {
  const { Category } = useLocalSearchParams();
  const navigation = useNavigation();
  const [businesslist, setBusinesslist] = useState([]);
  const [loading , setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: Category,
      headerStyle: {
        backgroundColor: '#db5f5fff',
      },
      headerTitleStyle: {
        color: '#fff',
        fontWeight: 'bold',
      },
      headerTintColor: '#fff',
    });

    getBusinessList();
  }, [Category]);

  const getBusinessList = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'Business List'),
        where('category', '==', Category)
      );
      const querySnapshot = await getDocs(q);

      const businesses = [];
      querySnapshot.forEach((doc) => {
        businesses.push({ id: doc.id, ...doc.data() });
      });

      setBusinesslist(businesses);
    } catch (error) {
      console.error("Error fetching business list: ", error);
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar backgroundColor="#c60c0cff" barStyle="light-content" />

      <FlatList
        data={businesslist}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BusinessListCard business={item} />
        )}
      />

      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#db5f5f" />
          <Text style={styles.loaderText}>Fetching businesses...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    top: '50%',
    left: '40%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#db5f5f',
    fontWeight: '600',
  },
});
