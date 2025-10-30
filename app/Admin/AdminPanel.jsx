import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { useEffect, useState, useMemo } from 'react'
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  Modal,
} from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { db } from '../../Configs/FireBaseConfig'

const PRIMARY_RED = '#ff4d4d'
const LIGHT_RED = '#fff2f2'
const BANNED_BG = '#ffe5e5'

export default function AdminPanel() {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedRating, setSelectedRating] = useState('All')
  const [banModalVisible, setBanModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [bannedUsers, setBannedUsers] = useState([])
  const [activeTab, setActiveTab] = useState('all') // 'all' or 'banned'

  // Fetch businesses
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'Business List'), (snapshot) => {
      const items = []
      const cats = new Set()
      snapshot.forEach((d) => {
        const data = { id: d.id, ...d.data() }
        items.push(data)
        if (data.category) cats.add(data.category)
      })
      setBusinesses(items)
      setCategories(['All', ...Array.from(cats)])
      setLoading(false)
    })
    return () => unsub()
  }, [])

  // Fetch banned users
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'BannedUsers'), (snapshot) => {
      const bans = []
      snapshot.forEach((d) => bans.push({ id: d.id, ...d.data() }))
      setBannedUsers(bans)
    })
    return () => unsub()
  }, [])

  const confirmAndDeleteShop = (businessId) => {
    Alert.alert('Delete Shop', 'Are you sure you want to delete this shop?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'Business List', businessId))
            Alert.alert('Deleted', 'Shop deleted successfully')
          } catch (err) {
            console.error('Failed to delete shop', err)
            Alert.alert('Error', 'Failed to delete shop')
          }
        },
      },
    ])
  }

  const banUser = async (duration) => {
    if (!selectedUser) return
    setLoading(true)
    try {
      let bannedUntil = null
      const now = new Date()
      switch (duration) {
        case '1day':
          bannedUntil = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000)
          break
        case '1week':
          bannedUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
          break
        case '1month':
          bannedUntil = new Date(now.setMonth(now.getMonth() + 1))
          break
        case 'lifetime':
          bannedUntil = null
          break
      }

      await setDoc(doc(db, 'BannedUsers', selectedUser.userEmail), {
        userEmail: selectedUser.userEmail,
        bannedUntil,
        reason: 'Banned by admin',
        timestamp: serverTimestamp(),
      })

      Alert.alert('Success', `User ${selectedUser.userEmail} banned for ${duration}`)
      setBanModalVisible(false)
      setSelectedUser(null)
    } catch (err) {
      console.error('Ban failed', err)
      Alert.alert('Error', 'Failed to ban user')
    } finally {
      setLoading(false)
    }
  }

  const unbanUser = async (userEmail) => {
    try {
      await deleteDoc(doc(db, 'BannedUsers', userEmail))
      Alert.alert('Success', `${userEmail} has been unbanned`)
    } catch (err) {
      console.error('Unban failed', err)
      Alert.alert('Error', 'Failed to unban user')
    }
  }

  // Filter businesses
  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b) => {
      const matchesName = b.name.toLowerCase().includes(searchText.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory
      let matchesRating = true
      if (selectedRating !== 'All') {
        const avg =
          b.reviews && b.reviews.length
            ? b.reviews.reduce((a, r) => a + r.rating, 0) / b.reviews.length
            : 0
        matchesRating = Math.round(avg) === Number(selectedRating)
      }
      return matchesName && matchesCategory && matchesRating
    })
  }, [businesses, searchText, selectedCategory, selectedRating])

  // Render business item
  const renderBusinessItem = ({ item }) => {
    const avgRating =
      item.reviews && item.reviews.length
        ? (item.reviews.reduce((a, r) => a + r.rating, 0) / item.reviews.length).toFixed(1)
        : 'No rating'

    const isBanned = bannedUsers.find((b) => b.userEmail === item.userEmail)
    const bannedText = isBanned
      ? isBanned.bannedUntil
        ? `Banned until: ${new Date(isBanned.bannedUntil.seconds * 1000).toLocaleString()}`
        : 'Banned for lifetime'
      : ''

    return (
      <View
        style={{
          padding: 14,
          borderRadius: 12,
          backgroundColor: isBanned ? BANNED_BG : LIGHT_RED,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: PRIMARY_RED,
        }}
      >
        <Text style={{ fontSize: RFValue(16), fontWeight: '700', color: PRIMARY_RED }}>
          {item.name}
        </Text>
        <Text style={{ color: '#555', marginBottom: 6 }}>{item.address}</Text>
        <Text style={{ color: '#444', marginBottom: 6 }}>Category: {item.category}</Text>
        <Text style={{ color: '#444', marginBottom: 6 }}>Avg Rating: {avgRating}</Text>
        <Text style={{ color: '#444', marginBottom: 6 }}>Owner: {item.userEmail || '—'}</Text>
        {bannedText ? <Text style={{ color: 'red', marginBottom: 6 }}>{bannedText}</Text> : null}

        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <TouchableOpacity
            disabled={!!isBanned}
            onPress={() => confirmAndDeleteShop(item.id)}
            style={{
              flex: 1,
              backgroundColor: isBanned ? '#ccc' : '#ffeaea',
              paddingVertical: 10,
              alignItems: 'center',
              borderRadius: 8,
              marginRight: 10,
            }}
          >
            <Text style={{ color: isBanned ? '#777' : '#cc0000', fontWeight: '700' }}>
              Delete Shop
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setSelectedUser(item)
              setBanModalVisible(true)
            }}
            style={{
              flex: 1,
              backgroundColor: '#ffefc5',
              paddingVertical: 10,
              alignItems: 'center',
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#7a4f00', fontWeight: '700' }}>
              {isBanned ? 'Unban / Update Ban' : 'Ban User'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  // Render banned users tab
  const renderBannedUserItem = ({ item }) => {
    const bannedUntilText = item.bannedUntil
      ? `Until: ${new Date(item.bannedUntil.seconds * 1000).toLocaleString()}`
      : 'Lifetime'

    return (
      <View
        style={{
          padding: 14,
          borderRadius: 12,
          backgroundColor: BANNED_BG,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: PRIMARY_RED,
        }}
      >
        <Text style={{ fontSize: RFValue(16), fontWeight: '700', color: PRIMARY_RED }}>
          {item.userEmail}
        </Text>
        <Text style={{ color: '#444', marginBottom: 6 }}>{bannedUntilText}</Text>
        <TouchableOpacity
          onPress={() => unbanUser(item.userEmail)}
          style={{
            paddingVertical: 10,
            borderRadius: 8,
            backgroundColor: '#444',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>Unban</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" />
      <View
        style={{
          padding: 16,
          backgroundColor: PRIMARY_RED,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <Text style={{ fontSize: RFValue(22), fontWeight: '800', color: '#fff' }}>
          Admin Panel
        </Text>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <TouchableOpacity
            onPress={() => setActiveTab('all')}
            style={{
              flex: 1,
              padding: 8,
              backgroundColor: activeTab === 'all' ? '#fff' : '#ffcccc',
              borderRadius: 12,
              marginRight: 5,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontWeight: '700', color: PRIMARY_RED }}>All Businesses</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('banned')}
            style={{
              flex: 1,
              padding: 8,
              backgroundColor: activeTab === 'banned' ? '#fff' : '#ffcccc',
              borderRadius: 12,
              marginLeft: 5,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontWeight: '700', color: PRIMARY_RED }}>Banned Users</Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'all' && (
        <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
          {/* Category Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
            {categories.map((cat, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setSelectedCategory(cat)}
                style={{
                  backgroundColor: selectedCategory === cat ? PRIMARY_RED : '#ffeaea',
                  paddingVertical: 6,
                  paddingHorizontal: 14,
                  borderRadius: 20,
                  marginRight: 10,
                }}
              >
                <Text
                  style={{
                    color: selectedCategory === cat ? '#fff' : PRIMARY_RED,
                    fontWeight: '700',
                  }}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Rating Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
            {['All', '1', '2', '3', '4', '5'].map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => setSelectedRating(r)}
                style={{
                  backgroundColor: selectedRating === r ? PRIMARY_RED : '#ffeaea',
                  paddingVertical: 6,
                  paddingHorizontal: 14,
                  borderRadius: 20,
                  marginRight: 10,
                }}
              >
                <Text
                  style={{
                    color: selectedRating === r ? '#fff' : PRIMARY_RED,
                    fontWeight: '700',
                  }}
                >
                  {r === 'All' ? 'All Ratings' : `${r}★`}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Search */}
          <TextInput
            placeholder="Search by business name..."
            value={searchText}
            onChangeText={setSearchText}
            style={{
              borderWidth: 1,
              borderColor: PRIMARY_RED,
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 8,
              fontSize: RFValue(14),
              backgroundColor: LIGHT_RED,
              color: '#333',
            }}
          />
        </View>
      )}

      {/* Content */}
      {loading ? (
        <ActivityIndicator size="large" color={PRIMARY_RED} style={{ marginTop: 50 }} />
      ) : activeTab === 'all' ? (
        <FlatList
          data={filteredBusinesses}
          keyExtractor={(i) => i.id}
          renderItem={renderBusinessItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={{ color: '#777', textAlign: 'center', marginTop: 50 }}>
              No businesses found.
            </Text>
          }
        />
      ) : (
        <FlatList
          data={bannedUsers}
          keyExtractor={(i) => i.id}
          renderItem={renderBannedUserItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={{ color: '#777', textAlign: 'center', marginTop: 50 }}>
              No banned users.
            </Text>
          }
        />
      )}

      {/* Ban Modal */}
      <Modal transparent visible={banModalVisible} animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: '85%',
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 20,
            }}
          >
            <Text style={{ fontSize: RFValue(18), fontWeight: '700', marginBottom: 15 }}>
              Ban {selectedUser?.userEmail}
            </Text>

            {['1day', '1week', '1month', 'lifetime'].map((d) => (
              <TouchableOpacity
                key={d}
                onPress={() => banUser(d)}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  backgroundColor: PRIMARY_RED,
                  marginBottom: 10,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '700' }}>{d}</Text>
              </TouchableOpacity>
            ))}

            {bannedUsers.find((b) => b.userEmail === selectedUser?.userEmail) && (
              <TouchableOpacity
                onPress={() => {
                  unbanUser(selectedUser.userEmail)
                  setBanModalVisible(false)
                  setSelectedUser(null)
                }}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  backgroundColor: '#444',
                  marginTop: 10,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '700' }}>Unban</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => setBanModalVisible(false)}
              style={{
                padding: 10,
                marginTop: 10,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: PRIMARY_RED, fontWeight: '700' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
