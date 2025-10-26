import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Linking,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { db } from './../../Configs/FireBaseConfig';
import Reviews from './Reviews';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function BusinessDetails() {
  const router = useRouter();
  const { BusinessId } = useLocalSearchParams();
  const [Business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (BusinessId) GetBusinessDetailsById(BusinessId);
  }, [BusinessId]);

  const GetBusinessDetailsById = async (BusinessId) => {
    try {
      const docRef = doc(collection(db, "Business List"), BusinessId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setBusiness(docSnap.data());
      else console.log("No such document!");
    } catch (error) {
      console.error("Error fetching business details:", error);
    } finally { setLoading(false); }
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={RED} />
      <Text style={{ color: RED, marginTop: 10 }}>Loading Business Details...</Text>
    </View>
  );

  if (!Business) return (
    <View style={styles.center}>
      <Text style={{ color: RED }}>No details found</Text>
    </View>
  );

  const handleCall = () => Linking.openURL(`tel:${Business.phone || '20220'}`);
  const handleWebsite = () => Business.website && Linking.openURL(Business.website);
  const handleShare = async () => {
    try {
      await Share.share({ message: `Check out ${Business.name} at ${Business.website || 'website not available'}` });
    } catch (error) { console.log("Error sharing:", error); }
  };
  const handleLocation = () => {
    if (Business.address) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(Business.address)}`;
      Linking.openURL(url);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <View style={styles.imageWrapper}>
        {Business.imageUrl && (
          <Image source={{ uri: Business.imageUrl }} style={styles.image} />
        )}
        <TouchableOpacity style={styles.floatingBackBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={SCREEN_WIDTH * 0.06} color="#646060ff" />
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{Business.name || "Unnamed Business"}</Text>
        <Text style={styles.category}>{Business.category || ""}</Text>
        <Text style={styles.address}>{Business.address || ""}</Text>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleCall}>
            <Ionicons name="call" size={SCREEN_WIDTH * 0.045} color="#fff" />
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleLocation}>
            <Ionicons name="location" size={SCREEN_WIDTH * 0.045} color="#fff" />
            <Text style={styles.actionText}>Location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleWebsite}>
            <Ionicons name="globe" size={SCREEN_WIDTH * 0.045} color="#fff" />
            <Text style={styles.actionText}>Website</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
            <Ionicons name="share-social" size={SCREEN_WIDTH * 0.045} color="#fff" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>{Business.about || "No description available for this business."}</Text>
      </View>

      <Reviews businessId={BusinessId} />
      <View style={{ height: 70 }} />
    </ScrollView>
  );
}

const RED = '#f44336';
const LIGHT_RED = '#ff7961';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  imageWrapper: {
    marginHorizontal: SCREEN_WIDTH * 0.03,
    marginTop: SCREEN_HEIGHT * 0.02,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    boxShadowColor: '#000',
    boxShadowOpacity: 0.2,
    boxShadowRadius: 6,
    boxShadowOffset: { width: 0, height: 3 },
  },
  image: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.25, 
    borderRadius: 20,
  },
  floatingBackBtn: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.02,
    left: SCREEN_WIDTH * 0.03,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 8,
    borderRadius: 30,
    elevation: 5,
  },
  detailsContainer: { paddingHorizontal: SCREEN_WIDTH * 0.04, paddingTop: 10, alignItems: 'center' },
  title: { fontSize: SCREEN_WIDTH * 0.055, fontWeight: 'bold', color: RED, marginBottom: 5, textAlign: 'center' },
  category: { fontSize: SCREEN_WIDTH * 0.035, color: LIGHT_RED, marginBottom: 5 },
  address: { fontSize: SCREEN_WIDTH * 0.035, color: '#444', marginBottom: 10, textAlign: 'center' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  actionBtn: { flex: 1, backgroundColor: RED, paddingVertical: SCREEN_HEIGHT * 0.012, marginHorizontal: SCREEN_WIDTH * 0.012, borderRadius: 12, alignItems: 'center', elevation: 3 },
  actionText: { marginTop: 2, color: '#fff', fontSize: SCREEN_WIDTH * 0.032, fontWeight: '600' },
  section: { paddingHorizontal: SCREEN_WIDTH * 0.04, paddingVertical: SCREEN_HEIGHT * 0.02, borderTopWidth: 1, borderColor: '#eee' },
  sectionTitle: { fontSize: SCREEN_WIDTH * 0.045, fontWeight: 'bold', color: RED, marginBottom: 10 },
  description: { fontSize: SCREEN_WIDTH * 0.035, color: '#444', lineHeight: SCREEN_HEIGHT * 0.025 },
});
