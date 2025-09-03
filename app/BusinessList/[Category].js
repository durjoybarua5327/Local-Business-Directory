import { View, Text } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';

export default function BusinessListByCategory() {
  const { category } = useLocalSearchParams(); // gets the category name

  return (
    <View>
      <Text>BusinessListByCategory / {category}</Text>
      
    </View>
  );
}
