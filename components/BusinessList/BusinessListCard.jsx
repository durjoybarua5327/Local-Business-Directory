import { Image } from 'expo-image';
import { Text, View } from 'react-native';
const RADISH = '#f07e7eff';
export default function BusinessListCard({ business }) {
  return (
    <View
      style={{
        backgroundColor: RADISH, 
        marginHorizontal: 10,
        marginVertical: 6,          
        borderRadius: 10,          
        overflow: 'hidden',  
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
      }}
    >
      <Image
        source={{ uri: business.imageUrl }}
        style={{ width: 100, height: 100, borderRadius: 5 }}
      />

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
