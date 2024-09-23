import { View, Text,TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { auth, db } from '../../configs/FireBaseConfigs'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Colors } from '../../constants/Colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
export default function ViewClass() {
    const router = useRouter()
    const course = useLocalSearchParams('course')
    const [classData, setClassData] = useState([])
    const user = auth.currentUser
    const navigation = useNavigation()

    

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
        if (user) {
            fetchClassData()
        }
    }
    , [])

    const fetchClassData = async () => {
        try {
            const q = query(collection(db, 'MyInfo'), where('class', '==', course?.class),
                where('sem', '==', course?.sem))
            const querySnapshot = await getDocs(q)
            // querySnapshot is an array of documents
            if (!querySnapshot.empty) {
                dummy = []
                querySnapshot.forEach((doc) => {
                    const fetchedClassData = doc.data()
                    dummy.push({ id: doc.id, ...fetchedClassData })
                })
                setClassData(dummy)
                console.log('Class Data:', classData)
            } else {
                console.log('No Data', 'No class information found for the specified class.')
            }
        } catch (error) {
            console.error('Error fetching class data:', error)
        }
    }


  return (
    <View
        style={{
            flex:1,
            backgroundColor: Colors.lightblack,
            padding:20,
            paddingTop:60,
        }}
    >
      <View>
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap:10,
            }}
        >
        <TouchableOpacity
            onPress={() => router.back()}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            <Ionicons name="arrow-back" size={30} color={Colors.white} />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, color: Colors.white,fontWeight:'bold' }}>{course?.class}</Text>
        </View>
      </View>
       <View>
         {classData.map((item,index) => (
            <View
            key={index}
            style={{
                backgroundColor: Colors.lightGray,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 20,
                borderRadius: 8,
                marginTop: 20,
            }}
            >
            <View
                key={item.id}
                style={{
                    flexDirection: 'row',
                }}
            >
                <Image source={ item?.profile ? { uri: item?.profile } : require('../../assets/images/profile.jpeg') } 
                style={{ width: 50, height: 50, borderRadius: 50,marginRight:10 }} />
                <View>
                    <Text style={{ fontSize: 16,fontWeight:'bold' }}>{item?.Name}</Text>
                    <Text style={{ fontSize: 14,marginTop:5 }}>{item?.no}</Text>
                    <Text style={{ fontSize: 14,marginTop:5 }}>{item?.mobile}</Text>
                </View>

            </View>
            <TouchableOpacity
                onPress={() =>
                    router.push({
                        pathname: '/view-student',
                        params: item,
                    })
                }
                style={{
                    backgroundColor: Colors.black,
                    padding: 10,
                    borderRadius: 99,
                }}
            >
                <Text style={{ color: Colors.white, fontWeight: 'bold' }}>View</Text>
            </TouchableOpacity>

            </View>
            ))}
       </View>
    </View>
  )
}