import { useUser } from '@clerk/clerk-expo';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, Animated, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Rating } from 'react-native-ratings';
import { db } from './../../Configs/FireBaseConfig';

export default function Reviews({ businessId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [editingIndex, setEditingIndex] = useState(null);

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

  const showNotificationMsg = (message = 'Comment added successfully!') => {
    setShowNotification(message);
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start(() =>
          setShowNotification(false)
        );
      }, 2000);
    });
  };

  // Submit or Update review
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

      // Update existing review
      if (editingIndex !== null) {
        const updatedReviews = [...currentReviews];
        updatedReviews[editingIndex] = {
          ...updatedReviews[editingIndex],
          rating,
          comment,
          editedAt: new Date().toISOString(),
        };
        await updateDoc(docRef, { reviews: updatedReviews });
        setReviews(updatedReviews);
        setEditingIndex(null);
        setComment('');
        setRating(0);
        showNotificationMsg('Review updated successfully!');
        return;
      }

      // Add new review
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

  // Edit a review
  const handleEdit = (index) => {
    const reviewToEdit = reviews[index];
    setComment(reviewToEdit.comment);
    setRating(reviewToEdit.rating);
    setEditingIndex(index);
  };

  // Delete a review with confirmation
  const handleDelete = (index) => {
    Alert.alert(
      "Delete Review",
      "Are you sure you want to delete this review?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => confirmDelete(index) }
      ],
      { cancelable: true }
    );
  };

  const confirmDelete = async (index) => {
    try {
      const docRef = doc(db, 'Business List', businessId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return;

      const data = docSnap.data();
      const currentReviews = Array.isArray(data.reviews) ? data.reviews : [];
      const updatedReviews = currentReviews.filter((_, i) => i !== index);

      await updateDoc(docRef, { reviews: updatedReviews });
      setReviews(updatedReviews);
      showNotificationMsg('Review deleted successfully!');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Error deleting review. Try again.');
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
          <Text style={styles.notificationText}>{showNotification}</Text>
        </Animated.View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{editingIndex !== null ? 'Update Review' : 'Submit'}</Text>
      </TouchableOpacity>

      {/* Reviews List (rendered non-virtualized to avoid nesting VirtualizedList inside ScrollView) */}
      <View style={[styles.flatList, { width: '100%' }]}> 
        {[...reviews]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((item, idx) => {
            const actualIndex = reviews.findIndex((r) => r.createdAt === item.createdAt);
            return (
              <View key={idx} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Image source={{ uri: item.userImage }} style={styles.userImage} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.userName}>{item.userName}</Text>
                    <View style={styles.ratingRow}>
                      <Text style={styles.reviewRating}>⭐ {item.rating} / 5</Text>
                      <Text style={styles.reviewDate}>
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewComment}>{item.comment}</Text>

                {/* Edit & Delete buttons only for current user */}
                {user && (user.fullName === item.userName || user.primaryEmailAddress?.emailAddress === item.userName) && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity onPress={() => handleEdit(actualIndex)}>
                      <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(actualIndex)}>
                      <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
      </View>
    </View>
  );
}

const RED = '#f44336';
const LIGHT_RED = '#ff7961';

const styles = StyleSheet.create({
  container: { width: '100%', paddingHorizontal: 15, alignItems: 'center' },
  title: { fontSize: 16, fontWeight: 'bold', color: RED, marginBottom: 10 },
  rating: { paddingVertical: 5 },
  ratingText: { fontSize: 14, color: LIGHT_RED, marginTop: 5 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 15, width: '100%' },
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
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  userImage: { width: 35, height: 35, borderRadius: 20, marginRight: 10 },
  userName: { fontWeight: 'bold', fontSize: 14, color: '#d32f2f' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  reviewRating: { color: '#d32f2f', fontWeight: 'bold', marginRight: 10, fontSize: 13 },
  reviewDate: { fontSize: 12, color: '#888' },
  reviewComment: { color: '#444', marginTop: 6, fontSize: 14, lineHeight: 20 },
  notification: { marginTop: 8, backgroundColor: '#fddede', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  notificationText: { color: RED, fontSize: 12, fontWeight: 'bold' },

  // Edit/Delete row
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5 },
  editText: { color: '#1976d2', marginRight: 15, fontSize: 13, fontWeight: 'bold' },
  deleteText: { color: '#d32f2f', fontSize: 13, fontWeight: 'bold' },
});
