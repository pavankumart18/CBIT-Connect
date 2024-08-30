import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '../../constants/Colors'
import { useRouter } from 'expo-router'
export default function SecondScreen() {
  const router = useRouter();
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.lavender,
        height: '100%',
      }}
    >
      <Text
        style={{
          fontSize: 35,
          fontWeight: 'bold',
        }}
      >Let's Get Started</Text>
      <Image source={require('../../assets/images/Fourth.png')} style={{ width: 390, height: 390, marginTop: 20 }} />
      <TouchableOpacity
        onPress={() => router.push('/login')}
        style={{
          padding: 18,
          paddingHorizontal: 60,
          borderRadius: 5,
          marginTop: 20,
          borderWidth: 1,
          borderColor: Colors.black,
          borderRadius: 99,
          backgroundColor: Colors.radium,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            color: Colors.black,
            fontWeight: 'medium',
          }}
        >Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push('/Signup')}
        style={{
          padding: 18,
          borderRadius: 5,
          paddingHorizontal: 60,
          marginTop: 10,
          borderWidth: 1,
          borderColor: Colors.black,
          borderRadius: 99,
          backgroundColor: Colors.white,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            color: Colors.black,
            fontWeight: 'medium',
          }}
        >Sign Up</Text>
      </TouchableOpacity>

    </View>
  )
}