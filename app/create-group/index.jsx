import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { auth, db } from '../../configs/FireBaseConfigs';
import { useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { setDoc, doc, collection } from 'firebase/firestore';

export default function CreateGroup() {
    const navigation = useNavigation();
    const router = useRouter();
    const user = auth.currentUser;
    const [groupName, setGroupName] = useState('');
    const [groupAbout, setGroupAbout] = useState('');
    const [groupCategory, setGroupCategory] = useState('');
    const [groupProfilePicture, setGroupProfilePicture] = useState('');

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    const handleCreateGroup = async () => {
        if (!groupName || !groupAbout || !groupCategory || !groupProfilePicture) {
            alert('Please fill all the fields');
            return;
        }

        const groupDetails = {
            name: groupName,
            about: groupAbout,
            admin: user?.email,
            category: groupCategory,
            profileUrl: groupProfilePicture,
            members: [user?.email], 
            createdAt: new Date(),  
        };

        try {
            
            await setDoc(doc(collection(db, "groups")), groupDetails);
            console.log("Group created successfully:", groupDetails);
            
            router.back();
        } catch (error) {
            console.error("Error creating group:", error);
            alert('Failed to create group');
        }
    };

    return (
        <View
            style={{
                height: '100%',
                backgroundColor: Colors.lightblack,
                padding: 20,
                paddingTop: 50,
            }}
        >
            <TouchableOpacity
                onPress={() => router.back()}
            >
                <Ionicons name="chevron-back" size={30} color="white" />
            </TouchableOpacity>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 20,
                    marginTop: 20,
                }}
            >
                <AntDesign name="addusergroup" size={30} color="white" />
                <Text
                    style={{
                        color: Colors.white,
                        fontSize: 30,
                        fontWeight: 'bold',
                    }}
                >
                    Create Group
                </Text>
            </View>

            <View
                style={{
                    marginTop: 20,
                }}
            >
                <Text
                    style={{
                        color: 'white',
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginBottom: 10,
                    }}
                >
                    Group Name
                </Text>
                <TextInput
                    placeholder='Enter Group Name'
                    value={groupName}
                    onChangeText={setGroupName}
                    style={{
                        backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 99,
                    }}
                />
            </View>

            <View
                style={{
                    marginTop: 20,
                }}
            >
                <Text
                    style={{
                        color: 'white',
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginBottom: 10,
                    }}
                >
                    About Group
                </Text>
                <TextInput
                    placeholder='Enter About Group'
                    multiline={true}
                    value={groupAbout}
                    onChangeText={setGroupAbout}
                    style={{
                        backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 20,
                        textAlignVertical: 'top',
                        height: 100, 
                    }}
                />
            </View>

            <View
                style={{
                    marginTop: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Text
                    style={{
                        color: 'white',
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginBottom: 10,
                    }}
                >
                    Group Admin
                </Text>
                <Text
                    style={{
                        color: 'white',
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginBottom: 10,
                    }}
                >
                    {user?.email}
                </Text>
            </View>

            <View
                style={{
                    marginTop: 20,
                }}
            >
                <Text
                    style={{
                        color: 'white',
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginBottom: 10,
                    }}
                >
                    Category
                </Text>
                <TextInput
                    placeholder='Enter Category'
                    value={groupCategory}
                    onChangeText={setGroupCategory}
                    style={{
                        backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 99,
                    }}
                />
            </View>

            <View
                style={{
                    marginTop: 20,
                }}
            >
                <Text
                    style={{
                        color: 'white',
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginBottom: 10,
                    }}
                >
                    Profile Picture
                </Text>
                <TextInput
                    placeholder='Enter Profile Picture URL'
                    value={groupProfilePicture}
                    onChangeText={setGroupProfilePicture}
                    style={{
                        backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 99,
                    }}
                />
            </View>

            <TouchableOpacity
                onPress={handleCreateGroup}
                style={{
                    backgroundColor: Colors.white,
                    padding: 15,
                    borderRadius: 99,
                    marginTop: 40,
                    alignItems: 'center',
                }}
            >
                <Text
                    style={{
                        color: 'black',
                        fontSize: 20,
                        fontWeight: 'bold',
                    }}
                >
                    Create Group
                </Text>
            </TouchableOpacity>
        </View>
    );
}
