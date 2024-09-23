import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors } from '../../constants/Colors';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../configs/FireBaseConfigs';

const vibrantColors = [
  '#ff6f61',
  '#6a0572',
  '#003f5c',
  '#ffa600',
  '#bc5090',
];

const getRandomColor = () => {
  return vibrantColors[Math.floor(Math.random() * vibrantColors.length)];
};

const handleViewClick = (url) => {
  Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
};

const formatDate = (dueDate) => {
  if (dueDate) {
    const date = new Date(dueDate);
    return date.toLocaleDateString(); 
  }
  return 'Unknown date';
};

export default function Assignments({ userData }) {
  const [Assignments, setAssignments] = useState([]);

  const GetAssignments = async () => {
    try {
      const q = query(
        collection(db, 'assignments'),
        where('class', '==', userData?.class),
        where('sem', '==', userData?.sem)
      );
      const querySnapshot = await getDocs(q);
      let assignmentsList = [];
      querySnapshot.forEach((doc) => {
        assignmentsList.push({ id: doc.id, ...doc.data() });
      });
      setAssignments(assignmentsList);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  useEffect(() => {
    if (userData?.class) {
      console.log('Fetching assignments...');
      GetAssignments();
    }
  }, [userData]);

  return (
    <View style={{ marginTop: 25, backgroundColor: Colors.lightblack, flex: 1 }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white' }}>Assignments</Text>
      <ScrollView
        style={{ marginTop: 20 }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {Assignments.length > 0 ? (
          Assignments.map((assignment, index) => (
            <View
              key={index}
              style={{
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#ccc',
                width: 250,
                height: 150, // Adjust height as needed
                marginHorizontal: 5,
                backgroundColor: getRandomColor(),
                borderRadius: 10,
                padding: 20,
              }}
            >
              <Text style={{ fontSize: 25, color: 'white', fontWeight: 'bold', marginTop: 20 }}>
                {assignment.title}
              </Text>
              <Text style={{ fontSize: 20, color: 'white', marginTop: 5 }}>
                Due: {formatDate(assignment.dueDate)}
              </Text>
              <Text style={{ fontSize: 20, color: 'white', marginTop: 5 }}>
                Subject: {assignment.subject}
              </Text>
            </View>
          ))
        ) : (
          <Text style={{ fontSize: 18, color: 'white' }}>No assignments available</Text>
        )}
      </ScrollView>
    </View>
  );
}
