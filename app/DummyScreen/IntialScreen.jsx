import { View, Text, Image,TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '../../constants/Colors'
import { useRouter } from 'expo-router'
export default function IntialScreen() {
  const router=useRouter();
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.lavender,
        height: '100%',
      }}
    >
      <View
        style={{
          alignItems: 'center',
        }}
      >
      <Text
        style={{
          fontSize: 30,
          fontWeight: 'bold',
        }}
      >Welcome</Text>
      <Text
        style={{
          fontSize: 30,
          fontWeight: 'bold',
          marginTop: 20,
        }}
      >to CBIT Connect</Text>
      </View>
      <Image source={require('../../assets/images/intial1.png')} style={{ width: 400, height: 400, marginTop: 20 }} />
      <TouchableOpacity
        onPress={() => router.replace('/DummyScreen/SecondScreen')}
        style={{
          padding: 18,
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
        >Get Started</Text>
      </TouchableOpacity>
    </View>
  )
}