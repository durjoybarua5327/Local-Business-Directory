import { Image } from 'expo-image';
import { Text, View, TouchableOpacity } from 'react-native';
import React, { useMemo } from 'react';
import { useRouter } from 'expo-router';

const RADISH = '#f07e7eff';

export default function BusinessListCard({ business }) {
  const router = useRouter();

  const averageRating = useMemo(() => {
    if (!business?.reviews || business.reviews.length === 0) return "No Rating";
    const total = business.reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return (total / business.reviews.length).toFixed(1);
  }, [business]);

  return (
    <TouchableOpacity
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
      onPress={() => router.push('/BusinessDetails/' + encodeURIComponent(business.id))}
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
          ⭐ {averageRating} {business.reviews?.length ? `(${business.reviews.length} reviews)` : ""}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
