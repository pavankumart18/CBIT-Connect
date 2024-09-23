import { View, Text, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native'; 
import { Colors } from '../../constants/Colors';
import TeacherHeader from '../../components/THomeScreen/TeacherHeader';
import { StatusBar } from 'react-native';
import TWhatsUp from '../../components/THomeScreen/TWhatsUp';
import TClasses from '../../components/THomeScreen/TClasses';
import TGroups from '../../components/THomeScreen/TGroups';
import AboutUs from '../../components/HomeScreen/AboutUs';
export default function TeacherHome() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []); 

  return (
    <View
      style={{
        backgroundColor: Colors.lightblack,
        paddingTop: 60,
        padding:10,
        flex: 1,
      }}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.lightblack} translucent={false} />
      <TeacherHeader />
      <ScrollView contentContainerStyle={{ padding: 10 }}>
        <TWhatsUp />
        <TClasses />
        <TGroups />
        <AboutUs />
      </ScrollView>
    </View>
  );
}
