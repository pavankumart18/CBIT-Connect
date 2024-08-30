import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { auth, db } from '../../configs/FireBaseConfigs';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';

export default function Notification() {
    const navigation = useNavigation();
    const user = auth.currentUser;
    const [notifications, setNotifications] = useState([]);
    const router = useRouter();
    const color = ['#e9ff70', '#fbff12', '#dee2e6'];

    const GetNotifications = async () => {
        const q = query(collection(db, 'notifications'), where('email', '==', user?.email));
        const querySnapshot = await getDocs(q);
        const notifications = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            notifications.push({ id: doc.id, ...data });
        });
        setNotifications(notifications);
        console.log('Notifications:', notifications);
    };

    const getRandomItem = () => {
        const randomIndex = Math.floor(Math.random() * color.length);
        return color[randomIndex];
    };

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
        if (user) {
            console.log('Fetching Notifications...');
            GetNotifications();
        }
    }, []);

    const handleDismiss = async (notificationId) => {
        try {
            // Create a reference to the notification document
            const notificationRef = doc(db, 'notifications', notificationId);
    
            // Delete the document using the reference
            await deleteDoc(notificationRef);
    
            // Update the local state to remove the notification from the list
            setNotifications(notifications.filter((notif) => notif.id !== notificationId));
    
            console.log('Notification successfully deleted:', notificationId);
    
        } catch (error) {
            console.error('Error deleting notification:', error.message);
        }
    };
    
    

    const handleAccept = (notificationId) => {
        console.log('Accepted:', notificationId);
        // Handle the accept logic here
    };

    const handleReject = (notificationId) => {
        console.log('Rejected:', notificationId);
        // Handle the reject logic here
    };

    const renderNotification = ({ item }) => (
        <View
            style={{
                backgroundColor: Colors.darkGray,
                padding: 15,
                borderRadius: 10,
                marginBottom: 10,
            }}
        >
            <View
                style={{
                    backgroundColor: getRandomItem(),
                    padding: 15,
                    borderRadius: 10,
                }}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>{item.title}</Text>
                    <TouchableOpacity onPress={() => handleDismiss(item.id)}>
                        <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <Text style={{ color: 'white', marginTop: 10 }}>{item.message}</Text>
                {item.title === 'Group Invitation' && (
                    <View style={{ marginTop: 5 }}>
                        <Text style={{ color: 'black', fontWeight: 'bold' }}>Person: {item.person}</Text>
                        <Text style={{ color: 'black', fontWeight: 'bold' }}>Class: {item.class}</Text>
                        <Text style={{ color: 'black', fontWeight: 'bold' }}>Section: {item.no}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 20, gap: 10 }}>
                            <TouchableOpacity
                                onPress={() => handleAccept(item.id)}
                                style={{
                                    backgroundColor: Colors.white,
                                    padding: 10,
                                    borderRadius: 99,
                                    borderColor: 'black',
                                    borderWidth: 1,
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <AntDesign name="check" size={24} color="green" />
                                    <Text style={{ color: 'green', fontWeight: 'bold', marginLeft: 5 }}>Accept</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleReject(item.id)}
                                style={{
                                    backgroundColor: Colors.white,
                                    padding: 10,
                                    borderRadius: 99,
                                    borderColor: 'black',
                                    borderWidth: 1,
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <AntDesign name="close" size={24} color="red" />
                                    <Text style={{ color: 'red', fontWeight: 'bold', marginLeft: 5 }}>Reject</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );

    return (
        <View
            style={{
                height: '100%',
                backgroundColor: Colors.lightblack,
                padding: 20,
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 50,
                    gap: 20,
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        router.back();
                    }}
                >
                    <Ionicons name="chevron-back" size={30} color="white" />
                </TouchableOpacity>
                <AntDesign name="bells" size={30} color="white" />
                <Text
                    style={{
                        fontSize: 30,
                        fontWeight: 'bold',
                        color: 'white',
                    }}
                >
                    Notifications
                </Text>
            </View>

            <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ marginTop: 20 }}
            />
        </View>
    );
}
