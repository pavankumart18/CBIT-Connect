import { View, Text, TouchableOpacity ,TextInput} from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { Colors } from '../../constants/Colors'
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { auth } from '../../configs/FireBaseConfigs';
import { doc, setDoc, collection } from "firebase/firestore"; 
import { db } from '../../configs/FireBaseConfigs';
export default function AddEvent() {
    const sendData = useLocalSearchParams();
    const navigation = useNavigation();
    const router = useRouter();
    const user = auth.currentUser;
    const [eventData, setEventData] = useState({
        date: sendData?.date,
        email: user?.email,
        eventName: '',
        timings: '',
        venue: '',
        status:'pending',
    });
    const [error, setError] = useState('');
    const [event, setEvent] = useState('');
    const [timings, setTimings] = useState('');
    const [venue, setVenue] = useState('');

    React.useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        }) 
    }, [])
    useEffect(() => {
        console.log("Sending Data")
        // console.log(sendData)
    }
    , [sendData])
    const AddEvent = async () => {
        if (event && timings && venue) {
            const eventDetails = {
                date: sendData?.date,
                email: user?.email,
                eventName: event,
                timings: timings,
                venue: venue,
                status:'pending',
            };
    
            try {
                await setDoc(doc(collection(db, "tasks")), eventDetails);
                console.log("Event added successfully:", eventDetails);
    
                router.push('/events');
            } catch (error) {
                console.error("Error adding event:", error);
                alert("Failed to add event. Please try again.");
            }
        } else {
            alert('Please fill in all the fields.');
        }
    };
    
  return (
    <View
        style={{
            height: '100%',
            backgroundColor: Colors.lightblack,
            padding: 24,
            paddingTop: 40,
        }}
    >
        <View
            style={{
                marginTop: 20,
            }}
        >
            <TouchableOpacity
                onPress={() => router.back()}
            >
                <Entypo name="chevron-left" size={40} color="white" />
            </TouchableOpacity>
        </View>
        <View
        style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20,
            gap: 20,
        }}
        >
        <Entypo name="pin" size={30} color="white" />
      <Text
        style={{
            color: Colors.white,
            fontSize: 30,
            fontWeight: 'bold',
        }}
      >Add Event</Text>
      </View>
      <View
        style={{
            marginTop: 20,
        }}
      >
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
        <Text
            style={{
                color: Colors.white,
                fontSize: 20,
                fontWeight: 'bold',
            }}
        >
            Date and Day
        </Text>
        <Text
            style={{
                color: Colors.white,
                fontSize: 20,
                fontWeight: 'bold',
            }}
        >
            {sendData?.date}
        </Text>
        </View>
      </View>
      <View
        style={{
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}
      > 
        <Text
            style={{
                color: Colors.white,
                fontSize: 20,
                fontWeight: 'bold',
            }}
        >
            Personal Details
        </Text>
        <Text
            style={{
                color: Colors.white,
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 10,
            }}
        >
            {user?.email}
        </Text>
      </View>
      <View>
        <Text
            style={{
                color: Colors.white,
                fontSize: 20,
                fontWeight: 'bold',
                marginTop: 20,
            }}
        >
            Event Name / Task Name
        </Text>
        <TextInput
            placeholder='Task Name'
            value={event}
            style={{
                backgroundColor: Colors.white,
                padding: 20,
                marginTop: 10,
                borderRadius: 20,
            }}
            onChangeText={(text) => setEvent(text)}
        />
      </View>
      <View>
        <Text
            style={{
                color: Colors.white,
                fontSize: 20,
                fontWeight: 'bold',
                marginTop: 20,
            }}
        >
            Timings
        </Text>
        <TextInput
            placeholder='12:00 PM - 1:00 PM'
            value={timings}
            style={{
                backgroundColor: Colors.white,
                padding: 20,
                marginTop: 10,
                borderRadius: 20,
            }}
            onChangeText={(text) => setTimings(text)}
        />
      </View>
      <View>
        <Text
            style={{
                color: Colors.white,
                fontSize: 20,
                fontWeight: 'bold',
                marginTop: 20,
            }}
        >
            venue / Room Number
        </Text>
        <TextInput
            value={venue}
            placeholder='CBIT'
            style={{
                backgroundColor: Colors.white,
                padding: 20,
                marginTop: 10,
                borderRadius: 20,
            }}
            onChangeText={(text) => setVenue(text)}
        />
      </View>
      <TouchableOpacity
        onPress={AddEvent}
        style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 99,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 30,
        }}
        >
        <Text
            style={{
                color: 'black',
                fontSize: 20,
                fontWeight: 'bold',
            }}
        >
            Add Event
        </Text>
        </TouchableOpacity>

    </View>
  )
}