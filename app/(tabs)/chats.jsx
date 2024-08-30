import { View, Text, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import GroupScreen from '../../components/ChatScreen/GroupScreen';
import { useRouter } from 'expo-router';
import { auth, db } from '../../configs/FireBaseConfigs';
import { collection, getDocs, query, where } from 'firebase/firestore';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
export default function Chats() {
    const navigation = useNavigation();
    const router = useRouter();
    const [groups, setGroups] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const user = auth.currentUser;

    const GetGroups = async () => {
        if (!user) return;

        const q = query(collection(db, 'groups'), where('members', 'array-contains', user?.email));
        const querySnapshot = await getDocs(q);
        const groups = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            groups.push({ id: doc.id, ...data });
        });
        setGroups(groups);
        console.log(groups);
    };

    const checkIfAdmin = async () => {
        if (!user) return;
    
        try {
            const q=query(collection(db,'MyInfo'),where('email','==',user.email))// Note: No need for 'user?.email' if user is verified
            const querySnapshot = await getDocs(q);// Use getDoc instead of getDocs for a single document
            if (querySnapshot.size > 0) {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.Admin) {
                        console.log('Document data:', data);
                        setIsAdmin(true);
                    } else {
                        console.log('No such document!');
                        setIsAdmin(false);
                    }
                });
            } else {
                console.log('No such document!');
                setIsAdmin(false);
            }
        } catch (error) {
            console.error('Error fetching document: ', error);
        }
    };
    

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });

        if (user) {
            console.log('Fetching Groups...');
            GetGroups();
            checkIfAdmin();
            console.log(isAdmin);
        }
    }, []);

    return (
        <View style={{ height: '100%', backgroundColor: Colors.lightblack, padding: 20 }}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.lightblack} translucent={false} />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 50, gap: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                    <Entypo name="chat" size={30} color="white" />
                    <TouchableOpacity onPress={()=>{
                        GetGroups();
                        checkIfAdmin();
                    }}>
                    <Text style={{ color: Colors.white, fontSize: 30, fontWeight: 'bold' }}>Campus Talks</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                {isAdmin ? (
                    <TouchableOpacity
                        onPress={() => router.push('/create-group')}
                        style={{ backgroundColor: Colors.white, padding: 20, borderRadius: 99, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 15 }}>
                            <FontAwesome6 name="add" size={24} color="black" />
                            <Text style={{ color: Colors.black, fontSize: 20, fontWeight: 'bold' }}>Create Group</Text>
                        </View>
                    </TouchableOpacity>
                ): (
                    <TouchableOpacity
                        onPress={() => router.push('/see-all-groups')}
                        style={{ backgroundColor: Colors.white, padding: 20, borderRadius: 99, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 15 }}>
                            <FontAwesome5 name="eye" size={24} color="black" />
                            <Text style={{ color: Colors.black, fontSize: 20, fontWeight: 'bold' }}>See All Groups</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
            <ScrollView>
                {groups.map((group) => (
                    <GroupScreen key={group.id} chat={group} />
                ))}
            </ScrollView>
        </View>
    );
}
