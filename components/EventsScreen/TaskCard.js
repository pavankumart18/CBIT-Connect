import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import { auth, db } from '../../configs/FireBaseConfigs';
import { collection, query, where, getDocs } from 'firebase/firestore';
import moment from 'moment';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TaskCard({ selectedDate, onDateSelect }) {
    const user = auth.currentUser;
    const [personalTasks, setPersonalTasks] = useState([]);
    const colors = ['#e9ff70', '#fbff12', '#ffffff', '#1b4965'];
    const router = useRouter();
    const [sendData, setSendData] = useState({
        date: selectedDate.toDateString(),
    });

    const getRandomItem = () => {
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };

    const GetTasks = async () => {
        if (!selectedDate) return;

        const formattedDate = selectedDate.toDateString();
        const q = query(
            collection(db, "tasks"),
            where("email", "==", user.email),
            where("date", "==", formattedDate)
        );

        const querySnapshot = await getDocs(q);
        const tasks = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            tasks.push(data);
        });

        setPersonalTasks(tasks);
        console.log('Personal Tasks:', tasks);
    };

    useEffect(() => {
        setSendData({
            date: selectedDate.toDateString(),
        });
        console.log('Selected Date:', selectedDate.toDateString());
        GetTasks();
    }, [selectedDate]);

    const renderTaskCard = (task, index) => (
        <View key={index} style={{
            backgroundColor: getRandomItem(),
            padding: 30,
            borderRadius: 10,
            marginVertical: 5,
            marginHorizontal: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 2,
            flexDirection: 'row',
            justifyContent: 'space-between',
        }}>
            <View>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{task.eventName}</Text>
                <Text
                    style={{
                        marginTop: 10,
                        fontSize: 16,
                        fontWeight: 'bold',
                    }}
                >{task.timings}</Text>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 40,
                    }}
                >
                <Text style={{fontSize:18}}>Venue: </Text>
                <Text style={{ fontSize:20,fontWeight: 'bold' }}>{task.venue}</Text>
                </View>
            </View>
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <TouchableOpacity
                    style={{
                        backgroundColor: 'black',
                        padding: 10,
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <AntDesign name="edit" size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        backgroundColor: 'black',
                        padding: 10,
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 10,
                    }}
                >
                    <Ionicons name="checkmark-done" size={30} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={{ marginTop: 25 }}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
            }}>
                <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white' }}>Items and Tasks</Text>
                <TouchableOpacity
                    onPress={() => router.push({
                        pathname: '/add-event',
                        params: sendData,
                    })}
                    style={{
                        backgroundColor: 'white',
                        padding: 10,
                        borderRadius: 99,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <AntDesign name="plus" size={18} color="black" />
                </TouchableOpacity>
            </View>

            <ScrollView style={{ marginTop: 20 }}>
                {personalTasks.map((task, index) => renderTaskCard(task, index))}
            </ScrollView>
        </View>
    );
}
