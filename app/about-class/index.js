import { View, Text,TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { auth, db } from '../../configs/FireBaseConfigs'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Colors } from '../../constants/Colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
export default function AboutClass() {
    const router = useRouter()
    const course = useLocalSearchParams('course')
    const [classData, setClassData] = useState([])
    const user = auth.currentUser
    const navigation = useNavigation()

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    })
  return (
    <View
        style={{
            flex:1,
            backgroundColor: Colors.lightblack,
            padding:20,
            paddingTop:60,
        }}
    >
        <View
            style={{
                flexDirection:'row',
                alignItems:'center',
                marginBottom:20,
                gap:20,
            }}
        >
        <TouchableOpacity
            onPress={() => router.back()}
        >
            <Ionicons name="arrow-back" size={30} color={Colors.white} />
        </TouchableOpacity>
      <Text
        style={{
            color:Colors.white,
            fontSize:24,
            fontWeight:'bold',
        }}
      >{course?.class}</Text>
      </View>

      <View>
        <View
            style={{
                backgroundColor:Colors.white,
                flexDirection:'row',
                justifyContent:'space-between',
                alignItems:'center',
                padding:20,
                borderRadius:10,
            }}
        >
            <Text
                style={{
                    fontSize:20,
                    fontWeight:'bold',
                }}
            >
                Student Info
            </Text>
            <TouchableOpacity
                onPress={() => router.push({
                    pathname:'/view-class',
                    params:course,
                })}
                style={{
                    backgroundColor:Colors.black,
                    padding:10,
                    borderRadius:99,
                }}
            >
                <Text
                    style={{
                        color:Colors.white,
                        fontWeight:'bold',
                    }}
                >
                    View
                </Text>
            </TouchableOpacity>
        </View>
        <View
            style={{
                backgroundColor:Colors.white,
                flexDirection:'row',
                justifyContent:'space-between',
                alignItems:'center',
                padding:20,
                borderRadius:10,
                marginTop:20,
            }}
        >
            <Text
                style={{
                    fontSize:20,
                    fontWeight:'bold',
                }}
            >
                Schedule Assignments
            </Text>
            <TouchableOpacity
                onPress={() => router.push({
                    pathname:'/schedule-assignments',
                    params:course,
                })}
                style={{
                    backgroundColor:Colors.black,
                    padding:10,
                    borderRadius:99,
                }}
            >
                <Ionicons name="add" size={24} color={Colors.white} />
            </TouchableOpacity>
        </View>
        <View
            style={{
                backgroundColor:Colors.white,
                flexDirection:'row',
                justifyContent:'space-between',
                alignItems:'center',
                padding:20,
                borderRadius:10,
                marginTop:20,
            }}
        >
            <Text
                style={{
                    fontSize:20,
                    fontWeight:'bold',
                }}
            >
                Scheduled Assignments
            </Text>
            <TouchableOpacity
                onPress={() => router.push({
                    pathname:'/scheduled-assignments',
                    params:course,
                })}
                style={{
                    backgroundColor:Colors.black,
                    padding:10,
                    borderRadius:99,
                }}
            >
                <Text
                    style={{
                        color:Colors.white,
                        fontWeight:'bold',
                    }}
                >
                    View
                </Text>
            </TouchableOpacity>
        </View>

        <View
            style={{
                backgroundColor:Colors.white,
                flexDirection:'row',
                justifyContent:'space-between',
                alignItems:'center',
                padding:20,
                borderRadius:10,
                marginTop:20,
            }}
        >
            <Text
                style={{
                    fontSize:20,
                    fontWeight:'bold',
                }}
            >
                Class Materials / Notes
            </Text>
            <TouchableOpacity
                // onPress={() => router.push({
                //     pathname:'/class-materials',
                //     params:course,
                // })}
                style={{
                    backgroundColor:Colors.black,
                    padding:10,
                    borderRadius:99,
                }}
            >
                    <Ionicons name="add" size={24} color={Colors.white} />
                
            </TouchableOpacity>
        </View>
        <View
            style={{
                backgroundColor:Colors.white,
                flexDirection:'row',
                justifyContent:'space-between',
                alignItems:'center',
                padding:20,
                borderRadius:10,
                marginTop:20,
            }}
        >
            <Text
                style={{
                    fontSize:20,
                    fontWeight:'bold',
                }}
            >
                Schedule Slip Test
            </Text>
            <TouchableOpacity
                // onPress={() => router.push({
                //     pathname:'/class-materials',
                //     params:course,
                // })}
                style={{
                    backgroundColor:Colors.black,
                    padding:10,
                    borderRadius:99,
                }}
            >
                    <Ionicons name="add" size={24} color={Colors.white} />

            </TouchableOpacity>
        </View>
        <View
            style={{
                backgroundColor:Colors.white,
                flexDirection:'row',
                justifyContent:'space-between',
                alignItems:'center',
                padding:20,
                borderRadius:10,
                marginTop:20,
            }}
        >
            <Text
                style={{
                    fontSize:20,
                    fontWeight:'bold',
                }}
            >
                Scheduled Slip Test
            </Text>
            <TouchableOpacity
                // onPress={() => router.push({
                //     pathname:'/class-materials',
                //     params:course,
                // })}
                style={{
                    backgroundColor:Colors.black,
                    padding:10,
                    borderRadius:99,
                }}
            >
                <Text
                    style={{
                        color:Colors.white,
                        fontWeight:'bold',
                    }}
                >
                    View
                </Text>
            </TouchableOpacity>
        </View>

        
      </View>
    </View>
  )
}