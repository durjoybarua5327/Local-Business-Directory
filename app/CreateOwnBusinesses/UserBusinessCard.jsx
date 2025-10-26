import { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity, ActivityIndicator, FlatList, Alert } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { useRouter } from 'expo-router'
import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../Configs/FireBaseConfig'

const RED_ACCENT = '#ff6f6f'
const LIGHT_RED = '#fff0f0'

export default function UserBusinessCard({ userEmail }) {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!userEmail) return
      try {
        const q = query(collection(db, 'Business List'), where('userEmail', '==', userEmail))
        const snapshot = await getDocs(q)
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setBusinesses(docs)
      } catch (error) {
        console.error('Error fetching business:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBusiness()
  }, [userEmail])

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Business',
      'Are you sure you want to delete this business?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'Business List', id))
              setBusinesses(prev => prev.filter(b => b.id !== id))
              Alert.alert('Deleted', 'Business deleted successfully!')
            } catch (error) {
              console.error('Delete Error:', error)
              Alert.alert('Error', 'Failed to delete business.')
            }
          },
        },
      ]
    )
  }

  if (loading) return <ActivityIndicator color={RED_ACCENT} size="large" style={{ marginVertical: 20 }} />

  if (businesses.length === 0)
    return <Text style={{ textAlign: 'center', color: RED_ACCENT, marginVertical: 20 }}>You don&apos;t have a business yet</Text>

  return (
    <FlatList
      data={businesses}
      keyExtractor={(item) => item.id}
      horizontal={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 10 }}
      renderItem={({ item }) => (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: LIGHT_RED,
            borderRadius: 20,
            padding: 15,
            marginVertical: 10,
            marginHorizontal: 10,
            elevation: 5,
            shadowColor: RED_ACCENT,
            shadowOpacity: 0.3,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 3 },
          }}
        >
          {/* Business Image */}
          <Image
            source={{ uri: item.imageUrl || 'https://via.placeholder.com/100' }}
            style={{ width: 100, height: 100, borderRadius: 15, marginRight: 15 }}
          />

          {/* Business Info */}
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View>
              <Text style={{ fontSize: RFValue(18), fontFamily: 'Outfit-Bold', color: RED_ACCENT }}>
                {item.emoji} {item.name}
              </Text>
              <Text style={{ fontSize: RFValue(14), fontFamily: 'Outfit-SemiBold', color: '#555', marginTop: 4 }}>
                Category: {item.category}
              </Text>
              <Text style={{ fontSize: RFValue(12), color: '#777', marginTop: 4 }} numberOfLines={2}>
                Address: {item.address}
              </Text>
              <Text style={{ fontSize: RFValue(12), color: '#777', marginTop: 4 }} numberOfLines={2}>
                About: {item.about}
              </Text>
            </View>

            {/* Buttons */}
            <View style={{ flexDirection: 'row', marginTop: 10, gap: 10 }}>
              <TouchableOpacity
                onPress={() => router.push(`/business/${item.id}`)}
                activeOpacity={0.8}
                style={{
                  flex: 1,
                  backgroundColor: RED_ACCENT,
                  paddingVertical: 10,
                  borderRadius: 12,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontFamily: 'Outfit-Bold', fontSize: RFValue(14) }}>
                  View
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                activeOpacity={0.8}
                style={{
                  flex: 1,
                  backgroundColor: '#ffcccc',
                  paddingVertical: 10,
                  borderRadius: 12,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: RED_ACCENT, fontFamily: 'Outfit-Bold', fontSize: RFValue(14) }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    />
  )
}
