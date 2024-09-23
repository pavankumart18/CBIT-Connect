import { View, Text, ScrollView, TouchableOpacity,Linking } from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth } from '../../configs/FireBaseConfigs';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../configs/FireBaseConfigs';
import { Colors } from '../../constants/Colors';

const vibrantColors = [
  '#9b5de5', 
  '#f15bb5',
  '#9f86c0', 
  '#57cc99', 
  '#ff99c8', 
];

const getRandomColor = () => {
  return vibrantColors[Math.floor(Math.random() * vibrantColors.length)];
};
const handleViewClick = (url) => {
  Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
};

export default function Courses() {
  const user = auth.currentUser;
  const [MyInfo, setMyInfo] = useState({});
  const [Subjects, setSubjects] = useState([]);

  const GetSubjects = async () => {
    try {
      if(user){
        const q1 = query(collection(db, 'MyInfo'), where('email', '==', user?.email));
        const querySnapshot1 = await getDocs(q1);
        querySnapshot1.forEach((doc) => {
          setMyInfo(doc.data());
        });

        if(MyInfo){
          const q2 = query(collection(db, 'ClassInfo'), where('class', '==', MyInfo?.class));
          const querySnapshot2 = await getDocs(q2);
          let subjectsList = [];
          querySnapshot2.forEach((doc) => {
            subjectsList = doc.data().Subjects;
          });
          setSubjects(subjectsList);
      }
      }else{
        return (
          <View>
            <Text>
              Loading....
            </Text>
          </View>
        )
      }
    } catch (error) {
      console.log("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    if (user) {
      console.log('Fetching subjects...');
      console.log(user);
      GetSubjects();
    }
  }, [user, MyInfo?.class]);

  return (
    <View style={{ marginTop: 25, backgroundColor: Colors.lightblack, flex: 1 }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white' }}>Courses</Text>
      <ScrollView
        style={{ marginTop: 20 }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {Subjects.length > 0 ? (
          Subjects.map((subject, index) => (
            <View
              key={index}
              style={{
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#ccc',
                width: 250,
                height: 180, 
                marginHorizontal: 5,
                backgroundColor: getRandomColor(),
                borderRadius: 10,
                padding:20,
              }}
            >
              <Text style={{ fontSize: 25, color: 'white', fontWeight: 'bold',
                marginTop: 20
               }}>{subject.name}</Text>
              <Text style={{ fontSize: 20, color: 'white', marginTop: 5 }}>{subject.teacher}</Text>
              <TouchableOpacity
                onPress={() => handleViewClick(subject.course)}
                style={{
                  backgroundColor: 'white',
                  padding: 10,
                  borderRadius: 99,
                  marginTop: 10,
                  width: 80,
                }}
              >
                <Text style={{ fontSize: 18, color: 'black',textAlign:'center' }}>View</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={{ fontSize: 18, color: 'white' }}>No subjects available</Text>
        )}
      </ScrollView>
    </View>
  );
}
