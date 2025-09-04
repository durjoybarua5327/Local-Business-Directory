import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { collection,doc, getDoc } from 'firebase/firestore';
import { db } from './../../Configs/FireBaseConfig';
import React,{ useEffect } from 'react';  

export default function BusinessDetails() {
  const { BusinessId } = useLocalSearchParams();
  useEffect(() => {
    if (BusinessId) {
      GetBusinessDetailsById(BusinessId);
    }
    }, [BusinessId]);

  const GetBusinessDetailsById=async(BusinessId)=>{
    const docRef = doc(collection(db, "Business List"), BusinessId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }   

  }

  return (
    <View>
      <Text>Business Details for {BusinessId}</Text>
    </View>
  );
}
