import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { Colors } from '../../constants/Colors'
import { auth } from '../../configs/FireBaseConfigs'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import Foundation from '@expo/vector-icons/Foundation';
import { useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../configs/FireBaseConfigs';
export default function TeacherHeader() {
    const user = auth.currentUser;
    const router = useRouter();

    const [userData, setUserData] = useState(null);

    // Fetch User Data
    const fetchUserData = async () => {
      try {
        const q = query(collection(db, 'MyInfo'), where('email', '==', user?.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {

          const fetchedUserData = querySnapshot.docs[0].data();
          setUserData(fetchedUserData);
          // console.log('User Data:', fetchedUserData);
        } else {
          Alert.alert('No Data', 'No user information found for the specified user.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    useEffect(()=>{
      if(user){
        fetchUserData();
      }
    },[])

  return (
    <View
        style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        }}
    >
    <TouchableOpacity
        onPress={() => {
            router.push('/teacher-responsibilities');
          }}
        style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        }}
    >
      <Image source={ userData?.profileUrl ? { uri: userData?.profileUrl }: require('../../assets/images/profile.jpeg')} style={{ width: 50, height: 50, borderRadius: 50 }} />
      <Text
        style={{
          color: Colors.white,
          fontSize: 18,
          fontWeight: '700',
        }}
      >Hello, {userData?.Name}</Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          gap: 20,
          marginRight: 10,
        }}
      >
      <TouchableOpacity
        onPress={() => {
            router.push('/notification');
          }}
      >
      <Ionicons name="notifications-outline" size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
            router.push('posts');
          }}

      >
          <Foundation name="social-instagram" size={30} color="white" />
      </TouchableOpacity>
      </View>
    </View>
  )
}