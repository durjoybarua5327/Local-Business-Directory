import EmojiPicker from 'emoji-picker-react'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { db } from '../../Configs/FireBaseConfig'

const PRIMARY_RED = '#ff4d4d'
const LIGHT_RED = '#fff2f2'
const GRADIENT_RED = ['#ff4d4d', '#ff7878', '#ff9a9e']

// ✅ InputField Component
const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  numberOfLines = 1,
}) => (
  <View
    style={{
      marginBottom: 20,
      backgroundColor: '#fff',
      borderRadius: 18,
      padding: 14,
      boxShadowColor: '#ff4d4d',
      boxShadowOpacity: 0.15,
      boxShadowOffset: { width: 0, height: 2 },
      boxShadowRadius: 6,
      elevation: 4,
    }}
  >
    <Text
      style={{
        fontSize: RFValue(14),
        marginBottom: 8,
        color: PRIMARY_RED,
        fontWeight: '700',
      }}
    >
      {label}
    </Text>
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#b3b3b3"
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      numberOfLines={numberOfLines}
      blurOnSubmit={false}
      textAlignVertical={multiline ? 'top' : 'center'}
      style={{
        borderWidth: 1.2,
        borderColor: '#ffd6d6',
        borderRadius: 14,
        padding: 12,
        fontSize: RFValue(14),
        backgroundColor: LIGHT_RED,
        color: '#333',
      }}
    />
  </View>
)
InputField.displayName = 'InputField'

