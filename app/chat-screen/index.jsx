import { View, Text, Pressable, Image, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Foundation from '@expo/vector-icons/Foundation';
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';
import { collection, addDoc, query, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { auth } from '../../configs/FireBaseConfigs';
import { db } from '../../configs/FireBaseConfigs';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ChatScreen() {
    const chat = useLocalSearchParams();
    const navigation = useNavigation();
    const router = useRouter();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [members, setMembers] = useState([]);
    const [image, setImage] = useState(null);
    const user = auth.currentUser;
    const storage = getStorage();
    const scrollViewRef = useRef(null);

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });

        if (chat?.id) {
            const messagesRef = collection(db, 'groups', chat.id, 'messages');

            const q = query(messagesRef, orderBy('timestamp', 'asc'));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMessages(messages);
                scrollViewRef.current?.scrollToEnd({ animated: true });
            });

            const membersRef = collection(db, 'groups', chat.id, 'members');
            const getMembers = async () => {
                try {
                    const snapshot = await getDocs(membersRef);
                    const membersList = snapshot.docs.map(doc => doc.data());
                    setMembers(membersList);
                } catch (error) {
                    console.error('Error fetching members: ', error);
                }
            };

            getMembers();

            return () => unsubscribe();
        }
    }, [chat?.id]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result?.assets[0]?.uri);
            console.log('Image selected:', result?.assets[0]?.uri);
        }
    };

    const uploadImage = async (uri) => {
        try {
            console.log('Uploading image...', uri);
            const response = await fetch(uri);
            const blob = await response.blob();
            const imageRef = ref(storage, `images/${user.uid}/${new Date().toISOString()}`);
            await uploadBytes(imageRef, blob);
            const downloadURL = await getDownloadURL(imageRef);
            console.log('Image uploaded successfully:', downloadURL);
            return downloadURL;
        } catch (error) {
            console.error('Error uploading image: ', error);
            throw error;
        }
    };

    const sendMessage = async () => {
        let imageUrl = '';

        if (image) {
            try {
                imageUrl = await uploadImage(image);
                console.log('Image uploaded successfully:', imageUrl);
            } catch (error) {
                console.error('Error uploading image: ', error);
                Alert.alert('Error', 'Failed to upload image');
                return;
            }
        }

        const message = {
            text: input,
            imageUrl: imageUrl,
            senderId: user?.uid,
            senderName: user?.email,
            senderPhoto: user?.photoURL,
            timestamp: new Date(),
        };

        try {
            const messagesRef = collection(db, 'groups', chat.id, 'messages');
            await addDoc(messagesRef, message);
            console.log('Message sent successfully:', message);
            setInput(''); 
            setImage(null); // Clear selected image
        } catch (error) {
            console.error('Error sending message: ', error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={{ 
                flex: 1, 
                backgroundColor: Colors.lightblack, 
                paddingTop: 40,
             }}>
                {/* Upper Part */}
                <View style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    borderBottomColor: 'white', 
                    borderBottomWidth: 1, 
                    padding: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                        <Pressable onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={24} color="white" />
                        </Pressable>
                        <Image source={chat?.profilePicture ? { uri: chat?.profilePicture } : require('../../assets/images/profile.jpeg')} style={{ width: 50, height: 50, borderRadius: 50 }} />
                        <TouchableOpacity onPress={() => router.push({
                            pathname: '/view-profile',
                            params: chat,
                        })}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{chat?.name}</Text>
                        </TouchableOpacity>
                    </View>
                    <Ionicons name="ellipsis-vertical" size={24} color="white" />
                </View>

                {/* Middle Part */}
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={{ padding: 10, flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {messages.map((message) => (
                        <View key={message.id} style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            alignSelf: message.senderId === user.uid ? 'flex-end' : 'flex-start',
                            marginVertical: 8,
                            maxWidth: '75%',
                        }}>
                            {message.senderId !== user.uid && (
                                <Image source={message.senderPhoto ? { uri: message.senderPhoto } : require('../../assets/images/profile.jpeg')}
                                    style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />
                            )}
                            <View>
                                <Text style={{ color: 'white', fontSize: 12,paddingLeft:5, }}>{message.senderName}</Text>
                                <View style={{
                                    backgroundColor: message.senderId === user.uid ? Colors.green : Colors.lightGray,
                                    padding: 14,
                                    borderRadius: 15,
                                }}>
                                    {message.text && <Text style={{ color: 'black', fontSize: 16 }}>{message.text}</Text>}
                                    {message.imageUrl && (
                                        <Image source={{ uri: message.imageUrl }} style={{ width: 200, height: 200, borderRadius: 15, marginTop: 5 }} />
                                    )}
                                    <Text style={{ color: 'gray', fontSize: 10, textAlign: 'right', marginTop: 5 }}>
                                        {moment(message.timestamp.toDate()).format('LT')}
                                    </Text>
                                </View>
                            </View>
                            {message.senderId === user.uid && (
                                <Image source={message.senderPhoto ? { uri: message.senderPhoto } : require('../../assets/images/profile.jpeg')}
                                    style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 10 }} />
                            )}
                        </View>
                    ))}
                </ScrollView>

                {/* Lower Part */}
                <View style={{ borderTopColor: 'white', borderTopWidth: 1, paddingBottom: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <TextInput
                            placeholder="Type a message"
                            style={{
                                backgroundColor: Colors.white,
                                padding: 14,
                                borderRadius: 25,
                                margin: 10,
                                width: '67%',
                            }}
                            value={input}
                            onChangeText={setInput}
                        />
                        <TouchableOpacity style={{ backgroundColor: Colors.lightGrey, padding: 10, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginLeft: -5 }} onPress={pickImage}>
                            <Foundation name="photo" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: Colors.primary, padding: 14, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginRight: 10 }} onPress={sendMessage}>
                            <Ionicons name="send" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
