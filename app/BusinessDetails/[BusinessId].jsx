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

const RED = '#f44336';
const LIGHT_RED = '#ff7961';

/**
 * Improved extractor that handles:
 * - plain addresses (returns as-is)
 * - google maps urls with ?q= or &query=
 * - /maps/place/<name>/...
 * - /maps/search/<name>
 * - /search/<name>
 * - hash fragments containing rlimm or other encoded names
 * - best-effort fallback to a human readable path segment
 */
const extractPlaceName = (urlOrAddress) => {
    if (!urlOrAddress) return '';

    const tryDecode = (s) => {
        try {
            return decodeURIComponent(s).replace(/\+/g, ' ').trim();
        } catch {
            return s.replace(/\+/g, ' ').trim();
        }
    };

    // If it's not a URL, assume it's already a human-readable address
    let isUrl = true;
    try { new URL(urlOrAddress); } catch { isUrl = false; }

    if (!isUrl) {
        // clean up common noise words
        return urlOrAddress.replace(/location/gi, '').trim();
    }

    try {
        const u = new URL(urlOrAddress);
        const sp = u.searchParams;

        // Common query params
        const q = sp.get('q') || sp.get('query') || sp.get('search') || sp.get('destination');
        if (q) return tryDecode(q).replace(/location/gi, '').trim();

        // Path-based formats: /maps/place/<name>/...
        const pathname = u.pathname || '';
        let m;

        m = pathname.match(/\/maps\/place\/([^\/]+)/i);
        if (m && m[1]) return tryDecode(m[1]);

        m = pathname.match(/\/maps\/search\/([^\/]+)/i) || pathname.match(/\/search\/([^\/]+)/i);
        if (m && m[1]) return tryDecode(m[1]);

        // Some links like https://www.google.com/maps/dir/.../<Name>/@... -> try to pick readable segment
        const parts = pathname.split('/').filter(Boolean);
        // iterate from end to start and pick the first "human" looking segment
        for (const seg of [...parts].reverse()) {
            const cleaned = seg.replace(/[!@#$%^&*()_+=~`{}[\]|\\:;"'<>,.?]/g, '');
            // skip numeric segments or segments that look like coordinates or very short tokens
            if (!cleaned) continue;
            if (/^[0-9\-.@]/.test(cleaned)) continue;
            if (cleaned.length < 2) continue;
            // Many Google pieces include `@` or coordinates - skip those
            if (cleaned.includes('@') || cleaned.match(/^\-?\d+(\.\d+)?$/)) continue;
            return tryDecode(cleaned);
        }

        // check hash for rlimm or other encoded name tokens
        const hash = u.hash || '';
        let rlimm = hash.match(/rlimm=([^&]+)/i);
        if (rlimm && rlimm[1]) return tryDecode(rlimm[1]);

        // last resort: show host or empty
        return '';
    } catch (_e) {
        return '';
    }
};

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

    const placeName = extractPlaceName(Business.address);

    const handleCall = () => {
        const phone = Business.phone || '';
        if (phone) Linking.openURL(`tel:${phone}`);
        else Linking.openURL('tel:20220');
    };

    const handleWebsite = () => {
        if (Business.website) {
            Linking.openURL(Business.website).catch(err => console.warn('Cannot open website', err));
        }
    };

    const handleShare = async () => {
        try {
            await Share.share({ message: `Check out ${Business.name} at ${Business.website || (Business.address || 'address not available')}` });
        } catch (error) { console.log("Error sharing:", error); }
    };

    const handleLocation = () => {
        if (!Business.address) return;
        // If address is already a valid URL, open it. Otherwise open google maps search with the address.
        let isUrl = true;
        try { new URL(Business.address); } catch { isUrl = false; }

        if (isUrl) {
            Linking.openURL(Business.address).catch(err => {
                console.warn('Failed to open URL, falling back to maps search', err);
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(Business.address)}`;
                Linking.openURL(mapsUrl);
            });
        } else {
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(Business.address)}`;
            Linking.openURL(mapsUrl).catch(err => console.warn('Failed to open maps', err));
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
            <View style={styles.imageWrapper}>
                {Business.imageUrl && <Image source={{ uri: Business.imageUrl }} style={styles.image} />}
                <TouchableOpacity style={styles.floatingBackBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={SCREEN_WIDTH * 0.06} color="#646060ff" />
                </TouchableOpacity>
            </View>

            <View style={styles.detailsContainer}>
                <Text style={styles.title}>{Business.name || "Unnamed Business"}</Text>
                <Text style={styles.category}>{Business.category || ""}</Text>
                {placeName ? <Text style={styles.location}>{placeName}</Text> : (Business.address && !Business.address.startsWith('http') ? <Text style={styles.location}>{Business.address}</Text> : null)}

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
    image: { width: '100%', height: SCREEN_HEIGHT * 0.25, borderRadius: 20 },
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
    category: { fontSize: SCREEN_WIDTH * 0.035, color: LIGHT_RED, marginBottom: 3 },
    location: { fontSize: SCREEN_WIDTH * 0.035, color: '#444', marginBottom: 10, textAlign: 'center', fontStyle: 'italic' },
    actionsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    actionBtn: { flex: 1, backgroundColor: RED, paddingVertical: SCREEN_HEIGHT * 0.012, marginHorizontal: SCREEN_WIDTH * 0.012, borderRadius: 12, alignItems: 'center', elevation: 3 },
    actionText: { marginTop: 2, color: '#fff', fontSize: SCREEN_WIDTH * 0.032, fontWeight: '600' },
    section: { paddingHorizontal: SCREEN_WIDTH * 0.04, paddingVertical: SCREEN_HEIGHT * 0.02, borderTopWidth: 1, borderColor: '#eee' },
    sectionTitle: { fontSize: SCREEN_WIDTH * 0.045, fontWeight: 'bold', color: RED, marginBottom: 10 },
    description: { fontSize: SCREEN_WIDTH * 0.035, color: '#444', lineHeight: SCREEN_HEIGHT * 0.025 },
});
