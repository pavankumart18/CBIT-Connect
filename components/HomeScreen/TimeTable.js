import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../../constants/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db, auth } from '../../configs/FireBaseConfigs';
import { useRouter } from 'expo-router';

export default function TimeTable({ userData }) {
  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;
  const router = useRouter();
  const [FullTable, setFullTable] = useState([]);

  const FullTimeTable = () => {
    router.push({
      pathname: '/fulltimetable',
      params: FullTable,
    });
  };

  const GetUserData = async () => {
    if (user) {
      try {
        const q = query(collection(db, 'ClassInfo'), where('class', '==', userData?.class));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const fetchedClassInfo = querySnapshot.docs[0].data();
          setClassInfo(fetchedClassInfo);
          setFullTable(fetchedClassInfo.TimeTable);
          // console.log('Fetched Class Info:', fetchedClassInfo);
        } else {
          Alert.alert('No Data', 'No class information found for the specified class.');
        }
      } catch (error) {
        console.error('Error fetching class data:', error);
        // Alert.alert('Error', 'Unable to fetch class data. Please try again later.');
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Error', 'Please re-login to continue.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      // console.log('Fetching class info...');
      GetUserData();
    }
  }, [userData]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!classInfo || !userData) {
    return <Text>Data not available.</Text>;
  }

  const Timings = [
    '9:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 1:00', // Lunch break
    '1:00 - 2:00',
    '2:00 - 3:00',
    '3:00 - 4:00',
  ];

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = daysOfWeek[new Date().getDay()];
  const currentHour = new Date().getHours();

  let displayMessage = '';
  let displayTiming = '';
  let roomNumber = '';

  const classStartHour = 9;
  const classEndHour = 15;

  if (currentDay === 'Sunday') {
    displayMessage = 'Focus on your skills!';
  } else {
    if (currentHour < classStartHour) {
      displayMessage = `Upcoming: ${classInfo.TimeTable[currentDay][0]}`;
      displayTiming = Timings[0];
      roomNumber = classInfo.Room;
    } else if (currentHour >= classStartHour && currentHour <= classEndHour) {
      console.log('Current day:', currentHour);
      for (let i = 0; i < Timings.length; i++) {
        const [startTime, endTime] = Timings[i].split(' - ');
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        // console.log(startHour, startMinute, endHour, endMinute);

        const start = new Date().setHours(startHour, startMinute, 0, 0);
        const end = new Date().setHours(endHour, endMinute, 0, 0);

        if (new Date().getTime() >= start && new Date().getTime() < end) {
          console.log('Class time:', Timings[i]);
          if (Timings[i] === '12:00 - 1:00') {
            console.log("It's lunch time!");
            displayMessage = 'Lunch Break';
            displayTiming = Timings[i];
          } else {
            displayMessage = classInfo.TimeTable[currentDay][i];
            displayTiming = Timings[i];
            roomNumber = classInfo.Room;
          }
          break;
        }
      }
    } else {
      displayMessage = '\nFocus on your skills!\nNo classes scheduled.';
    }
  }

  return (
    <View style={{ marginTop: 25 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white' }}>TimeTable</Text>
        <TouchableOpacity
          onPress={FullTimeTable}
          style={{
            backgroundColor: Colors.white,
            borderRadius: 99,
            paddingHorizontal: 20,
            paddingVertical: 10,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold' }}>View Full TimeTable</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          backgroundColor: Colors.lavender,
          padding: 30,
          borderRadius: 10,
          marginTop: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>{displayMessage}</Text>
          {displayTiming && (
            <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold' }}>{displayTiming}</Text>
          )}
          {roomNumber && (
            <Text style={{ color: 'black', fontSize: 16, marginTop: 30, fontWeight: 'bold' }}>
              Room No: {roomNumber}
            </Text>
          )}
        </View>
        <MaterialCommunityIcons name="timetable" size={90} color="black" />
      </View>
    </View>
  );
}
