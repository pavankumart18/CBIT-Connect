import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { auth, db } from '../../configs/FireBaseConfigs';
import { collection, getDocs, query, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function SeeAllGroups() {
    const navigation = useNavigation();
    const router = useRouter();
    const user = auth.currentUser;
    const [groups, setGroups] = useState([]);
    const colors = ['#8338ec', '#ff006e', '#fb5607'];

    const getRandomColor = () => {
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const GetGroups = async () => {
        if (!user) return;

        const q = query(collection(db, 'groups'));
        const querySnapshot = await getDocs(q);
        const groups = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (!data.members.includes(user?.email)) {
                groups.push({ oid: doc.id, ...data });
            }
        });
        setGroups(groups);
        console.log(groups);
    };

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
        if (user) {
            console.log('User:', user);
            GetGroups();
        }
    }, []);

    const joinGroup = async (groupId) => {
        if (!user) return;

        try {
            const groupDocRef = doc(db, 'groups', groupId);
            await updateDoc(groupDocRef, {
                members: arrayUnion(user.email),
            });
            console.log(`User ${user.email} added to group ${groupId}`);
            
            GetGroups();
        } catch (error) {
            console.error('Error joining group: ', error);
        }
    };

    return (
        <View
            style={{
                padding: 20,
                paddingTop: 60,
                backgroundColor: Colors.lightblack,
                height: '100%',
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 20,
                }}
            >
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={30} color="white" />
                </TouchableOpacity>
                <MaterialCommunityIcons name="eye-outline" size={30} color="white" />
                <Text
                    style={{
                        color: Colors.white,
                        fontSize: 30,
                        fontWeight: 'bold',
                    }}
                >
                    See All Groups
                </Text>
            </View>

            <ScrollView style={{ marginTop: 20 }}>
                {groups.map((group) => (
                    <View
                        key={group.id}
                        style={{
                            backgroundColor: getRandomColor(),
                            padding: 15,
                            borderRadius: 20,
                            marginBottom: 10,
                        }}
                    >
                        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                            <Image
                                source={{ uri: group.profilePicture }} 
                                style={{ width: 50, height: 50, borderRadius: 25 }}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: Colors.white, fontSize: 24, fontWeight: 'bold' }}>
                                    {group.name}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                marginTop: 10,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 10,
                                }}
                            >
                                <Text style={{ color: Colors.white, fontSize: 18, fontWeight: 'bold' }}>About</Text>
                                <Text style={{ color: Colors.white, fontSize: 18 }}>{group.about}</Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 10,
                                    marginTop: 10,
                                }}
                            >
                                <Text style={{ color: Colors.white, fontSize: 18, fontWeight: 'bold' }}>Admin</Text>
                                <Text style={{ color: Colors.white, fontSize: 18 }}>{group.admin}</Text>
                            </View>
                            <View
                                style={{
                                    marginTop: 10,
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        color: Colors.white,
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {group.members.length} Members
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={{
                                backgroundColor: Colors.white,
                                padding: 20,
                                borderRadius: 99,
                                marginTop: 10,
                            }}
                            onPress={() => joinGroup(group.oid)}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 15,
                                }}
                            >
                                <AntDesign name="login" size={24} color="black" />
                                <Text
                                    style={{
                                        color: Colors.black,
                                        fontWeight: 'bold',
                                        fontSize: 20,
                                    }}
                                >
                                    Join Group
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
