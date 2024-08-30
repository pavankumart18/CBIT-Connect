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
        backgroundColor: Colors.darklavender,
        height: '100%',
      }}
    >
      <Text
        style={{
          fontSize: 30,
          fontWeight: 'bold',
        }}
      >Go To Place to</Text>
      <Text
        style={{
          fontSize: 30,
          fontWeight: 'bold',
          marginTop: 20,
        }}
      >Learn</Text>
      <Image source={require('../../assets/images/Third.png')} style={{ width: 390, height: 390, marginTop: 20 }} />
      <TouchableOpacity
        onPress={() => router.replace('/DummyScreen/FourthScreen')}
        style={{
          padding: 18,
          paddingHorizontal: 50,
          borderRadius: 5,
          marginTop: 20,
          borderWidth: 1,
          borderColor: Colors.black,
          borderRadius: 99,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            color: Colors.black,
            fontWeight: 'medium',
          }}
        >Next</Text>
      </TouchableOpacity>
    </View>
  )
}