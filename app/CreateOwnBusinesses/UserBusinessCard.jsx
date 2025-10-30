import { useRouter } from 'expo-router'
import { collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Image, Linking, Text, TouchableOpacity, View } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { db } from '../../Configs/FireBaseConfig'

const RED_ACCENT = '#ff6f6f'
const LIGHT_RED = '#fff0f0'

export default function UserBusinessCard({ userEmail, onView }) {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!userEmail) return
    const q = query(collection(db, 'Business List'), where('userEmail', '==', userEmail))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
        setBusinesses(docs)
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching business snapshot:', error)
        setLoading(false)
      }
    )
    return () => unsubscribe()
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
    <View style={{ paddingVertical: 10 }}>
      {businesses.map((item) => (
        <View
          key={item.id}
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
              {/* Address: if it's a map/link show cleaned label and make tappable */}
              <AddressView address={item.address} />
              <Text style={{ fontSize: RFValue(12), color: '#777', marginTop: 4 }} numberOfLines={2}>
                About: {item.about}
              </Text>
            </View>

            {/* Buttons */}
            <View style={{ flexDirection: 'row', marginTop: 10, gap: 10 }}>
              <TouchableOpacity
                  onPress={() => {
                    if (typeof onView === 'function') {
                      onView(item.id)
                    } else {
                      router.push(`/BusinessDetails/${encodeURIComponent(item.id)}`)
                    }
                  }}
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
      ))}
    </View>
  )
}

// Small helper component to format addresses and open map links
function AddressView({ address }) {
  const styles = { text: { fontSize: RFValue(12), color: '#777', marginTop: 4 } }

  const isUrl = (str) => {
    if (!str) return false
    try {
      // URL constructor will throw for non-URLs
      // also allow strings that start with www.
      new URL(str.startsWith('http') ? str : 'https://' + str)
      return true
    } catch {
      return false
    }
  }

  const formatAddress = (addr) => {
    if (!addr) return ''
    try {
      const url = new URL(addr.startsWith('http') ? addr : 'https://' + addr)

      // Try to extract common human-readable parts from Google Maps links
      const q = url.searchParams.get('q')
      if (q) return decodeURIComponent(q)

      const match = url.pathname.match(/\/place\/([^\/]+)/)
      if (match && match[1]) return decodeURIComponent(match[1].replace(/\+/g, ' '))

      // fallback: host + path (shortened)
      const host = url.hostname.replace(/^www\./, '')
      let label = host + (url.pathname && url.pathname !== '/' ? ' ' + decodeURIComponent(url.pathname).replace(/\//g, ' ') : '')
      return label.length > 80 ? label.slice(0, 77) + '...' : label
    } catch {
      return addr
    }
  }

  const openLink = async (url) => {
    try {
      const u = url.startsWith('http') ? url : 'https://' + url
      const supported = await Linking.canOpenURL(u)
      if (supported) await Linking.openURL(u)
      else Alert.alert('Cannot open link', 'This link is not supported on your device.')
    } catch (err) {
      console.error('Open link error', err)
      Alert.alert('Error', 'Failed to open the link.')
    }
  }

  if (isUrl(address)) {
    return (
      <TouchableOpacity onPress={() => openLink(address)} activeOpacity={0.7}>
        <Text style={styles.text} numberOfLines={2}>
          Address: {formatAddress(address)}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <Text style={styles.text} numberOfLines={2}>
      Address: {address}
    </Text>
  )
}
