import { View, Text, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors } from '@/constants/Colors';
import { auth, db } from '@/configs/FireBaseConfigs';
import { collection, getDocs, query, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import ReactTimeAgo from 'react-time-ago'
export default function Posts() {
    const navigation = useNavigation();
    const router = useRouter();
    const user = auth.currentUser;
    const [Posts, setPosts] = useState([]);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [newComment, setNewComment] = useState('');

    const GetPosts = async () => {
        try {
            const q = query(collection(db, 'posts'));
            const querySnapshot = await getDocs(q);
            let postsList = [];
            querySnapshot.forEach((doc) => {
                postsList.push({ id: doc.id, ...doc.data() });
            });
            setPosts(postsList);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const addComment = async (postId) => {
        if (newComment.trim() === '') return;
        try {
            const postRef = doc(db, 'posts', postId);
            await updateDoc(postRef, {
                comments: arrayUnion({
                    username: user.email,
                    comment: newComment,
                    createdAt: new Date().toISOString(),
                }),
            });
            setNewComment('');  // Clear input after posting
            GetPosts();  // Refresh posts to include the new comment
        } catch (error) {
            console.error('Error adding comment: ', error);
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
        GetPosts();
    }, []);

    return (
        <View 
        style={{ 
            flex: 1, 
            paddingTop: 60, 
            backgroundColor: Colors.black, 
            paddingBottom: 100 
        }}>
            <View 
                style={{ 
                    flexDirection: 'row', 
                    gap: 20, 
                    alignItems: 'center', 
                    marginHorizontal: 10, 
                    marginBottom: 10 
                }}>
                <TouchableOpacity 
                onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={30} color={Colors.white} />
                </TouchableOpacity>
                <Text 
                style={{ 
                    fontSize: 28, 
                    fontWeight: 'bold', 
                    color: 'white' 
                    }}>Posts</Text>
            </View>
            <ScrollView>
                <View 
                style={{ 
                    alignItems: 'center' 
                }}>
                    {Posts.length > 0 ? (
                        Posts.map((post, index) => (
                            <View 
                                key={index} 
                                style={{ 
                                    width: '100%' 
                                }}>
                                    <View 
                                        style={{ 
                                            flexDirection: 'row', 
                                            gap: 10, 
                                            alignItems: 'center', 
                                            padding: 8, 
                                            // borderTopColor: 'white', 
                                            borderTopWidth: 1, 
                                            borderBottomColor: 'black', 
                                            borderBottomWidth: 1 
                                        }}>
                                        <Image 
                                            source={{ uri: post.profile }} 
                                            style={{ 
                                                width: 50, 
                                                height: 50, 
                                                borderRadius: 50 
                                        }} />
                                    <Text 
                                    style={{ 
                                        color: 'white', 
                                        fontSize: 20, 
                                        fontWeight: 'bold'
                                     }}>{post.username}</Text>
                                </View>
                                    <Image 
                                        source={post.photo && { uri: post.photo } || require('@/assets/images/dummypost.png')}
                                        style={{ 
                                            width: '100%', 
                                            height: 250, 
                                            resizeMode: 'cover' 
                                        }} />
                                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomColor: Colors.black, borderBottomWidth: 1 }}>
                                        {post.likes.length > 0 && post.likes.includes(user.email) ? (
                                            <View>
                                                <TouchableOpacity
                                                onPress={async () => {
                                                    try {
                                                        await updateDoc(doc(db, 'posts', post.id), {
                                                            likes: post.likes.filter((email) => email !== user.email),
                                                        });
                                                        GetPosts();
                                                    } catch (error) {
                                                        console.error('Error unliking post: ', error);
                                                    }
                                                }}
                                            >
                                                <Ionicons name="heart" size={30} color="red" />
                                            </TouchableOpacity>
                                            <Text style={{ color: 'white', fontSize: 11 }}>{post.likes.length} likes</Text>
                                        </View>
                                    ) : (
                                        <View>
                                            <TouchableOpacity
                                                onPress={async () => {
                                                    try {
                                                        await updateDoc(doc(db, 'posts', post.id), {
                                                            likes: [...post.likes, user.email],
                                                        });
                                                        GetPosts();
                                                    } catch (error) {
                                                        console.error('Error liking post: ', error);
                                                    }
                                                }}
                                            >
                                                <Ionicons name="heart-outline" size={30} color="white" />
                                            </TouchableOpacity>
                                            <Text style={{ color: 'white', fontSize: 11 }}>{post.likes.length} likes</Text>
                                        </View>
                                    )}
                                    <TouchableOpacity
                                        style={{ marginLeft: 10, paddingBottom: 18 }}
                                        onPress={() => setSelectedPostId(selectedPostId === post.id ? null : post.id)}  // Toggle comments
                                    >
                                        <FontAwesome name="comments" size={30} color="white" />
                                    </TouchableOpacity>
                                </View>

                                <View>
                                    <Text style={{ 
                                        color: 'white', 
                                        fontSize: 16, 
                                        paddingHorizontal: 10, 
                                        fontWeight: 'bold', 
                                        paddingBottom: 10,
                                        paddingTop: 10,
                                        }}>
                                        {post.message}
                                    </Text>
                                </View>

                                {/* Comments Section */}
                                {selectedPostId === post.id && (
                                    <View style={{ 
                                        paddingHorizontal: 12,
                                        }}>
                                        {post.comments && post.comments.length > 0 ? (
                                            post.comments.map((comment, idx) => (
                                                <View key={idx} style={{ marginTop: 5 }}>
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            gap: 10,
                                                        }}
                                                    >
                                                    <Text style={{ color: 'white', 
                                                        fontWeight: 'bold',
                                                        paddingTop: 5,
                                                        }}>@{comment.username}</Text>
                                                    <Text style={{ color: 'white', fontSize: 12, paddingTop: 5 }}>{new Date(comment.createdAt).toDateString()}</Text>
                                                    </View>
                                                    <Text style={{ 
                                                        color: 'white', 
                                                        fontSize: 14,
                                                        paddingTop: 5,
                                                        paddingHorizontal: 10,
                                                        }}>{comment.comment}</Text>
                                                </View>
                                            ))
                                        ) : (
                                            <Text style={{ color: 'white', fontSize: 14,
                                                fontWeight: 'bold',
                                             }}>No comments yet.Add One</Text>
                                        )}
                                        <View style={{ 
                                            flexDirection: 'row', 
                                            alignItems: 'center', 
                                            marginTop: 20 }}>
                                            <TextInput
                                                style={{
                                                    flex: 1,
                                                    borderColor: 'gray',
                                                    borderWidth: 1,
                                                    borderRadius: 30,
                                                    padding: 12,
                                                    color: 'white',
                                                }}
                                                placeholder="Add a comment..."
                                                placeholderTextColor="gray"
                                                value={newComment}
                                                onChangeText={setNewComment}
                                            />
                                            <TouchableOpacity onPress={() => addComment(post.id)} style={{ marginLeft: 10 }}>
                                                <Ionicons name="send" size={24} color="white" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}

                            {/* <View>
                                <ReactTimeAgo date={post.createdAt} locale="en-US"/>
                            </View> */}

    
                            </View>
                        ))
                    ) : (
                        <Text style={{ color: 'white' }}>No posts found</Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
