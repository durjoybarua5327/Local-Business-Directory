import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function LoginScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{
        display: 'flex', 
        alignItems: 'center',
        marginTop: 80
      }}>
        <Image 
          source={require('../assets/images/picture1.jpg')} 
          style={{
            width: 220, 
            height: 450,
            borderRadius: 20,
            borderWidth: 4,
            borderColor: '#d42525ff'
          }} 
        />
      </View>
      <View style={styles.subcontainer}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#d42525ff', marginBottom: 12,marginTop: 16, textAlign: 'center' }}>
           Your ultimate  
        </Text>
        <Text style={{ fontSize: 22, color: '#2c1eceff', fontFamily: 'Outfit-Medium', textAlign: 'center' }}>
          Community Business Directory 
        </Text>
        <Text style={{ fontSize: 26, fontFamily:'Outfit-Extra-Bold', color:'#d42525ff', marginTop: 15, textAlign: 'center' }}>
          App
        </Text>
        <Text style={{
          fontSize: 16,
          fontFamily: 'Outfit-Regular',
          textAlign: 'center',
          marginVertical: 2,
          color: '#706c6cff',
          paddingHorizontal: 20
        }}>
          Find your favourite business near you and post your own business to your community
        </Text>
        <TouchableOpacity style={styles.btn}>
          <Text style={{
            textAlign: 'center',
            color: '#fff',
            fontFamily: 'Outfit-Medium'
          }} >Let's Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  subcontainer: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
    textAlign: 'center',
    flex: 1
  },
  btn: {
    backgroundColor: '#d42525ff',
    padding: 15,
    width: '90%',
    borderRadius: 99,
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
  }
})

