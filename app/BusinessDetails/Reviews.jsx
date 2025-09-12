import { StyleSheet, Text, View, TextInput, TouchableOpacity, Animated, FlatList, Image } from 'react-native';
import { Rating } from 'react-native-ratings';
import { useState, useEffect } from 'react';
import { db } from './../../Configs/FireBaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useUser } from '@clerk/clerk-expo';  

export default function Reviews({ businessId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const { user } = useUser(); 

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
    if (!user) { alert('You must be logged in to submit a review.'); return; }

    try {
      if (!businessId) return;
      const docRef = doc(db, 'Business List', businessId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return;

      const data = docSnap.data();
      const currentReviews = Array.isArray(data.reviews) ? data.reviews : [];

      const newReview = { 
        rating, 
        comment, 
        userName: user.fullName || user.primaryEmailAddress?.emailAddress,
        userImage: user.imageUrl, 
        createdAt: new Date().toISOString() 
      };

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

      {/* Rating Section */}
      <Rating
        type="star"
        startingValue={rating}
        imageSize={30}
        onFinishRating={setRating}
        style={styles.rating}
      />
      <Text style={styles.ratingText}>{rating ? `${rating} / 5` : 'Tap stars to rate'}</Text>

      {/* Comment Input Section */}
      <View style={styles.inputRow}>
        {user && (
          <Image source={{ uri: user.imageUrl }} style={styles.userImage} />
        )}
        <TextInput
          style={styles.input}
          placeholder="Write your comment..."
          placeholderTextColor="#ffb3b3"
          value={comment}
          onChangeText={setComment}
          multiline
        />
      </View>

      {showNotification && (
        <Animated.View style={[styles.notification, { opacity: fadeAnim }]}>
          <Text style={styles.notificationText}>Comment added successfully!</Text>
        </Animated.View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      {/* Reviews List */}
      <FlatList
        data={reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
        style={styles.flatList}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image 
                source={{ uri: item.userImage }} 
                style={styles.userImage} 
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{item.userName}</Text>
                <View style={styles.ratingRow}>
                  <Text style={styles.reviewRating}>⭐ {item.rating} / 5</Text>
                  <Text style={styles.reviewDate}>
                    {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </Text>
                </View>
              </View>
            </View>
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
    paddingHorizontal: 15, 
    alignItems: 'center',
  },
  title: { fontSize: 16, fontWeight: 'bold', color: RED, marginBottom: 10 },
  rating: { paddingVertical: 5 },
  ratingText: { fontSize: 14, color: LIGHT_RED, marginTop: 5 },

  // Comment input row (Play Store style)
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 15,
    width: '100%',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: RED,
    borderRadius: 8,
    padding: 10,
    color: '#d32f2f',
    fontSize: 14,
    backgroundColor: '#fff5f5',
    minHeight: 60,
    textAlignVertical: 'top',
  },

  button: {
    marginTop: 12,
    backgroundColor: RED,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  flatList: { marginTop: 20, width: '100%' },
  reviewCard: {
    backgroundColor: '#ffeaea',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    marginHorizontal: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userImage: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#d32f2f',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  reviewRating: { 
    color: '#d32f2f', 
    fontWeight: 'bold', 
    marginRight: 10,
    fontSize: 13,
  },
  reviewDate: {
    fontSize: 12,
    color: '#888',
  },
  reviewComment: { 
    color: '#444', 
    marginTop: 6, 
    fontSize: 14,
    lineHeight: 20,
  },
  notification: {
    marginTop: 8,
    backgroundColor: '#fddede',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  notificationText: { color: RED, fontSize: 12, fontWeight: 'bold' },
});
