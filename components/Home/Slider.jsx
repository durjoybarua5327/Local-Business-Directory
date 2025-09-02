import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { db } from './../../Configs/FireBaseConfig'
import { collection, query, getDocs } from 'firebase/firestore'

export default function Slider() {
  const [sliders, setSliders] = useState([])

  const GetSlider = async () => {
  try {
    const q = query(collection(db, "Slider"))
    const querySnapshot = await getDocs(q)
    const items = []
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() })
    })
    setSliders(items)
  } catch (error) {
    console.error("Error fetching Slider data:", error)
  }
}

  useEffect(() => {
    GetSlider()
  }, [])

  return (
    <View>
      <Text>Slider</Text>
      {sliders.map((item) => (
        <Text key={item.id}>{item.title}</Text>
      ))}
    </View>
  )
}
