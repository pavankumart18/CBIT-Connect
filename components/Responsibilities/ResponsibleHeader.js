import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity ,Dimensions,Linking} from 'react-native';
import {Colors} from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
const width = Dimensions.get('window').width; //full width
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { auth , db } from '../../configs/FireBaseConfigs';
import { collection, getDocs, query, where } from 'firebase/firestore';
import AboutUs from '../HomeScreen/AboutUs';


export default function ResponsibleHeader() {
  const [activeTab, setActiveTab] = useState('About'); // Default Tab
  const user = auth.currentUser;
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    try {
      const q = query(collection(db, 'teachers'), where('email', '==', user?.email));
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

  useEffect(() => {
    if (user)
    {
    fetchUserData();
    }
  }, []);


  const renderTabContent = () => {
    switch (activeTab) {
      case 'About':
        return (
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 16, lineHeight: 24 ,color:Colors.white}}>
              {userData?.about}
            </Text>
          </View>
        );
      case 'Courses':
        return (
          <View style={{ padding: 20 }}>
            {userData?.courses?.map((course, index) => (
              <View key={index} style={{ marginBottom: 15, backgroundColor: '#f9f9f9', padding: 15, borderRadius: 8 }}>
                <Text style={{ fontSize: 18 , fontWeight:'bold'}}>{course?.subject}</Text>
                <Text style={{ fontSize: 16, color: '#000' }}>Sem: {course?.sem}</Text>
              </View>
            ))}
          </View>
        );
      // case 'Projects':
      //   return (
      //     <View style={{ padding: 20 }}>
      //       <View style={{ marginBottom: 15, backgroundColor: '#f9f9f9', padding: 15, borderRadius: 8 }}>
      //         <Text style={{ fontSize: 18 }}>Project: School Management System</Text>
      //         <Text style={{ fontSize: 16, color: '#888' }}>Status: Completed</Text>
      //       </View>
      //       <View style={{ backgroundColor: '#f9f9f9', padding: 15, borderRadius: 8 }}>
      //         <Text style={{ fontSize: 18 }}>Project: AI-Based Student Grading System</Text>
      //         <Text style={{ fontSize: 16, color: '#888' }}>Status: In Progress</Text>
      //       </View>
      //     </View>
      //   );
      case 'Achievements':
        return (
          <View style={{ padding: 20 }}>
            {userData?.achivements?.map((achivement, index) => (
            <View key={index} style={{ marginBottom: 15, backgroundColor: '#f9f9f9', padding: 15, borderRadius: 8 }}>
              <Text style={{ fontSize: 18,fontWeight:'bold' }}>{achivement}</Text>
            </View>
            ))}
          </View>
        );
      case 'Classes':
        return (
          <View style={{ padding: 20 }}>
            {userData?.classes?.map((course, index) => (
            <View key={index} style={{ marginBottom: 15, backgroundColor: '#f9f9f9', padding: 15, borderRadius: 8,
              flexDirection: 'row', justifyContent: 'space-between',alignItems:'center'
             }}>
              <View>
              <Text style={{ fontSize: 16,fontWeight:'bold' }}>{course?.class}</Text>
              <Text style={{ fontSize: 14 ,marginTop:5}}>{course?.sem} Sem</Text>
              <Text style={{ fontSize: 14,marginTop:5 }}>
                {course?.subject}
              </Text>
              </View>
              <TouchableOpacity 
                onPress={() => router.push({
                  pathname: '/about-class',
                  params: course,
                })}
              style={{ backgroundColor: Colors.black, padding: 10, borderRadius: 99}}>
                <FontAwesome6 name="arrow-right" size={24} color="white" />
              </TouchableOpacity> 
            </View>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor:Colors.lightblack  }}>

      {/* Cover Photo */}
      <View style={{ 
        backgroundColor: '#0077b5', 
        height: 200,
        // marginTop:30,
        // borderBottomWidth: 2,
        // borderBottomColor: '#f9f9f9',
         }}>
        <Image
          source= { userData?.cover ? { uri: userData?.cover }: require('../../assets/images/cover.png')}
          style={{ 
            width: '100%', 
            height: '100%',
          }}
        />
      </View>

      {/* Profile Section */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
      <View style={{ padding: 20, backgroundColor: Colors.lightblack, alignItems:'flex-start',marginLeft:10 }}>
        <Image
          source={ userData?.profile ? { uri: userData?.profile }: require('../../assets/images/profile.jpeg')}
          style={{
            width: 130,
            height: 130,
            borderRadius: 99,
            borderWidth: 4,
            borderColor: Colors.black,
            marginTop: -50, 
            objectFit: 'cover',
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap:10,
          }}
        >
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 5,color:Colors.white }}>{userData?.name}</Text>
        <Text style={{ fontSize: 18, color: Colors.lightGray,marginTop:10 }}>- {userData?.designation}</Text>

        </View>
        <Text style={{ fontSize: 16, color: Colors.lightGray,marginTop:5 }}>{userData?.department}</Text>
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            marginTop: 5,
          }}
        >
          <Ionicons name="mail" size={24} color={Colors.lightGray} />
        <TouchableOpacity
        onPress={()=>{
          Linking.openURL(`mailto:${userData?.cmail}`)
        }}
        >
          <Text style={{ fontSize: 16, color: Colors.lightGray,marginTop:5 }}>
        {userData?.cmail}
        </Text>
        </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            marginTop: 5,
          }}
        >
          <Ionicons name="call" size={24} color={Colors.lightGray} />
        <Text style={{ fontSize: 16, color: Colors.lightGray,marginTop:5 }}>{userData?.phone}</Text>
        </View>
      </View>

      <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems:'flex-end',
            marginTop: 20,
            marginRight:10,
          }}
      >
            {/* logout */}
      <TouchableOpacity 
        onPress={() => {
          auth.signOut();
          router.replace('/DummyScreen/FourthScreen');
        }
        }
        style={{ backgroundColor: '#f9f9f9',
                 padding: 10, 
                 alignItems: 'center',
                 marginTop:10,
                 borderRadius: 99,
                 alignSelf:'center',
                 marginRight:20,
          }}>
        <Feather name="log-out" size={24} color="black" />
        {/* <Text style={{ fontSize: 16 }}>Logout</Text> */}
      </TouchableOpacity>
      {/* edit */}
      <TouchableOpacity 
        onPress = {() => {
          alert("This Feature is not available right now")
        }}
        style={{ backgroundColor: '#f9f9f9',
                 padding: 10, 
                 alignItems: 'center',
                 borderRadius: 99,
                 height: 40,
                  width: 40,
                  marginRight:20,
                 }}>
        <Feather name="edit-3" size={24} color="black" />
      </TouchableOpacity>
      </View>

      </View>


      {/* Tabs Section */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, backgroundColor: Colors.lightblack }}>
        <TouchableOpacity onPress={() => setActiveTab('About')}
          style={{ borderBottomWidth: activeTab === 'About' ? 2 : 0,
                    borderBottomColor: '#0077b5',
           }}
          >
          <Text style={{
            padding: 10,
            color: activeTab === 'About' ? '#f9f9f9' : '#888',
            borderBottomWidth: activeTab === 'About' ? 2 : 0,
            fontWeight: activeTab === 'About' ? 'bold' : 'normal',
          }}>
            About
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Courses')}
          style={{ borderBottomWidth: activeTab === 'Courses' ? 2 : 0,
                    borderBottomColor: '#0077b5',
                   
           }}
          >
          <Text style={{
            padding: 10,
            color: activeTab === 'Courses' ? '#f9f9f9' : '#888',
            borderBottomWidth: activeTab === 'Courses' ? 2 : 0,

            fontWeight: activeTab === 'Courses' ? 'bold' : 'normal',
          }}>
            Courses
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Classes')}
          style={{ borderBottomWidth: activeTab === 'Classes' ? 2 : 0,
                    borderBottomColor: '#0077b5',
           }}
          >
          <Text style={{
            padding: 10,
            color: activeTab === 'Classes' ? '#f9f9f9' : '#888',
            borderBottomWidth: activeTab === 'Classes' ? 2 : 0,
            fontWeight: activeTab === 'Classes' ? 'bold' :  'normal',
          }}>
            Classes
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => setActiveTab('Projects')}>
          <Text style={{
            padding: 10,
            color: activeTab === 'Projects' ? '#f9f9f9' : '#888',
            borderBottomWidth: activeTab === 'Projects' ? 2 : 0,
            borderBottomColor: '#0077b5',
          }}>
            Projects
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => setActiveTab('Achievements')}
          style={{ borderBottomWidth: activeTab === 'Achievements' ? 2 : 0,
                    borderBottomColor: '#0077b5',
           }}
          >
          <Text style={{
            padding: 10,
            color: activeTab === 'Achievements' ? '#f9f9f9' : '#888',
            borderBottomWidth: activeTab === 'Achievements' ? 2 : 0,
            fontWeight: activeTab === 'Achievements' ? 'bold' : 'normal',
          }}>
            Achievements
          </Text>
        </TouchableOpacity>
      </View>

      {/* Render Tab Content */}
      {renderTabContent()}




      <AboutUs />

    </ScrollView>
  );
}
