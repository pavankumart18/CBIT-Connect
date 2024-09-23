import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
export default function TGroups() {
    const router = useRouter();
    
  return (
    <View
        style={{
            marginTop: 10,
            flex: 1,
            flexDirection: 'row',
            gap: 10,
        }}
    >
        <TouchableOpacity
            onPress={() => {
                router.push('/teacher-gatepass');
            }}
            style={{
                justifyContent:'center',
                alignItems: 'center',
                padding: 30,
                backgroundColor: '#669bbc',
                borderRadius: 10,
                marginTop: 10,
                flex:1,
            }}
        >
            <Text
                style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                }}
            >
                GatePass
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => {
                router.push('/college-diaries');
            }}
            style={{
                justifyContent:'center',
                alignItems: 'center',
                padding: 30,
                backgroundColor: '#fefae0',
                borderRadius: 10,
                marginTop: 10,
                flex:1,
            }}
        >
            <Text
                style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                }}
            >
                Insight
            </Text>
            <Text
                style={{
                    fontSize: 20,
                    fontFamily: 'sans-serif',
                    fontWeight: 'bold',
                }}
            >
                Circle
            </Text>
        </TouchableOpacity>
    </View>
  )
}