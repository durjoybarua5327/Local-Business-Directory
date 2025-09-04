import { 
  View, 
  Text, 
  ActivityIndicator, 
  ScrollView, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Linking, 
  Share 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from './../../Configs/FireBaseConfig';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Reviews from './Reviews'; // Correct relative path

export default function BusinessDetails() {
  const router = useRouter();
  const { BusinessId } = useLocalSearchParams();
  const [Business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (BusinessId) {
      GetBusinessDetailsById(BusinessId);
    }
  }, [BusinessId]);

  const GetBusinessDetailsById = async (BusinessId) => {
    try {
      const docRef = doc(collection(db, "Business List"), BusinessId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBusiness(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching business details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={RED} />
        <Text style={{ color: RED, marginTop: 10 }}>Loading Business Details...</Text>
      </View>
    );
  }

  if (!Business) {
    return (
      <View style={styles.center}>
        <Text style={{ color: RED }}>No details found</Text>
      </View>
    );
  }

  const handleCall = () => Linking.openURL(`tel:${Business.phone || '20220'}`);
  const handleWebsite = () => Business.website && Linking.openURL(Business.website);
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${Business.name} at ${Business.website || 'website not available'}`,
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };
  const handleLocation = () => {
    if (Business.address) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(Business.address)}`;
      Linking.openURL(url);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Shop Image with Back Button */}
      <View style={styles.imageWrapper}>
        {Business.imageUrl && <Image source={{ uri: Business.imageUrl }} style={styles.image} />}
        <TouchableOpacity style={styles.floatingBackBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#646060ff" />
        </TouchableOpacity>
      </View>

      {/* Business Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{Business.name || "Unnamed Business"}</Text>
        <Text style={styles.category}>{Business.category || ""}</Text>
        <Text style={styles.address}>{Business.address || ""}</Text>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleCall}>
            <Ionicons name="call" size={18} color="#fff" />
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleLocation}>
            <Ionicons name="location" size={18} color="#fff" />
            <Text style={styles.actionText}>Location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleWebsite}>
            <Ionicons name="globe" size={18} color="#fff" />
            <Text style={styles.actionText}>Website</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
            <Ionicons name="share-social" size={18} color="#fff" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>
          {Business.about || "No description available for this business."}
        </Text>
      </View>

      {/* Reviews Component */}
      <Reviews rating={Business.rating} />
    </ScrollView>
  );
}

const RED = '#f44336';
const LIGHT_RED = '#ff7961';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  imageWrapper: {
    margin: 6,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  image: { width: '100%', height: 220, borderRadius: 20 },
  floatingBackBtn: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 8,
    borderRadius: 30,
    elevation: 5,
  },
  detailsContainer: { padding: 10, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: RED, marginBottom: 5, textAlign: 'center' },
  category: { fontSize: 12, color: LIGHT_RED, marginBottom: 5 },
  address: { fontSize: 12, color: '#444', marginBottom: 10, textAlign: 'center' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  actionBtn: { flex: 1, backgroundColor: RED, paddingVertical: 8, marginHorizontal: 5, borderRadius: 12, alignItems: 'center', elevation: 3 },
  actionText: { marginTop: 2, color: '#fff', fontSize: 11, fontWeight: '600' },
  section: { padding: 20, borderTopWidth: 1, borderColor: '#eee' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: RED, marginBottom: 10 },
  description: { fontSize: 13, color: '#444', lineHeight: 18 },
});
