import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { auth } from '@/configs/FireBaseConfigs';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/configs/FireBaseConfigs';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/constants/Colors';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import Firebase Storage methods
const storage = getStorage(); // Initialize storage

// it was a basic template for the Creating post and nothing but picking an image and adding a caption to it
// for knowing who is accessing data mostly in every page we will get user data using auth as here it in currentUser mostly we user 
// Due to identifier clash we used to currentUser here 
export default function CreatePost() {
    const navigation = useNavigation(); // used for removing header here see useEffect to know better 
    const currentUser = auth.currentUser; // current user 
    const [message, setMessage] = useState(''); // captioning the image
    const [image, setImage] = useState(null); // image state variable
    const [userData, setUserData] = useState(null); // state varaible to store userData

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
        if (currentUser) {
            fetchUserData();
        }
    }, []);

    const fetchUserData = async () => {
        const q = query(
            collection(db, 'MyInfo'),
            where('email', '==', currentUser.email)
        );
        const querySnapshot = await getDocs(q);
        let userList = [];
        querySnapshot.forEach((doc) => {
            userList.push({ id: doc.id, ...doc.data() });
        });
        setUserData(userList[0]); // Assuming only one user is returned
    };

    // Function to pick image from gallery
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        // console.log(result);
        if (!result.canceled) { // Corrected this condition
            setImage(result.assets[0].uri);
            // console.log('Image picked: ', result.assets[0].uri);
        }
    };

    // Function to handle creating a new post
    const createPost = async () => {
        if (message.trim() === '' && !image) {
            Alert.alert('Error', 'Please enter a message or upload an image');
            return;
        }

        let imageUrl = null;

        // Check if there is an image to upload
        if (image) {
            try {
                // Create a unique image name using current timestamp
                const imageRef = ref(storage, `posts/${currentUser.uid}/${Date.now()}.jpg`);

                // Convert the image URI to a blob
                const response = await fetch(image);
                const blob = await response.blob();

                // Upload the image to Firebase Storage
                await uploadBytes(imageRef, blob);

                // Get the download URL of the uploaded image
                imageUrl = await getDownloadURL(imageRef);
            } catch (error) {
                console.error('Error uploading image: ', error);
                Alert.alert('Error', 'Failed to upload image. Please try again.');
                return;
            }
        }

        try {
            const newPost = {
                username: userData?.Name || currentUser?.displayName || 'Anonymous',
                profile: userData?.profileUrl || currentUser?.photoURL || 'default_profile_image_url',
                message,
                photo: imageUrl || null,  // Use the uploaded image URL
                likes: [],
                comments: [],
                createdAt: new Date(),
                userId: currentUser.uid,
            };
            await addDoc(collection(db, 'posts'), newPost);
            Alert.alert('Success', 'Post created successfully!');
            navigation.goBack();
        } catch (error) {
            console.error('Error creating post: ', error);
            Alert.alert('Error', 'Failed to create post. Please try again.');
        }
    };

    return (
        <View style={{ 
            flex: 1, 
            padding: 20, 
            paddingTop: 60, 
            backgroundColor: Colors.black 
            }}>
            <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center' 
                }}>
                <Ionicons 
                name="create" 
                size={30} 
                color="white" />
                <Text style={{ 
                    fontSize: 24, 
                    color: Colors.white, 
                    marginLeft: 20, 
                    fontWeight: 'bold' }}>
                    Create Post
                </Text>
            </View>

            {image ? (
                <Image 
                source={{ uri: image }} 
                style={{ width: '100%', 
                height: 250, 
                borderRadius: 10,
                marginTop:40 }} />
            ) : (
                <View 
                    style={{ 
                            height: 250, 
                            backgroundColor: Colors.lightGray, 
                            borderRadius: 10, 
                            marginTop: 40, 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                        }}>
                    <Text 
                        style={{ 
                                color: Colors.blue, 
                                fontSize: 20, 
                                fontWeight: 'bold' 
                            }}>No image selected</Text>
                </View>
            )}

            <TouchableOpacity
                onPress={pickImage}
                style={{
                    marginBottom: 20,
                    backgroundColor: Colors.lightGray,
                    padding: 15,
                    borderRadius: 10,
                    alignItems: 'center',
                    marginTop: 20,
                }}
            >
                <Text style={{ 
                    color: Colors.blue, 
                    fontSize: 20, 
                    fontWeight: 'bold' }}>Pick an Image</Text>
            </TouchableOpacity>

            <Text
                style={{
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: 'bold',
                    marginTop: 20,
                }}
            >
                Caption
            </Text>

            <TextInput
                placeholder="What's on your mind?"
                placeholderTextColor="gray"
                style={{
                    backgroundColor: Colors.lightGray,
                    color: Colors.black,
                    marginVertical: 20,
                    padding: 15,
                    borderRadius: 10,
                    fontSize: 16,
                    borderColor: 'blue',
                    borderWidth: 1,
                }}
                multiline
                value={message}
                onChangeText={setMessage}
            />

            <TouchableOpacity
                onPress={createPost}
                style={{
                    backgroundColor: Colors.lightGray,
                    padding: 20,
                    borderRadius: 99,
                    alignItems: 'center',
                    marginTop: 20,
                }}
            >
                <Text style={{ 
                    color: Colors.black, 
                    fontSize: 25, 
                    fontWeight: 'bold' }}>Post</Text>
            </TouchableOpacity>
        </View>
    );
}