// ✅ Main Component
const CreateOwnBusiness = () => {
  const { userEmail, businessId } = useLocalSearchParams()
  const router = useRouter()

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [category, setCategory] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [about, setAbout] = useState('')
  const [loading, setLoading] = useState(false)
  const [emoji, setEmoji] = useState('🏪')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [allCategories, setAllCategories] = useState([])
  const [filteredCategories, setFilteredCategories] = useState([])

  // Fetch business details if editing
  useEffect(() => {
    if (!businessId) return
    const fetchBusiness = async () => {
      try {
        const docRef = doc(db, 'Business List', businessId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          setName(data.name || '')
          setAddress(data.address || '')
          setCategory(data.category || '')
          setImageUrl(data.imageUrl || '')
          setAbout(data.about || '')
          setEmoji(data.emoji || '🏪')
        }
      } catch (error) {
        console.error('Error fetching business:', error)
        Alert.alert('Error', 'Failed to fetch business data.')
      }
    }
    fetchBusiness()
  }, [businessId])

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Business List'))
        const categories = []
        querySnapshot.forEach((docItem) => {
          const data = docItem.data()
          if (data.category) {
            categories.push(data.category.trim().toLowerCase())
          }
        })
        const unique = [...new Set(categories)]
        setAllCategories(unique)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Filter category suggestions
  const handleCategoryChange = (text) => {
    setCategory(text)
    if (text.length > 0) {
      const filtered = allCategories.filter((c) =>
        c.toLowerCase().startsWith(text.toLowerCase())
      )
      setFilteredCategories(filtered)
    } else {
      setFilteredCategories([])
    }
  }

  const handleSelectCategory = (item) => {
    setCategory(item)
    setFilteredCategories([])
  }

  // ✅ Strict Validation — all fields required
  const handleSubmit = async () => {
    const trimmedName = name.trim()
    const trimmedAddress = address.trim()
    const trimmedCategory = category.trim()
    const trimmedImageUrl = imageUrl.trim()
    const trimmedAbout = about.trim()

    if (
      !trimmedName ||
      !trimmedAddress ||
      !trimmedCategory ||
      !trimmedImageUrl ||
      !trimmedAbout ||
      !emoji ||
      !userEmail
    ) {
      let missing = []
      if (!trimmedName) missing.push('Business Name')
      if (!trimmedAddress) missing.push('Address')
      if (!trimmedCategory) missing.push('Category')
      if (!trimmedImageUrl) missing.push('Image URL')
      if (!trimmedAbout) missing.push('About / Description')
      if (!emoji) missing.push('Emoji/Icon')
      if (!userEmail) missing.push('User Email')

      Alert.alert(
        'Missing Information ⚠️',
        `Please fill in the following:\n\n${missing.join('\n')}`
      )
      return
    }

    setLoading(true)
    const businessData = {
      name: trimmedName,
      address: trimmedAddress,
      category: trimmedCategory,
      imageUrl: trimmedImageUrl,
      about: trimmedAbout,
      emoji,
      userEmail,
      updatedAt: new Date().toISOString(),
    }

    try {
      if (businessId) {
        const docRef = doc(db, 'Business List', businessId)
        await updateDoc(docRef, businessData)
        Alert.alert('✅ Success', 'Business Updated Successfully!')
      } else {
        const colRef = collection(db, 'Business List')
        await addDoc(colRef, {
          ...businessData,
          createdAt: new Date().toISOString(),
        })
        Alert.alert('🎉 Success', 'Business Created Successfully!')
      }

      setName('')
      setAddress('')
      setCategory('')
      setImageUrl('')
      setAbout('')
      setEmoji('🏪')
      router.back()
    } catch (error) {
      console.error('Firebase Error:', error)
      Alert.alert('Error', 'Something went wrong while saving the business.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: '#fff',
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 50,
        }}
      >
        {/* Header */}
        <LinearGradient
          colors={GRADIENT_RED}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderRadius: 20,
            paddingVertical: 25,
            marginBottom: 25,
            alignItems: 'center',
            boxShadowColor: PRIMARY_RED,
            boxShadowOpacity: 0.4,
            boxShadowRadius: 12,
            elevation: 4,
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: RFValue(22),
              fontWeight: '800',
              letterSpacing: 0.8,
            }}
          >
            {businessId ? '✨ Edit Business Details ✨' : '🚀 Create Your Business'}
          </Text>
        </LinearGradient>

        {/* Input Fields */}
        <InputField
          label="Business Name *"
          placeholder="Enter your business name"
          value={name}
          onChangeText={setName}
        />

        <InputField
          label="Address *"
          placeholder="Enter business address"
          value={address}
          onChangeText={setAddress}
        />

        {/* Category Field */}
        <InputField
          label="Category *"
          placeholder="E.g., Restaurant, Store, Hospital"
          value={category}
          onChangeText={handleCategoryChange}
        />

        {/* Category Suggestions */}
        {filteredCategories.length > 0 && (
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#ffcccc',
              marginTop: -10,
              marginBottom: 20,
              maxHeight: 150,
            }}
          >
            <FlatList
              data={filteredCategories}
              keyExtractor={(item, index) => index.toString()}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectCategory(item)}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#ffe5e5',
                  }}
                >
                  <Text
                    style={{
                      fontSize: RFValue(14),
                      color: PRIMARY_RED,
                      fontWeight: '600',
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Emoji Selector */}
        <View
          style={{
            backgroundColor: '#fff',
            padding: 15,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: '#ffd6d6',
            marginBottom: 20,
            elevation: 4,
            boxShadowColor: PRIMARY_RED,
            boxShadowOpacity: 0.1,
          }}
        >
          <Text
            style={{
              color: PRIMARY_RED,
              fontWeight: '700',
              fontSize: RFValue(14),
              marginBottom: 10,
            }}
          >
            Choose Category Icon
          </Text>
          <TouchableOpacity
            onPress={() => setShowEmojiPicker(true)}
            style={{
              backgroundColor: LIGHT_RED,
              padding: 12,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: RFValue(28) }}>{emoji}</Text>
            <Text
              style={{
                fontSize: RFValue(12),
                color: '#666',
                marginTop: 5,
              }}
            >
              Tap to Change
            </Text>
          </TouchableOpacity>
        </View>

        {/* Emoji Picker Modal */}
        <Modal visible={showEmojiPicker} animationType="slide" transparent>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.4)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 20,
                padding: 10,
                width: '90%',
                height: '60%',
              }}
            >
              <TouchableOpacity
                onPress={() => setShowEmojiPicker(false)}
                style={{ alignSelf: 'flex-end', marginBottom: 10 }}
              >
                <Text style={{ fontSize: RFValue(18), color: PRIMARY_RED }}>✖</Text>
              </TouchableOpacity>
              <EmojiPicker
                onEmojiClick={(e) => {
                  setEmoji(e.emoji)
                  setShowEmojiPicker(false)
                }}
                width={'100%'}
                height={'90%'}
              />
            </View>
          </View>
        </Modal>

        <InputField
          label="Image URL *"
          placeholder="Paste an image URL"
          value={imageUrl}
          onChangeText={setImageUrl}
        />

        <InputField
          label="About / Description *"
          placeholder="Write a detailed about your shop and items you sell..."
          value={about}
          onChangeText={setAbout}
          multiline
          numberOfLines={6}
        />

        {/* Associated Email */}
        {userEmail && (
          <View
            style={{
              marginBottom: 30,
              backgroundColor: LIGHT_RED,
              borderRadius: 18,
              padding: 15,
              borderWidth: 1,
              borderColor: '#ffcaca',
            }}
          >
            <Text style={{ fontSize: RFValue(13), color: '#777' }}>
              Associated Email:
            </Text>
            <Text
              style={{
                fontSize: RFValue(14),
                fontWeight: '700',
                color: PRIMARY_RED,
                marginTop: 3,
              }}
            >
              {userEmail}
            </Text>
          </View>
        )}

        {/* Buttons */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.8}
            style={{
              flex: 1,
              backgroundColor: '#ffeaea',
              paddingVertical: 15,
              borderRadius: 16,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: '#cc0000',
                fontSize: RFValue(15),
                fontWeight: '700',
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={loading}
            style={{ flex: 1 }}
          >
            <LinearGradient
              colors={GRADIENT_RED}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                paddingVertical: 15,
                borderRadius: 16,
                alignItems: 'center',
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={{
                    color: '#fff',
                    fontSize: RFValue(15),
                    fontWeight: '800',
                    letterSpacing: 0.5,
                  }}
                >
                  {businessId ? '💾 Update' : '🔥 Create'}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

CreateOwnBusiness.displayName = 'CreateOwnBusiness'
export default CreateOwnBusiness
