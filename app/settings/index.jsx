import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../configs/FireBaseConfigs'; // Adjust the import path as necessary

export default function Settings() {
    const userData = useLocalSearchParams();
    const navigation = useNavigation();
    const router = useRouter();

    const [profileUrl, setProfileUrl] = useState(userData.profileUrl || '');
    const [mobile, setMobile] = useState(userData.mobile || '');
    const [cemail, setCemail] = useState(userData.cemail || '');
    const [linkedin, setLinkedin] = useState(userData.linkedin || '');
    const [github, setGithub] = useState(userData.github || '');
    const [cv, setCv] = useState(userData.cv || '');

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
        console.log('userData:', userData);
    }, []);

    const handleSave = async () => {
        if (!userData.oid) {
            Alert.alert('Error', 'User ID is missing.');
            return;
        }

        try {
            const userRef = doc(db, 'MyInfo', userData.oid);
            await updateDoc(userRef, {
                profileUrl,
                mobile,
                cemail,
                linkedin,
                github,
                cv,
            });
            Alert.alert('Success', 'Your profile has been updated successfully!');
            router.back();
        } catch (error) {
            console.error('Error updating profile: ', error);
            Alert.alert('Error', 'Failed to update profile. Please try again later.');
        }
    };

    return (
        <View
            style={{
                height: '100%',
                backgroundColor: Colors.lightblack,
                padding: 20,
                paddingTop: 60,
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 20,
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
                <MaterialIcons name="update" size={30} color="white" />
                <Text
                    style={{
                        color: 'white',
                        fontSize: 24,
                        fontWeight: 'bold',
                    }}
                >
                    Update your Profile
                </Text>
            </View>

            <ScrollView>
                <View style={{ marginTop: 20 }}>
                    <Text style={{ color: 'white', fontSize: 18 ,fontWeight:'bold' }}>Profile URL:</Text>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            padding: 20,
                            borderRadius: 99,
                            marginTop: 10,
                        }}
                        value={profileUrl}
                        onChangeText={setProfileUrl}
                        keyboardType="url"
                    />
                </View>

                <View style={{ marginTop: 20 }}>
                    <Text style={{ color: 'white', fontSize: 18 ,fontWeight:'bold' }}>Mobile:</Text>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            padding: 20,
                            borderRadius: 99,
                            marginTop: 10,
                        }}
                        value={mobile}
                        onChangeText={setMobile}
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={{ marginTop: 20 }}>
                    <Text style={{ color: 'white', fontSize: 18 ,fontWeight:'bold' }}>College Email:</Text>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            padding: 20,
                            borderRadius: 99,
                            marginTop: 10,
                        }}
                        value={cemail}
                        onChangeText={setCemail}
                        keyboardType="email-address"
                    />
                </View>

                <View style={{ marginTop: 20 }}>
                    <Text style={{ color: 'white', fontSize: 18 ,fontWeight:'bold' }}>LinkedIn:</Text>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            padding: 20,
                            borderRadius: 99,
                            marginTop: 10,
                        }}
                        value={linkedin}
                        onChangeText={setLinkedin}
                    />
                </View>

                <View style={{ marginTop: 20 }}>
                    <Text style={{ color: 'white', fontSize: 18 ,fontWeight:'bold' }}>GitHub:</Text>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            padding: 20,
                            borderRadius: 99,
                            marginTop: 10,
                        }}
                        value={github}
                        onChangeText={setGithub}
                    />
                </View>

                <View style={{ marginTop: 20 }}>
                    <Text style={{ color: 'white', fontSize: 18 ,fontWeight:'bold'}}>CV:</Text>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            padding: 20,
                            borderRadius: 99,
                            marginTop: 10,
                        }}
                        value={cv}
                        onChangeText={setCv}
                    />
                </View>

                <TouchableOpacity
                    onPress={handleSave}
                    style={{
                        backgroundColor: Colors.white,
                        padding: 20,
                        borderRadius: 99,
                        alignItems: 'center',
                        marginTop: 20,
                    }}
                >
                    <Text style={{ color: 'black', fontSize: 18 }}>Save Changes</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
