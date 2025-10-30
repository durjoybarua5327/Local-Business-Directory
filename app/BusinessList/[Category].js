import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import BusinessListCard from '../../components/BusinessList/BusinessListCard';
import { db } from './../../Configs/FireBaseConfig';

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
  }, [navigation, Category]);

  useEffect(() => {
    const q = query(
      collection(db, 'Business List'),
      where('category', '==', Category)
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const businesses = [];
        querySnapshot.forEach((doc) => {
          businesses.push({ id: doc.id, ...doc.data() });
        });
        setBusinesslist(businesses);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching business list snapshot: ', error);
        setLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [Category]);
  

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
