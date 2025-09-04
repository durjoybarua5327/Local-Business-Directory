// components\BusinessList\BusinessListCard.jsx
import { Image } from 'expo-image';
import { Text, View } from 'react-native';
const RADISH = '#ea7373ff';
export default function BusinessListCard({ business }) {
  return (
    <View
      style={{
        backgroundColor: RADISH, // reddish card background
        margin: 10,                // space between cards
        borderRadius: 10,           // rounded corners
        overflow: 'hidden',        // clip children within radius
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
      }}
    >
      {/* Left: Image */}
      <Image
        source={{ uri: business.imageUrl }}
        style={{ width: 100, height: 100, borderRadius: 5 }}
        resizeMode="cover"
      />

      {/* Right: Info */}
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>
          {business.address || "No Address"}
        </Text>
        <Text style={{ color: '#fff', fontSize: 12, marginTop: 5 }}>
          ⭐ {business.rating || "No Rating"}
        </Text>
      </View>
    </View>
  );
}
