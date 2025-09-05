import { StyleSheet, Text, View, TextInput, TouchableOpacity, Animated, FlatList } from 'react-native';
import { Rating } from 'react-native-ratings';
import { useState, useEffect } from 'react';
import { db } from './../../Configs/FireBaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function Reviews({ businessId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (!businessId) return;
        const docRef = doc(db, 'Business List', businessId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setReviews(Array.isArray(data.reviews) ? data.reviews : []);
        } else setReviews([]);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, [businessId]);

  const showNotificationMsg = () => {
    setShowNotification(true);
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start(() =>
          setShowNotification(false)
        );
      }, 2000);
    });
  };

  const handleSubmit = async () => {
    if (rating === 0) { alert('Please give a rating.'); return; }
    if (comment.trim() === '') { alert('Please write a comment.'); return; }

    try {
      if (!businessId) return;
      const docRef = doc(db, 'Business List', businessId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return;

      const data = docSnap.data();
      const currentReviews = Array.isArray(data.reviews) ? data.reviews : [];
      const newReview = { rating, comment, createdAt: new Date().toISOString() };
      const updatedReviews = [...currentReviews, newReview];

      await updateDoc(docRef, { reviews: updatedReviews });

      setReviews(updatedReviews);
      setComment('');
      setRating(0);

      showNotificationMsg();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Reviews</Text>

      <Rating
        type="star"
        startingValue={rating}
        imageSize={30}
        onFinishRating={setRating}
        style={styles.rating}
      />

      <Text style={styles.ratingText}>{rating ? `${rating} / 5` : 'Tap stars to rate'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Write your comment..."
        placeholderTextColor="#ffb3b3"
        value={comment}
        onChangeText={setComment}
        multiline
      />

      {showNotification && (
        <Animated.View style={[styles.notification, { opacity: fadeAnim }]}>
          <Text style={styles.notificationText}>Comment added successfully!</Text>
        </Animated.View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      <FlatList
        data={reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
        style={styles.flatList}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <Text style={styles.reviewRating}>⭐ {item.rating} / 5</Text>
            <Text style={styles.reviewComment}>{item.comment}</Text>
          </View>
        )}
      />
    </View>
  );
}

const RED = '#f44336';
const LIGHT_RED = '#ff7961';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 15, // horizontal space
    alignItems: 'center',
  },
  title: { fontSize: 16, fontWeight: 'bold', color: RED, marginBottom: 10 },
  rating: { paddingVertical: 5 },
  ratingText: { fontSize: 14, color: LIGHT_RED, marginTop: 5 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: RED,
    borderRadius: 8,
    padding: 12,
    marginTop: 15,
    color: '#d32f2f',
    fontSize: 14,
    backgroundColor: '#fff5f5',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 15,
    backgroundColor: RED,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  flatList: { marginTop: 20, width: '100%' }, // matches container width
  reviewCard: {
    backgroundColor: '#ffeaea',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  reviewRating: { color: '#d32f2f', fontWeight: 'bold' },
  reviewComment: { color: '#444', marginTop: 5 },
  notification: {
    marginTop: 8,
    backgroundColor: '#fddede',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  notificationText: { color: RED, fontSize: 12, fontWeight: 'bold' },
});
