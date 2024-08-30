import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../../constants/Colors';
import { useRouter, useNavigation } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/configs/FireBaseConfigs'; 

export default function SignUp() {
    const router = useRouter();
    const navigation = useNavigation();
    const [category, setCategory] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    const handleSignUp = () => {
        if (username === '' || password === '' || category === '') {
            Alert.alert('Error', 'Please fill all the fields', [
                {
                    text: 'OK',
                    onPress: () => console.log('OK Pressed'),
                },
            ]);
        } else {
            setError('');

            // Firebase sign-up logic
            createUserWithEmailAndPassword(auth, username, password)
                .then(async (userCredential) => {
                    const { user } = userCredential;
                    console.log('User signed up:');

                    // Store additional user info (category) in Firestore
                    await setDoc(doc(db, 'users', user.uid), {
                        username: username,
                        category: category,
                        email: user.email,
                        createdAt: new Date(),
                    });

                    // Navigate to login or another screen after sign-up
                    router.push('/login');
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setError(errorMessage);
                    Alert.alert('Sign Up Failed', errorMessage, [
                        {
                            text: 'OK',
                            onPress: () => console.log('OK Pressed'),
                        },
                    ]);
                });
        }
    };

    return (
        <View
            style={{
                padding: 20,
                paddingTop: 50,
                backgroundColor: Colors.lightblack,
                height: '100%',
            }}
        >
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={35} color="white" />
            </TouchableOpacity>
            <View
                style={{
                    alignItems: 'center',
                    marginTop: 90,
                }}
            >
                <Text
                    style={{
                        fontSize: 35,
                        fontWeight: 'bold',
                        color: Colors.white,
                        marginTop: 20,
                    }}
                >
                    Hey,
                </Text>
                <Text
                    style={{
                        fontSize: 35,
                        fontWeight: 'bold',
                        color: Colors.white,
                        marginTop: 20,
                    }}
                >
                    CBITian
                </Text>
            </View>
            <View>
                <Text
                    style={{
                        color: Colors.white,
                        marginTop: 20,
                        fontWeight: 'bold',
                        fontSize: 18,
                    }}
                >
                    Username
                </Text>
                <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter your College ID"
                    style={{
                        backgroundColor: Colors.white,
                        padding: 20,
                        borderRadius: 99,
                        marginTop: 10,
                    }}
                />
            </View>
            <View>
                <Text
                    style={{
                        color: Colors.white,
                        marginTop: 20,
                        fontWeight: 'bold',
                        fontSize: 18,
                    }}
                >
                    Category
                </Text>
                <TextInput
                    value={category}
                    onChangeText={setCategory}
                    placeholder="Student/Faculty"
                    style={{
                        backgroundColor: Colors.white,
                        padding: 20,
                        borderRadius: 99,
                        marginTop: 10,
                    }}
                />
            </View>
            <View>
                <Text
                    style={{
                        color: Colors.white,
                        marginTop: 20,
                        fontWeight: 'bold',
                        fontSize: 18,
                    }}
                >
                    Password
                </Text>
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    secureTextEntry={true}
                    style={{
                        backgroundColor: Colors.white,
                        padding: 20,
                        borderRadius: 99,
                        marginTop: 10,
                    }}
                />
            </View>
            <TouchableOpacity
                onPress={handleSignUp}
                style={{
                    padding: 18,
                    borderRadius: 99,
                    marginTop: 30,
                    backgroundColor: Colors.radium,
                    alignItems: 'center',
                }}
            >
                <Text
                    style={{
                        fontSize: 20,
                        color: Colors.black,
                        fontWeight: 'bold',
                    }}
                >
                    Sign Up
                </Text>
            </TouchableOpacity>
            {error ? <Text style={{ color: 'white', marginTop: 20 }}>{error}</Text> : null}
        </View>
    );
}
