import { View, Text } from 'react-native';
import React,{ useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where,getDocs  } from 'firebase/firestore';
import { db } from './../../Configs/FireBaseConfig';

export default function BusinessListByCategory() {
  const { Category } = useLocalSearchParams();
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ 
      headerShown: true,
      headerTitle: Category });
      getBusinessList();
  }, []);
  const getBusinessList = async()=>{
    const q = query(collection(db, 'Business List'), where('category', '==', Category));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, ' => ', doc.data());
    });
  }
  return (
    <View>
      <Text>{Category}</Text>
      
    </View>
  );
}
