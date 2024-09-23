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
            const notificationRef = doc(db, 'notifications', notificationId);
    
            await deleteDoc(notificationRef);
    
            setNotifications(notifications.filter((notif) => notif.id !== notificationId));
    
            console.log('Notification successfully deleted:', notificationId);
    
        } catch (error) {
            console.error('Error deleting notification:', error.message);
        }
    };
    
    

    const handleAccept = (notificationId) => {
        console.log('Accepted:', notificationId);
        
    };

    const handleReject = (notificationId) => {
        console.log('Rejected:', notificationId);
        
    };
    const renderNotification = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                if (item.title === 'Gate Pass Request') {
                    router.replace('/teacher-gatepass');
                }
            }}
        >
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
                    <Text style={{ color: 'black', marginTop: 10,fontWeight:'bold' }}>{item.message}</Text>
                    {item.title === 'Gate Pass Request' && (
                        <View style={{ marginTop: 5 }}>
                            <Text style={{ color: 'black', fontWeight: 'medium' }}>Request ID: {item.requestId}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
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
