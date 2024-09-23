import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert
  } from 'react-native';
  import React, { useState } from 'react';
  import { useLocalSearchParams, useNavigation } from 'expo-router';
  import { Colors } from '../../constants/Colors';
  import { useRouter } from 'expo-router';
  import { useEffect } from 'react';
  import Ionicons from '@expo/vector-icons/Ionicons';
  import DateTimePicker from '@react-native-community/datetimepicker'; 
  import { collection, addDoc } from 'firebase/firestore';
  import { db } from '../../configs/FireBaseConfigs'; 
  
  export default function ScheduleAssignments() {
    const router = useRouter();
    const navigation = useNavigation();
    const course = useLocalSearchParams('course');
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false); 
  
    useEffect(() => {
      navigation.setOptions({
        headerShown: false,
      });
    }, []);
  
    const handleDateChange = (event, selectedDate) => {
      setShowDatePicker(false);
      if (selectedDate) {
        setDueDate(selectedDate);
      }
    };
  
    const handleSubmit = async () => {
      try {
        await addDoc(collection(db, 'assignments'), {
          title,
          dueDate: dueDate.toISOString(), 
          class: course?.class,
          sem: course?.sem,
          subject: course?.subject,
          createdAt: new Date().getTime(),
        });
        Alert.alert('Success', 'Assignment scheduled successfully.');
        router.back(); 
      } catch (error) {
        console.error('Error adding assignment:', error);
        Alert.alert('Error', 'Failed to schedule assignment.');
      }
    };
  
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.lightblack,
          padding: 20,
          paddingTop: 60,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
            gap: 20,
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={30} color={Colors.white} />
          </TouchableOpacity>
          <Text
            style={{
              color: Colors.white,
              fontSize: 24,
              fontWeight: 'bold',
            }}
          >
            Schedule Assignments
          </Text>
        </View>
  
        <View>
          <View>
            <Text
              style={{
                color: Colors.white,
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 10,
                marginTop: 10,
              }}
            >
              Title of the Assignment
            </Text>
            <TextInput
              placeholder="Enter the title of the assignment"
              placeholderTextColor={Colors.white}
              value={title}
              onChangeText={setTitle}
              style={{
                padding: 15,
                borderRadius: 99,
                marginBottom: 20,
                color: Colors.white,
                borderColor: Colors.white,
                borderWidth: 1,
              }}
            />
          </View>
  
          <View>
            <Text
              style={{
                color: Colors.white,
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 10,
                marginTop: 10,
              }}
            >
              Due Date
            </Text>
            <View
              style={{
                padding: 15,
                borderRadius: 99,
                marginBottom: 20,
                color: Colors.white,
                borderColor: Colors.white,
                borderWidth: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: Colors.white }}>
                {dueDate.toDateString()}
              </Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar" size={24} color={Colors.white} />
                </TouchableOpacity>
            </View>
  
            {showDatePicker && (
              <DateTimePicker
                value={dueDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
  
          <View>
            <Text
              style={{
                color: Colors.white,
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 10,
                marginTop: 10,
              }}
            >
              Class
            </Text>
            <TextInput
              placeholder="Enter the class"
              value={course?.class}
              placeholderTextColor={Colors.white}
              style={{
                padding: 15,
                borderRadius: 99,
                marginBottom: 20,
                color: Colors.white,
                borderColor: Colors.white,
                borderWidth: 1,
              }}
            />
          </View>
  
          <View>
            <Text
              style={{
                color: Colors.white,
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 10,
                marginTop: 10,
              }}
            >
              Sem
            </Text>
            <TextInput
              placeholder="Enter the semester"
              value={course?.sem}
              placeholderTextColor={Colors.white}
              style={{
                padding: 15,
                borderRadius: 99,
                marginBottom: 20,
                color: Colors.white,
                borderColor: Colors.white,
                borderWidth: 1,
              }}
            />
          </View>
  
          <View>
            <Text
              style={{
                color: Colors.white,
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 10,
                marginTop: 10,
              }}
            >
              Subject
            </Text>
            <TextInput
              placeholder="Enter the subject"
              value={course?.subject}
              placeholderTextColor={Colors.white}
              style={{
                padding: 15,
                borderRadius: 99,
                marginBottom: 20,
                color: Colors.white,
                borderColor: Colors.white,
                borderWidth: 1,
              }}
            />
          </View>
  
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              backgroundColor: Colors.white,
              padding: 15,
              borderRadius: 99,
              alignItems: 'center',
              marginTop: 20,
            }}
          >
            <Text
              style={{
                color: Colors.black,
                fontSize: 20,
                fontWeight: 'bold',
              }}
            >
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  