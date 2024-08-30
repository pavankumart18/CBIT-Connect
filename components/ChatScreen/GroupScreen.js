import { View, Text,Image, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
export default function GroupScreen({chat}) {
    const router = useRouter();

  return (
    <View
        style={{
            marginTop: 30,
        }}
    >
        <View
            style={{
                backgroundColor: 'orange',
                padding: 20,
                borderRadius: 20,
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 20,
                }}
            >
            <Image 
                source={ chat?.profilePicture ? {uri: chat?.profilePicture} : require('../../assets/images/profile.jpeg')}
                style={{
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                }}
            />
            <View>
            <Text
                style={{
                    color: 'white',
                    fontSize: 20,
                    fontWeight: 'bold',
                }}
            >{chat?.name}</Text>
            <Text
                style={{
                    color: 'white',
                    fontSize: 16,
                    fontWeight: 'bold',
                }}
            >{chat?.admin}</Text>
            </View>
            </View>
            <Text
                style={{
                    color: 'white',
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginTop: 10,
                }}
            >
                About Group: {chat?.about}
            </Text>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 20,
                }}
            >
            <View
                style={{
                    backgroundColor: 'white',
                    padding: 10,
                    borderRadius: 20,
                }}
            >
                <Text>
                    {chat?.category}
                </Text>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    gap: 20,
                }}
            >
                <View
                    style={{
                        backgroundColor: 'black',
                        padding: 10,
                        borderRadius: 20,
                    }}
                >
                <AntDesign name="heart" size={24} color="white" />
                </View>
                <TouchableOpacity
                    onPress={() => router.push({
                        pathname: '/chat-screen',
                        params : chat,
                    })}
                >
                <View
                    style={{
                        backgroundColor: 'black',
                        padding: 10,
                        borderRadius: 20,
                    }}
                >
                <Feather name="arrow-right-circle" size={24} color="white" />
                </View>
                </TouchableOpacity>
            </View>
            </View>
        </View>
    </View>
  )
}