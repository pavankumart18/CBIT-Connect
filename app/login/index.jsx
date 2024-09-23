import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors } from '../../constants/Colors';
import { useRouter, useNavigation } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/configs/FireBaseConfigs'; 
import { StatusBar } from 'react-native';
export default function Login() {
    const router = useRouter();
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    const handleLogin = () => {
        if (username === '' || password === '') {
            Alert.alert('Error', 'Please fill in both fields');
            return;
        }

        signInWithEmailAndPassword(auth, username, password)
            .then((userCredential) => {
                // Signed in
                const { user } = userCredential;
                console.log('User logged in:');
                router.replace('home'); 
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                Alert.alert('Login Failed', errorMessage);
            });
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
            <StatusBar barStyle="light-content" />
            <TouchableOpacity
                onPress={() => router.back()}
            >
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
                    Welcome,
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
                    placeholder="Username"
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
                onPress={handleLogin}
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
                    Login
                </Text>
            </TouchableOpacity>
        </View>
    );
}
