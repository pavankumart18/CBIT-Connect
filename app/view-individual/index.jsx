import { View, Text, TouchableOpacity ,Image} from 'react-native'
import React,{useEffect , useState} from 'react';
import { useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../configs/FireBaseConfigs';
import Octicons from '@expo/vector-icons/Octicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ViewIndividual() {
    const userData = useLocalSearchParams();
    const navigation = useNavigation();
    const router = useRouter();
    const [member, setMember] = useState(userData);

    const GetData = async () => {
        try {
            const q = query(collection(db, 'MyInfo'), where('email', '==', userData.user));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setMember(doc.data());
            });
            console.log('Document data:', member);
        } catch (error) {
            console.error('Error fetching document: ', error);
        }
    }

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        })
        if (userData) {
            console.log('userData:', userData);
            GetData();
        }
    }, [])

  return (
    <View
        style={{
            padding: 20,
            paddingTop: 50,
            height: '100%',
            backgroundColor: Colors.lightblack,
        }}
    >
        <View
        >
            <TouchableOpacity
                onPress={() => router.back()}
            >
                <Ionicons name="chevron-back" size={30} color="white" />
            </TouchableOpacity>
        </View>
        <View>
            <Image 
                source={ member?.profileUrl ? {uri: member?.profileUrl} : require('../../assets/images/profile.jpeg')}
                style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    alignSelf: 'center',
                    marginTop: 20,
                }}
            />
            <Text
                style={{
                    color: 'white',
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginTop: 10,
                }}
            >{member?.Name}</Text>
            <Text
                style={{
                    color: 'white',
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginTop: 10,
                }}
            >{member?.class}</Text>
            <Text
                style={{
                    color: 'white',
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginTop: 10,
                }}
            >{member?.no}</Text>
            <Text
                style={{
                    color: 'white',
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginTop: 10,
                }}
            >{member?.cemail}</Text>
        </View>
        <View>
        <View style={{
                marginTop: 50,
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
                        {member?.email}
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
                        {member?.mobile}
                    </Text>
                </View>

                {/* LinkedIn Section */}
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
                        {member?.linkedin}
                    </Text>
                </View>

                {/* GitHub Section */}
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
                        {member?.github}
                    </Text>
                </View>

            </View>
        </View>
      
    </View>
  )
}