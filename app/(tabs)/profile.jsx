import { View, Text, Image, TouchableOpacity, StatusBar, Alert ,Share} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { auth, db, } from '../../configs/FireBaseConfigs';
import { collection, query, doc, setDoc } from 'firebase/firestore';
import { getDocs, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import { getStorage } from 'firebase/storage';

export default function Profile() {
    const navigation = useNavigation();
    const user = auth.currentUser;
    const [userData, setUserData] = useState(null);
    const [cvUri, setCvUri] = useState(null);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();
    const storage = getStorage();

    const GetUserData = async () => {
        if (user) {
            const q = query(collection(db, 'MyInfo'), where('email', '==', user.email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                setUserData({oid: doc.id, ...data});
                if (data.cv) {
                    setCvUri(data.cv);
                }
            });
        } else {
            Alert.alert('Error', 'Please re-login');
        }
    };

    const uploadCV = async () => {
        const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
        // console.log(result)
        if (!result.assets[0].canceled) {
            setUploading(true);
            const response = await fetch(result?.assets[0]?.uri);
            const blob = await response.blob();
            const cvRef = ref(storage, `cv/${user.email}.pdf`);
            await uploadBytes(cvRef, blob);
            const downloadURL = await getDownloadURL(cvRef);
            await setDoc(doc(db, 'MyInfo', userData?.oid), { cv: downloadURL }, { merge: true });
            setCvUri(downloadURL);
            setUploading(false);
            Alert.alert('Success', 'CV uploaded successfully');
        }
    };

    const shareCV = async () => {
        if (cvUri) {
            try {
                const { uri } = await FileSystem.downloadAsync(cvUri, FileSystem.cacheDirectory + 'cv.pdf');
    
                // Share the downloaded CV
                await Share.share({
                    url: uri,
                    title: 'Share CV',
                    message: 'Please find my CV attached.'
                });
            } catch (error) {
                Alert.alert('Error', 'Failed to download and share CV');
            }
        } else {
            Alert.alert('Error', 'No CV URL provided');
        }
    };
    const downLoadCV = async () => {
        if (cvUri) {
            try {
                await FileSystem.downloadAsync(cvUri, FileSystem.cacheDirectory + 'cv.pdf');
                Alert.alert('Success', 'CV is saved locally');
            } catch (error) {
                Alert.alert('Error', 'Failed to download CV');
            }
        }
    };

    const logout = () => {
        auth.signOut();
        router.replace('/DummyScreen/FourthScreen');
    };

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
        if (user) {
            GetUserData();
        }
    }, []);

    return (
        <View style={{
            height: '100%',
            backgroundColor: Colors.lightblack,
            padding: 20,
        }}>
            <StatusBar 
                barStyle="light-content" 
                backgroundColor={Colors.lightblack} 
                translucent={false} 
            />
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 50,
            }}>
                <TouchableOpacity
                    onPress={() =>{
                        router.push({
                            pathname: '/settings',
                            params: userData,
                        });
                    }}
                >
                    <SimpleLineIcons name="settings" size={28} color="white" />
                </TouchableOpacity>
                <Text style={{
                    color: Colors.white,
                    fontSize: 30,
                    fontWeight: 'bold',
                }}>
                    My Profile
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        router.push('/notification');
                    }}
                    style={{
                        backgroundColor: 'white',
                        padding: 10,
                        borderRadius: 99,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Octicons name="bell" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <View style={{
                alignItems: 'center',
                marginTop: 20,
            }}>
                <View style={{
                    borderWidth: 5,
                    borderColor: Colors.white,
                    borderRadius: 85,
                    padding: 5,
                }}>
                    <View style={{
                        borderWidth: 3,
                        borderColor: Colors.lightblack,
                        borderRadius: 80,
                    }}>
                        <Image 
                            source={ userData?.profileUrl ? {uri: userData?.profileUrl} : require('../../assets/images/profile.jpeg')}
                            style={{
                                width: 130,
                                height: 130,
                                borderRadius: 75,
                            }}
                        />
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => GetUserData()}
                >
                <Text style={{
                    color: Colors.white,
                    fontSize: 24,
                    fontWeight: 'bold',
                    marginTop: 20,
                }}>
                    {userData?.Name}
                </Text>
                </TouchableOpacity>
                <Text style={{
                    color: Colors.white,
                    fontSize: 16,
                    marginTop: 10,
                }}>
                    {userData?.class}
                </Text>
                <Text style={{
                    color: Colors.white,
                    fontSize: 16,
                    marginTop: 10,
                }}>
                    {userData?.no}
                </Text>
                <Text style={{
                    color: Colors.white,
                    fontSize: 16,
                    marginTop: 10,
                }}>
                    {userData?.cemail}
                </Text>
            </View>

            <View style={{
                marginTop: 20,
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20,
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Octicons name="mail" size={24} color={Colors.white} />
                        <Text style={{
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginLeft: 10,
                        }}>
                            Email
                        </Text>
                    </View>
                    <Text style={{
                        color: Colors.white,
                        fontSize: 18,
                    }}>
                        {userData?.email}
                    </Text>
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20,
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Octicons name="device-mobile" size={24} color={Colors.white} />
                        <Text style={{
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginLeft: 10,
                        }}>
                            Mobile
                        </Text>
                    </View>
                    <Text style={{
                        color: Colors.white,
                        fontSize: 18,
                    }}>
                        {userData?.mobile}
                    </Text>
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20,
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <FontAwesome name="linkedin" size={24} color={Colors.white} />
                        <Text style={{
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginLeft: 10,
                        }}>
                            LinkedIn
                        </Text>
                    </View>
                    <Text style={{
                        color: Colors.white,
                        fontSize: 18,
                    }}>
                        {userData?.linkedin}
                    </Text>
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <FontAwesome name="github" size={24} color={Colors.white} />
                        <Text style={{
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginLeft: 10,
                        }}>
                            GitHub
                        </Text>
                    </View>
                    <Text style={{
                        color: Colors.white,
                        fontSize: 18,
                    }}>
                        {userData?.github}
                    </Text>
                </View>
            </View>

            <View style={{
                borderColor: Colors.white,
                borderWidth: 2,
                padding: 20,
                borderRadius: 10,
                marginTop: 30,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderRadius: 10,
                }}>
                    <MaterialCommunityIcons name="file-document" size={48} color="white" />
                    <View style={{ marginLeft: 10 }}>
                        <Text style={{
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: 'bold',
                        }}>
                            My CV
                        </Text>
                        <Text style={{
                            color: Colors.white,
                            fontSize: 16,
                        }}>
                            {cvUri ? 'File Size: 2.5 MB' : 'No CV uploaded'}
                        </Text>
                    </View>
                </View>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                }}>
                    {!cvUri && (
                        <TouchableOpacity onPress={uploadCV} style={{
                            backgroundColor: Colors.white,
                            borderRadius: 50,
                            padding: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Octicons name="upload" size={30} color="black" />
                        </TouchableOpacity>
                    )}
                    {cvUri && (
                        <>
                            <TouchableOpacity onPress={shareCV} style={{
                                backgroundColor: Colors.white,
                                borderRadius: 50,
                                padding: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <SimpleLineIcons name="share" size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={downLoadCV} style={{
                                backgroundColor: Colors.white,
                                borderRadius: 50,
                                padding: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Octicons name="download" size={30} color="black" />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>

            <TouchableOpacity onPress={logout} style={{
                backgroundColor: Colors.white,
                padding: 15,
                borderRadius: 99,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 30,
            }}>
                <Text style={{
                    color: Colors.black,
                    fontSize: 20,
                    fontWeight: 'bold',
                }}>
                    Logout
                </Text>
            </TouchableOpacity>
        </View>
    );
}
