import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Rating } from 'react-native-ratings';

export default function Reviews({ rating }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Reviews</Text>
      
      {/* Star Rating */}
      <Rating
        type="star"
        startingValue={rating || 0} 
        imageSize={25}  
        readonly={true}   
        style={styles.rating}
      />
      
      <Text style={styles.ratingText}>
        {rating ? `${rating} / 5` : 'No rating yet'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f44336',
    marginBottom: 10,
  },
  rating: {
    paddingVertical: 5,
  },
  ratingText: {
    fontSize: 14,
    color: '#ff7961',
    marginTop: 5,
  },
});
