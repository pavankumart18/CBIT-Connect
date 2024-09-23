import { View, Text, Image, TouchableOpacity } from 'react-native';
import React,{useEffect} from 'react';
import { useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { StatusBar } from 'react-native';
import { auth, db } from '../../configs/FireBaseConfigs';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Attendance from '../../components/HomeScreen/Attendance';
import TimeTable from '../../components/HomeScreen/TimeTable';
import GatePass from '../../components/HomeScreen/GatePass';
import Courses from '../../components/HomeScreen/Courses';
import { ScrollView } from 'react-native';
import AboutUs from '../../components/HomeScreen/AboutUs';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import Assignments from '../../components/HomeScreen/Assignments';
import Foundation from '@expo/vector-icons/Foundation';
import { Ionicons } from '@expo/vector-icons';
import TWhatsUp from '../../components/THomeScreen/TWhatsUp';
export default function Home() {
    const navigation = useNavigation();
    const user = auth.currentUser;
    const [userData, setUserData] = React.useState({});
    const router = useRouter();

    const GetUserData =  async () => {
        if (user) {
            const q = query(collection(db, 'MyInfo'),where('email', '==', user.email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUserData(doc.data());
            });
            // console.log(userData);
        }else{
            Alert.alert('Error','Once Re-Login');
        }
    }


    React.useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    useEffect(() => {
        if (user) {
            console.log('Fetching user data...');
            // console.log(user);
        GetUserData();
        }
    }
    ,[user]);
    return (
        <ScrollView>
        <View
            style={{
                height: '100%',
                backgroundColor: Colors.lightblack,
                padding: 20,
            }}
        >
            <StatusBar
                barStyle="light-content" 
                backgroundColor={Colors.lightblack} 
                translucent={false} 
            />

            <View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 50, 
                    }}
                >
                    <TouchableOpacity
                        onPress={() => router.push('/profile')}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center', 
                        }}
                    >
                        <Image
                            source={ userData?.profileUrl ? {uri: userData?.profileUrl} : require('../../assets/images/profile.jpeg')}
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: 50,
                                borderWidth: 2,
                                borderColor: Colors.white,
                            }}
                        />
                        <Text
                            style={{
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: 'bold',
                                marginLeft: 10,
                            }}
                        >
                            Hello, {userData?.Name}
                        </Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                        onPress={() => router.push('/notification')}

                    >
                    <FontAwesome5 name="bell" size={24} color={'black'} />
                    </TouchableOpacity> */}
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
                        style={{
                            backgroundColor: 'white',
                            padding: 10,
                            borderRadius: 99,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}

                    >
                    <FontAwesome5 name="bell" size={24} color={'black'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            router.push('posts');
                        }}
                        style={{
                            backgroundColor: 'white',
                            padding: 10,
                            borderRadius: 99,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}

                    >
                        <Foundation name="social-instagram" size={30} color="black" />
                    </TouchableOpacity>
                    </View>
                </View>
            </View>
            {/* Whats Up */}
            <TWhatsUp />
           {/* Attendance */}
           <Attendance attendance={userData?.attendance}/> 


           {/* Time Table */}
           <TimeTable userData={userData}/>


           {/* Apply GatePass Results */}
           <GatePass />

            <Assignments userData={userData} />

            {/* Courses */}
            <Courses userData={userData} />

            {/* Assignments */}


            {/*  About Us  */}
            <AboutUs />
        </View>
        </ScrollView>
    );
}
