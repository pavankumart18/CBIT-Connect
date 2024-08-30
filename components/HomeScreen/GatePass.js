import { View, Text, TouchableOpacity, StyleSheet ,Alert} from 'react-native';
import React from 'react';
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';
export default function GatePass() {
    const router = useRouter();
  return (
    <View style={{ marginTop: 25, flexDirection: 'row', gap: 20 }}>
      <TouchableOpacity
        onPress={() => {
            router.push('gatepass');
          
        }}
        style={{
          backgroundColor: '#8667F2',
          padding: 30,
          borderRadius: 10,
          flex: 1, 
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: 'white',
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
          backgroundColor: '#8667F2',
          padding: 30,
          borderRadius: 10,
          flex: 1, 
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          Insight 
        </Text>
        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          Circle 
        </Text>
      </TouchableOpacity>
    </View>
  );
}
