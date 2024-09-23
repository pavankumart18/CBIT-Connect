import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../configs/FireBaseConfigs';
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Timings = [
  { time: '9:00 AM - 10:00 AM', start: 9, end: 10 },
  { time: '10:00 AM - 11:00 AM', start: 10, end: 11 },
  { time: '11:00 AM - 12:00 PM', start: 11, end: 12 },
  { time: '1:00 PM - 2:00 PM', start: 13, end: 14 },
  { time: '2:00 PM - 3:00 PM', start: 14, end: 15 },
  { time: '3:00 PM - 4:00 PM', start: 15, end: 16 },
];

export default function TClasses() {
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchTimetable = async () => {
      if (user) {
        try {
          const q = query(collection(db, 'timetablet'), where('email', '==', user?.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const fetchedClassInfo = querySnapshot.docs[0].data();
            setTimetable(fetchedClassInfo.timetable || {}); 
          } else {
            Alert.alert('No Data', 'No timetable information found for the specified user.');
          }
        } catch (error) {
          console.error('Error fetching timetable:', error);
          Alert.alert('Error', 'Unable to fetch timetable data. Please try again later.');
        } finally {
          setLoading(false);
        }
      } else {
        Alert.alert('Error', 'Please re-login to continue.');
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [user]);

  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const currentHour = new Date().getHours();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!timetable) {
    return <Text>No timetable available.</Text>;
  }

  if (currentDay === 'Sunday') {
    return (
      <View style={{ padding: 20 ,
        backgroundColor: '#84a98c',
        borderRadius: 10,
        marginTop: 10,
      }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: Colors.white,
         }}>
          No classes scheduled for today (Sunday).
        </Text>
      </View>
    );
  }

  const daySchedule = timetable[currentDay] || [];

  let classData = { class: 'No Class', sem: '', sub: '', venue: '' };
  let classTime = '';

  for (let i = 0; i < Timings.length; i++) {
    const timing = Timings[i];
    const schedule = daySchedule[i] || 'Nan'; 

    if (currentHour >= timing.start && currentHour < timing.end) {
      if (typeof schedule === 'object') {
        classData = schedule;
      }
      classTime = timing.time;
      break;
    } else if (currentHour < timing.start) {
      if (typeof schedule === 'object') {
        classData = schedule;
      }
      classTime = `Upcoming: ${timing.time}`;
      break;
    }
  }

  if (currentHour >= 16) {
    return (
      <View style={{ padding: 40,
        backgroundColor: '#84a98c',
        borderRadius: 10,
        marginTop: 10,
        alignContent: 'center',
        justifyContent: 'center',
       }}>
        <Text style={{ fontSize: 24, fontWeight: '500', color: Colors.black }}>
          "No more classes scheduled for today."
        </Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 0 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: Colors.white }}>TimeTable</Text>
        <TouchableOpacity
          onPress={() => router.push('/fulltimetableteacher')}
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

      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.lavender,
        borderRadius: 10,
        marginTop: 10,
      }}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{classData.sub || 'No Class'}</Text>
          <Text style={{ marginTop: 5, fontSize: 16 }}>{classData.class} | Sem: {classData.sem}</Text>
          <Text style={{ marginTop: 5, fontSize: 16 }}>{classData.venue}</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{classTime}</Text>
        </View>
        
      </View>
    </View>
  );
}
