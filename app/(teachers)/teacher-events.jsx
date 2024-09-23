import { View, Text } from 'react-native'
import React ,{useState}from 'react'
import { useNavigation } from 'expo-router'
import { Colors } from '../../constants/Colors'
import { StatusBar } from 'react-native'
import CalendarHeader from '../../components/EventsScreen/CalendarHeader'
import TaskCard from '../../components/EventsScreen/TaskCard'
import TeacherTaskCard from '../../components/EventsScreen/TeacherTaskCard'

export default function TeacherEvents() {
    const navigation = useNavigation()
    const [selectedDate, setSelectedDate] = useState(new Date());

    React.useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        }) 
    }, [])

  return (
    <View
        style={{
            height: '100%',
            backgroundColor: Colors.black,
            padding: 20,
        }}
    >
        <StatusBar 
                barStyle="light-content" 
                backgroundColor={Colors.lightblack} 
                translucent={false}
            />
      <Text
        style={{
            color: Colors.white,
            padding: 10,
            fontSize: 30,
            fontWeight: 'bold',
            marginTop: 50,
        }}
      >Events</Text>
      {/* Calendar Header */}
      <CalendarHeader 
        selectedDate={selectedDate} 
        onDateSelect={setSelectedDate} 
      />
      {/* Tasks */}
      <TeacherTaskCard
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
    </View>
  )
}