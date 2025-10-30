import * as ImagePicker from 'expo-image-picker'
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
  Image,
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
      shadowColor: '#ff4d4d',
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
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

const extractPlaceName = (url) => {
  try {
    const searchParams = new URL(url).searchParams
    let query = searchParams.get('q')
    if (query) {
      query = query.replace(/location/gi, '').trim()
      return query
    }
    const hashPart = url.split('#')[1] || ''
    const match = hashPart.match(/rlimm=.*$/)
    if (match) return decodeURIComponent(match[0].split('=')[1])
    return ''
  } catch (_error) {
    return ''
  }
}

const CreateOwnBusiness = () => {
  const { userEmail, businessId } = useLocalSearchParams()
  const router = useRouter()

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [category, setCategory] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [about, setAbout] = useState('')
  const [website, setWebsite] = useState('')
  const [loading, setLoading] = useState(false)
  const [allCategories, setAllCategories] = useState([])
  const [filteredCategories, setFilteredCategories] = useState([])

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
          setWebsite(data.website || '')
        }
      } catch (error) {
        console.error('Error fetching business:', error)
        Alert.alert('Error', 'Failed to fetch business data.')
      }
    }
    fetchBusiness()
  }, [businessId])

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

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your gallery.')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled) {
        const selectedImage = result.assets[0].uri
        setImageUrl(selectedImage)
      }
    } catch (error) {
      console.error('Image picker error:', error)
    }
  }

  const handleSubmit = async () => {
    const trimmedName = name.trim()
    const trimmedAddress = address.trim()
    const trimmedCategory = category.trim()
    const trimmedImageUrl = imageUrl.trim()
    const trimmedAbout = about.trim()
    const trimmedWebsite = website.trim()

    if (
      !trimmedName ||
      !trimmedAddress ||
      !trimmedCategory ||
      !trimmedImageUrl ||
      !trimmedAbout ||
      !userEmail
    ) {
      let missing = []
      if (!trimmedName) missing.push('Business Name')
      if (!trimmedAddress) missing.push('Address URL')
      if (!trimmedCategory) missing.push('Category')
      if (!trimmedImageUrl) missing.push('Image')
      if (!trimmedAbout) missing.push('About / Description')
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
      website: trimmedWebsite,
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
          reviews: [],
          createdAt: new Date().toISOString(),
        })
        Alert.alert('🎉 Success', 'Business Created Successfully!')
      }

      setName('')
      setAddress('')
      setCategory('')
      setImageUrl('')
      setAbout('')
      setWebsite('')
      router.back()
    } catch (error) {
      console.error('Firebase Error:', error)
      Alert.alert('Error', 'Something went wrong while saving the business.')
    } finally {
      setLoading(false)
    }
  }

  const placeName = extractPlaceName(address)

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: '#fff',
      }}
    >
      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 50,
        }}
      >
        <LinearGradient
          colors={GRADIENT_RED}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderRadius: 20,
            paddingVertical: 25,
            marginBottom: 25,
            alignItems: 'center',
            shadowColor: PRIMARY_RED,
            shadowOpacity: 0.4,
            shadowRadius: 12,
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

        <InputField
          label="Business Name *"
          placeholder="Enter your business name"
          value={name}
          onChangeText={setName}
        />

        <InputField
          label="Address URL *"
          placeholder="Paste your business location URL (google Maps Link)"
          value={address}
          onChangeText={setAddress}
          multiline={true}      
          numberOfLines={3}
        />
        {placeName ? (
          <Text
            style={{
              marginBottom: 20,
              color: '#555',
              fontSize: RFValue(13),
              fontStyle: 'italic',
            }}
          >
            Detected Place: {placeName}
          </Text>
        ) : null}

        <InputField
          label="Category *"
          placeholder="Ex: Restaurant, Store, Hospital"
          value={category}
          onChangeText={handleCategoryChange}
        />

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
            <ScrollView keyboardShouldPersistTaps="handled">
              {filteredCategories.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
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
              ))}
            </ScrollView>
          </View>
        )}

        <View
          style={{
            marginBottom: 20,
            backgroundColor: '#fff',
            borderRadius: 18,
            padding: 15,
            borderWidth: 1,
            borderColor: '#ffd6d6',
            elevation: 4,
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
            Business Image *
          </Text>
          <TouchableOpacity
            onPress={pickImage}
            style={{
              backgroundColor: LIGHT_RED,
              borderRadius: 14,
              paddingVertical: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: PRIMARY_RED, fontWeight: '700' }}>
              {imageUrl ? '📸 Change Image' : '🖼️ Pick an Image'}
            </Text>
          </TouchableOpacity>

          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={{
                width: '100%',
                height: 180,
                borderRadius: 14,
                marginTop: 12,
              }}
              resizeMode="cover"
            />
          )}
        </View>

        <InputField
          label="About / Description *"
          placeholder="Write about your business..."
          value={about}
          onChangeText={setAbout}
          multiline= {true}
          numberOfLines={3}
          style={{ minHeight: 100 }}
        />

        <InputField
          label="Website URL"
          placeholder="Paste your website link (optional)"
          value={website}
          onChangeText={setWebsite}
        />

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
            <Text style={{ fontSize: RFValue(13), color: '#777' }}>Associated Email:</Text>
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
