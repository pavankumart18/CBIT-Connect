import { View, Text } from 'react-native'
import React,{ useEffect} from 'react'
import { Colors } from '../../constants/Colors'
import { useNavigation } from 'expo-router'
import ResponsibleHeader from '../../components/Responsibilities/ResponsibleHeader'
import AboutUs from '../../components/HomeScreen/AboutUs'

export default function TeacherResponsibilities() {
  const navigation = useNavigation()
  useEffect(() => {
    navigation.setOptions({
      headerShown : false,
    })
  }, [])
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.lightblack,
        // paddingTop:60,
      }}
    >

      {/* <Text
        style={{
          color: Colors.white,
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >My Profile</Text> */}
      {/* top header section */}
      <ResponsibleHeader />

    </View>
  )
}