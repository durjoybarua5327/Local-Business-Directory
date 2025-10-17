import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useRef, useState } from 'react';
import { Alert, Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
const LocationButton = () => {
  const [locationText, setLocationText] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const intervalRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Get the current user from Clerk
  const { userId } = useAuth();

  const showText = (text) => {
    setLocationText(text);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setLocationText(''));
    }, 3500);
  };

  const handleLocationFetch = async (latitude, longitude) => {
    if (!userId) {
      Alert.alert('Error', 'Please sign in to save businesses');
      return 0;
    }
    
    setIsFetching(true);
    try {
      const savedCount = await fetchAndSaveShops(latitude, longitude, userId);
      
      const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
      const shortName = address.name || address.street || 'Here';
      showText(shortName);
      
      return savedCount;
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch nearby businesses');
      console.error(error);
      return 0;
    } finally {
      setIsFetching(false);
    }
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required to find nearby businesses');
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const savedCount = await handleLocationFetch(latitude, longitude);
      
      if (savedCount > 0) {
        Alert.alert('Success', `Saved ${savedCount} new businesses to your collection!`);
      } else {
        Alert.alert('Info', 'No new businesses found or all businesses are already in your collection');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get location');
      console.error(error);
    }
  };

  const handlePress = () => getLocation();

  const handleLongPress = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(async () => {
      try {
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        await handleLocationFetch(latitude, longitude);
      } catch (error) {
        console.error('Error in interval location fetch:', error);
      }
    }, 3000);
  };

  const handlePressOut = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: isFetching ? 0.9 : 1 }] }}>
        <TouchableOpacity
          style={[styles.button, isFetching && styles.buttonDisabled]}
          onPress={handlePress}
          onLongPress={handleLongPress}
          onPressOut={handlePressOut}
          disabled={isFetching}
        >
          <Ionicons 
            name="location-sharp" 
            size={20} 
            color={isFetching ? "#ccc" : "#fff"} 
          />
          {locationText !== '' && (
            <Animated.Text style={[styles.locationText, { opacity: fadeAnim }]}>
              {locationText}
            </Animated.Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#ff5252',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 25,
    elevation: 3,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ff9c9c',
  },
  locationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
});

export default LocationButton;