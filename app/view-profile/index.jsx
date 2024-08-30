import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../configs/FireBaseConfigs';

export default function ViewProfile() {
    const chat = useLocalSearchParams();
    const navigation = useNavigation();
    const router = useRouter();
    const [members, setMembers] = useState([]);
    const [userData, setUserData] = useState({
        user:'',
    });

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });

        // Fetch members when component mounts
        const fetchMembers = async () => {
            if (chat?.name) {
                try {
                    const membersRef = collection(db, 'groups');
                    const q = query(membersRef, where('name', '==', chat.name));
                    const querySnapshot = await getDocs(q);

                    const membersList = [];
                    querySnapshot.forEach(doc => {
                        const groupData = doc.data();
                        if (groupData.members) {
                            membersList.push(...groupData.members);
                        }
                    });
                    setMembers(membersList);
                } catch (error) {
                    console.error('Error fetching members: ', error);
                }
            }
        };

        fetchMembers();
    }, [chat?.name]);

    const ViewIndividual = (member) => { 
        setUserData({
            user: member,
        });
        console.log('userData:', userData);

        router.push({
            pathname: '/view-individual',
            params: userData,
        });
    }

    return (
        <View
            style={{
                padding: 20,
                paddingTop: 50,
                height: '100%',
                backgroundColor: Colors.lightblack,
            }}
        >
            <View
                style={{
                    borderRadius: 20,
                    paddingTop: 20,
                    backgroundColor: Colors.orange,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 20,
                }}
            >
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={30} color="white" />
                </TouchableOpacity>
                <Image
                    source={chat?.profilePicture ? { uri: chat?.profilePicture } : require('../../assets/images/profile.jpeg')}
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                    }}
                />
                <Text
                    style={{
                        color: 'white',
                        fontSize: 20,
                        fontWeight: 'bold',
                    }}
                >
                    {chat?.name}
                </Text>
            </View>
            <View
                style={{
                    marginTop: 20,
                    alignItems: 'center',
                }}
            >
                <Image
                    source={chat?.profilePicture ? { uri: chat?.profilePicture } : require('../../assets/images/profile.jpeg')}
                    style={{
                        width: 150,
                        height: 150,
                        borderRadius: 99,
                    }}
                />
                <Text
                    style={{
                        color: 'white',
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginTop: 20,
                    }}
                >
                    {chat?.name}
                </Text>
            </View>
            <ScrollView style={{ marginTop: 20 }}>
                {members.map((member, index) => (
                    <TouchableOpacity 
                        onPress={() => ViewIndividual(member)}
                        key={index} 
                        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                        <Image
                            source={member.profileUrl ? { uri: member.profileUrl } : require('../../assets/images/profile.jpeg')}
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: 99,
                                marginRight: 10,
                            }}
                        />
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                            {member} {member === chat.admin && '(Admin)'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}
