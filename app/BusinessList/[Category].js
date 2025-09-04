import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StatusBar } from 'react-native'; // <-- import StatusBar
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './../../Configs/FireBaseConfig';
import BusinessListCard from '../../components/BusinessList/BusinessListCard';

export default function BusinessListByCategory() {
  const { Category } = useLocalSearchParams();
  const navigation = useNavigation();
  const [businesslist, setBusinesslist] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: Category,
      headerStyle: {
        backgroundColor: '#db5f5fff', // reddish background
      },
      headerTitleStyle: {
        color: '#fff', // white text looks better on reddish bg
        fontWeight: 'bold',
      },
      headerTintColor: '#fff', // makes back arrow & icons white
    });

    getBusinessList();
  }, [Category]);

  const getBusinessList = async () => {
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
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* StatusBar for this screen */}
      <StatusBar backgroundColor="#c60c0cff" barStyle="light-content" />

      <FlatList
        data={businesslist}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BusinessListCard business={item} />
        )}
      />
    </View>
  );
}
