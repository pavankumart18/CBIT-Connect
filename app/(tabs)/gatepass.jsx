import { View, Text, TextInput, TouchableOpacity, Alert, Linking, StatusBar } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { auth, db } from '../../configs/FireBaseConfigs';
import { collection, addDoc, query, getDocs, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';

export default function GatePass() {
    const navigation = useNavigation();
    const [selectedMentor, setSelectedMentor] = useState('');
    const [userData, setUserData] = useState({});
    const [name, setName] = useState('');
    const [rollNo, setRollNo] = useState('');
    const [reason, setReason] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [timeLeft, setTimeLeft] = useState(40 * 60);
    const [timerRunning, setTimerRunning] = useState(false);
    const [timerExpired, setTimerExpired] = useState(false);
    const qrCodeRef = useRef(null);

    const user = auth.currentUser;
    const storage = getStorage();

    const GetUserData = async () => {
        if (user) {
            const q = query(collection(db, 'MyInfo'), where('email', '==', user?.email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                setUserData(data);
                setName(data.Name || '');
                setRollNo(data.no || '');
                setSelectedMentor(data.mentor || '');
            });
        } else {
            Alert.alert('Error', 'Once Re-Login');
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);
    useEffect(() => {
        let interval;
        if (timerRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setTimerRunning(false);
            setTimerExpired(true);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timerRunning, timeLeft]);
    const startTimer = () => {
        setTimerRunning(true);
    };

    useEffect(() => {
        if (user) {
            GetUserData();
        }
    }, [user]);

    const mentors = ['Swathi Tejah', 'Shoba Rani', 'Kiranmai', 'Kaneez', 'Ramana Kadiyala', 'Vasanth Sena', 'Anjum'];

    const handleSubmit = async () => {
        const qrData = `Name: ${name}\nRoll No: ${rollNo}\nMentor: ${selectedMentor}\nReason: ${reason}`;
        try {
            // Capture QR code as an image
            const uri = await captureRef(qrCodeRef.current, {
                format: 'png',
                quality: 0.8,
            });

            // Upload QR code image to Firebase Storage
            const qrRef = ref(storage, `qr_codes/${name}_${rollNo}.png`);
            const response = await fetch(uri);
            const blob = await response.blob();
            await uploadBytes(qrRef, blob);
            const downloadURL = await getDownloadURL(qrRef);

            // Save request details to Firestore
            await addDoc(collection(db, 'GatePassRequests'), {
                name,
                rollNo,
                reason,
                mentor: selectedMentor,
                qrCodeUrl: downloadURL,
            });

            setQrCodeUrl(downloadURL);
            startTimer();
            setTimerRunning(true);

            // Start the 40-minute timer
            setTimeout(() => {
                setTimerExpired(true);
                setQrCodeUrl(''); // Clear the QR code URL
            }, 40 * 60 * 1000); // 40 minutes in milliseconds

            Alert.alert('Success', 'Gate pass request submitted successfully.');
        } catch (error) {
            console.error('Error generating QR code or uploading file:', error);
            Alert.alert('Error', 'Failed to generate QR code or upload file.');
        }
    };

    return (
        <View
            style={{
                height: '100%',
                backgroundColor: Colors.lightblack,
                padding: 20,
            }}
        >
            <StatusBar 
                barStyle="light-content" 
                backgroundColor={Colors.lightblack} 
                translucent={false} 
            />
            <Text
                style={{
                    color: Colors.white,
                    fontSize: 30,
                    fontWeight: 'bold',
                    marginTop: 50,
                    textAlign: 'center',
                }}
            >
                GatePass
            </Text>
            <View>
                {timerRunning && !timerExpired ? (
                    <View>
                        <Text
                            style={{
                                color: Colors.white,
                                fontSize: 20,
                                fontWeight: 'bold',
                                marginTop: 30,
                                textAlign: 'center',
                            }}
                        >
                            Your GatePass QR code is active for 40 minutes.
                        </Text>
                        <Text
                            style={{
                                color: Colors.white,
                                fontSize: 20,
                                fontWeight: 'bold',
                                marginTop: 30,
                                textAlign: 'center',
                            }}
                        >
                            Time left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60} minutes
                        </Text>
                        {qrCodeUrl ? (
                                <View
                                    style={{
                                        marginTop: 20,
                                        alignItems: 'center',
                                        padding: 20,
                                        borderRadius: 30,
                                        borderWidth: 2,
                                        borderColor:'white',
                                    }}
                                >
                                    <QRCode
                                        value={`Name: ${name}\nRoll No: ${rollNo}\nMentor: ${selectedMentor}\nReason: ${reason}`}
                                        size={200}  // Adjust size as needed
                                        color="black"
                                        backgroundColor="white"
                                    />
                                    <Text
                                        style={{
                                            marginTop:20,
                                            fontSize: 20,
                                            fontWeight:'bold',
                                            color:Colors.white
                                        }}
                                    >
                                        Name: {name}
                                    </Text>
                                </View>
                            ) : null}
                    </View>
                ) : (
                    <View>
                        <Text
                            style={{
                                color: Colors.white,
                                fontSize: 20,
                                fontWeight: 'bold',
                                marginTop: 30,
                                textAlign: 'center',
                            }}
                        >
                            {timerExpired ? 'Your GatePass has expired.' : 'Please fill in the details to generate your GatePass.'}
                        </Text>
                        <View>
                            <View>
                                <Text
                                    style={{
                                        color: Colors.white,
                                        fontSize: 20,
                                        fontWeight: 'bold',
                                        marginTop: 30,
                                    }}
                                >
                                    Name
                                </Text>
                                <TextInput
                                    style={{
                                        backgroundColor: Colors.lightblack,
                                        padding: 10,
                                        borderRadius: 5,
                                        marginTop: 10,
                                        color: Colors.white,
                                        borderBottomColor: Colors.white,
                                        borderBottomWidth: 1,
                                        fontSize: 20,
                                        placeholderTextColor: Colors.white,
                                    }}
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                            <View>
                                <Text
                                    style={{
                                        color: Colors.white,
                                        fontSize: 20,
                                        fontWeight: 'bold',
                                        marginTop: 30,
                                    }}
                                >
                                    Roll No
                                </Text>
                                <TextInput
                                    style={{
                                        backgroundColor: Colors.lightblack,
                                        padding: 10,
                                        borderRadius: 5,
                                        marginTop: 10,
                                        color: Colors.white,
                                        borderBottomColor: Colors.white,
                                        borderBottomWidth: 1,
                                        fontSize: 20,
                                        placeholderTextColor: Colors.white,
                                    }}
                                    value={rollNo}
                                    onChangeText={setRollNo}
                                />
                            </View>
                            <View>
                                <Text
                                    style={{
                                        color: Colors.white,
                                        fontSize: 20,
                                        fontWeight: 'bold',
                                        marginTop: 30,
                                    }}
                                >
                                    Reason
                                </Text>
                                <TextInput
                                    style={{
                                        backgroundColor: Colors.lightblack,
                                        padding: 10,
                                        borderRadius: 5,
                                        marginTop: 10,
                                        color: Colors.white,
                                        borderBottomColor: Colors.white,
                                        borderBottomWidth: 1,
                                        fontSize: 20,
                                        placeholderTextColor: Colors.white,
                                    }}
                                    value={reason}
                                    onChangeText={setReason}
                                    placeholder="Reason for gatepass"
                                />
                            </View>
                            <View>
                                <Text
                                    style={{
                                        color: Colors.white,
                                        fontSize: 20,
                                        fontWeight: 'bold',
                                        marginTop: 30,
                                    }}
                                >
                                    Mentor
                                </Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                                    {mentors.map((mentor) => (
                                        <TouchableOpacity
                                            key={mentor}
                                            onPress={() => setSelectedMentor(mentor)}
                                            style={{
                                                backgroundColor: selectedMentor === mentor ? '#E8FF59' : '#2C2C2E',
                                                borderRadius: 20,
                                                paddingVertical: 10,
                                                paddingHorizontal: 20,
                                                marginRight: 10,
                                                marginBottom: 10,
                                            }}
                                        >
                                            <Text style={{ color: selectedMentor === mentor ? 'black' : 'white', fontWeight: 'bold' }}>
                                                {mentor}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>
                        <View>
                            <TouchableOpacity
                                onPress={handleSubmit}
                                style={{
                                    backgroundColor: Colors.white,
                                    padding: 20,
                                    borderRadius: 99,
                                    marginTop: 30,
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        color: Colors.black,
                                        fontSize: 20,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Submit Request
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
            <View style={{ position: 'absolute', top: -1000, left: -1000 }}>
                <QRCode
                    value={`Name: ${name}\nRoll No: ${rollNo}\nMentor: ${selectedMentor}\nReason: ${reason}`}
                    size={100}  // Increased size for better clarity
                    getRef={ref => (qrCodeRef.current = ref)}
                />
            </View>
        </View>
    );
}
