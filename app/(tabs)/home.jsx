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
            console.log(userData);
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
            console.log(user);
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
                barStyle="light-content" // Adjust the color of text and icons
                backgroundColor={Colors.lightblack} // Background color for Android
                translucent={false} // Set to true if you want the status bar to be translucent
            />

            <View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center', // Align items vertically
                        marginTop: 50, // Move this to the parent View to affect both child elements
                    }}
                >
                    <TouchableOpacity
                        onPress={() => router.push('/profile')}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center', // Align items vertically within this View
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
                    <TouchableOpacity
                        onPress={() => router.push('/notification')}
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
                </View>
            </View>
           {/* Attendance */}
           <Attendance attendance={userData?.attendance}/> 


           {/* Time Table */}
           <TimeTable userData={userData}/>


           {/* Apply GatePass Results */}
           <GatePass />

            {/* Courses */}
            <Courses userData={userData} />

            {/*  About Us  */}
            <AboutUs />
        </View>
        </ScrollView>
    );
}
