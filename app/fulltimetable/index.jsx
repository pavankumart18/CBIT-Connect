import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function FullTimeTable() {
  const FullTable = useLocalSearchParams();
  const [currentDayIndex, setCurrentDayIndex] = useState(daysOfWeek.indexOf(new Date().toLocaleDateString('en-US', { weekday: 'long' })));
  const navigation = useNavigation();
  const router = useRouter();

  const colors=[
    '#80ffdb',
    '#72efdd',
    '#64dfdf',
    '#56cfe1',
    '#48bfe3',
    '#4ea8de',
    '#5390d9',
  ]

  const handlePreviousDay = () => {
    setCurrentDayIndex((prevIndex) => (prevIndex - 1 + daysOfWeek.length) % daysOfWeek.length);
  };

  const handleNextDay = () => {
    setCurrentDayIndex((prevIndex) => (prevIndex + 1) % daysOfWeek.length);
  };

  const Timings = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
  ];

  const currentDay = daysOfWeek[currentDayIndex];
  const timetableString = FullTable[currentDay] || '';
  const timetableData = timetableString.split(','); // Split the string into an array

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <View style={{
      flex: 1,
      padding: 10,
      paddingTop: 50,
      backgroundColor: Colors.lightblack,
    }}>
      <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
        <AntDesign name="left" size={30} color="white" />
      </TouchableOpacity>
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        color: Colors.white,
      }}>
        Full Time Table
      </Text>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        padding: 20,
      }}>
        <TouchableOpacity onPress={handlePreviousDay} style={{ padding: 8 }}>
          <AntDesign name="left" size={30} color="white" />
        </TouchableOpacity>
        <Text style={{
          fontSize: 25,
          fontWeight: 'bold',
          color: 'white',
        }}>{currentDay}</Text>
        <TouchableOpacity onPress={handleNextDay} style={{ padding: 8 }}>
          <AntDesign name="right" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <View style={{ padding: 16 }}>
        {currentDay === 'Sunday' ? (
          <View style={{
            padding: 20,
            backgroundColor: '#64dfdf',
            borderRadius: 10,
            marginBottom: 8,
            paddingVertical: 100,
          }}>
            <Text style={{
              fontSize: 20,
              color: 'black',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
              Focus on your skills
            </Text>
          </View>
        ) : (
          Timings.map((time, index) => (
            <View key={index} style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 8,
              backgroundColor: colors[index],
              borderRadius: 10,
              marginBottom: 8,
              padding: 20,
              borderWidth: 1,
              paddingVertical: 20,
            }}>
              <Text style={{
                color: 'black',
                flex: 1,
                fontWeight: 'bold',
                fontSize: 16,
              }}>{time}</Text>
              <Text style={{
                color: 'black',
                flex: 1,
                textAlign: 'right',
                fontWeight: 'bold',
                fontSize: 16,
              }}>{timetableData[index] || 'No Task'}</Text>
            </View>
          ))
        )}
      </View>
      {currentDay !== 'Sunday' && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 20,
          backgroundColor: 'lightblue',
          borderRadius: 10,
          marginBottom: 8,
        }}>
          <MaterialIcons name="notification-important" size={30} color="black" />
          <Text style={{
            color: 'black',
            fontSize: 16,
            fontWeight: 'bold',
            marginLeft: 10,
          }}>
            12:00 PM - 1:00 PM  Lunch Break
          </Text>
        </View>
      )}
    </View>
  );
}
