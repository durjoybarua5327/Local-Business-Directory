import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { LinearGradient } from 'expo-linear-gradient'
import { db } from '../../Configs/FireBaseConfig'
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
import { useLocalSearchParams, useRouter } from 'expo-router'

const LIGHT_RED = '#ffe5e5'
const RED_ACCENT = '#ff6f6f'

export default function CreateOwnBusiness() {
  const { userEmail, businessId } = useLocalSearchParams()
  const router = useRouter()

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [category, setCategory] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [about, setAbout] = useState('')
  const [loading, setLoading] = useState(false)

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
        }
      } catch (error) {
        console.error('Error fetching business:', error)
        Alert.alert('Error', 'Failed to fetch business data.')
      }
    }
    fetchBusiness()
  }, [businessId])

  const handleSubmit = async () => {
    if (!name || !address || !category || !imageUrl || !about) {
      Alert.alert('Error', 'Please fill in all fields before submitting!')
      return
    }

    setLoading(true)
    const businessData = {
      name,
      address,
      category,
      imageUrl,
      about,
      userEmail,
      updatedAt: new Date().toISOString(),
    }

    try {
      if (businessId) {
        const docRef = doc(db, 'Business List', businessId)
        await updateDoc(docRef, businessData)
        Alert.alert('Success', 'Business Updated Successfully!')
      } else {
        const colRef = collection(db, 'Business List')
        await addDoc(colRef, { ...businessData, createdAt: new Date().toISOString() })
        Alert.alert('Success', 'Business Created Successfully!')
      }

      setName('')
      setAddress('')
      setCategory('')
      setImageUrl('')
      setAbout('')
      router.back()
    } catch (error) {
      console.error('Firebase Error:', error)
      Alert.alert('Error', 'Something went wrong while saving the business.')
    } finally {
      setLoading(false)
    }
  }

  const InputField = ({ label, value, onChangeText, placeholder, multiline, numberOfLines }) => (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontSize: RFValue(14),
          marginBottom: 8,
          color: '#444',
          fontWeight: '600',
        }}
      >
        {label}
      </Text>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={{
          borderWidth: 1,
          borderColor: '#f0b3b3',
          borderRadius: 14,
          padding: 12,
          fontSize: RFValue(14),
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 5,
          elevation: 2,
        }}
      />
    </View>
  )

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
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 50,
        }}
      >
        {/* Header Gradient */}
        <LinearGradient
          colors={[RED_ACCENT, '#ff9a9e']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderRadius: 18,
            paddingVertical: 18,
            marginBottom: 25,
            alignItems: 'center',
            shadowColor: RED_ACCENT,
            shadowOpacity: 0.4,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: RFValue(20),
              fontWeight: '700',
              letterSpacing: 0.5,
            }}
          >
            {businessId ? 'Edit Business Details' : 'Create Your Own Business'}
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
        <InputField
          label="Category *"
          placeholder="E.g., Hospital, Restaurant, Store"
          value={category}
          onChangeText={setCategory}
        />
        <InputField
          label="Image URL *"
          placeholder="Enter image URL for your business"
          value={imageUrl}
          onChangeText={setImageUrl}
        />
        <InputField
          label="About / Description *"
          placeholder="Write a detailed description..."
          value={about}
          onChangeText={setAbout}
          multiline
          numberOfLines={6}
        />

        {/* User Email Display */}
        {userEmail && (
          <View
            style={{
              marginBottom: 30,
              padding: 12,
              borderWidth: 1,
              borderColor: '#ffd6d6',
              borderRadius: 14,
              backgroundColor: '#fff8f8',
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: RFValue(13), color: '#555' }}>Associated Email:</Text>
            <Text
              style={{
                fontSize: RFValue(14),
                fontWeight: 'bold',
                color: RED_ACCENT,
                marginTop: 2,
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
              backgroundColor: '#eee',
              paddingVertical: 15,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <Text
              style={{
                color: '#333',
                fontSize: RFValue(15),
                fontWeight: '600',
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
              colors={[RED_ACCENT, '#ff8a8a']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                paddingVertical: 15,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: RED_ACCENT,
                shadowOpacity: 0.4,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={{
                    color: '#fff',
                    fontSize: RFValue(15),
                    fontWeight: '700',
                    letterSpacing: 0.5,
                  }}
                >
                  {businessId ? 'Update' : 'Create'}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
