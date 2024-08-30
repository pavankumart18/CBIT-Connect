import { View, Text ,Image} from 'react-native'
import React from 'react'

export default function AboutUs() {
  return (
    <View
        style={{
            marginTop: 25,
            alignItems: 'center',
        }}
    >
        <Text
        style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 20,
        }}
        >CBIT</Text>
        <Image
        source={require('../../assets/images/cbitlogo.png')}
        style={{
            width: 200,
            height: 200,
            objectFit: 'contain',
        }}
        />
    </View>
  )
}