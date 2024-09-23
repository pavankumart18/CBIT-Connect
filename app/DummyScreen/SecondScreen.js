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
        backgroundColor: Colors.skin,
        height: '100%',
      }}
    >
      <Text
        style={{
          fontSize: 30,
          fontWeight: 'bold',
        }}
      >Stay Up to date</Text>
      <Text
        style={{
          fontSize: 30,
          fontWeight: 'bold',
          marginTop: 20,
        }}
      >with Campus Life</Text>
      <Image source={require('../../assets/images/second.png')} style={{ width: 390, height: 390, marginTop: 20 }} />
      <TouchableOpacity
        onPress={() => router.replace('/DummyScreen/ThirdScreen')}
        style={{
          padding: 18,
          paddingHorizontal: 50,
          borderRadius: 5,
          marginTop: 20,
          borderWidth: 2,
          borderColor: Colors.black,
          borderRadius: 99,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            color: Colors.black,
            fontWeight: 'bold',
          }}
        >Next</Text>
      </TouchableOpacity>
    </View>
  )
}