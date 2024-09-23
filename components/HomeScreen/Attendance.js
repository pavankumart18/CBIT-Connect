import React, { useEffect ,useState} from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import {auth} from '../../configs/FireBaseConfigs';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../configs/FireBaseConfigs';
export default function Attendance({attendance}) {
  const user = auth.currentUser;
  const [MyInfo, setMyInfo] = useState([]);



  const percentage = attendance; 
  const radius = 40;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const progress = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference-(circumference * progress.value) / 100,
    };
  });

  useEffect(() => {
    progress.value = withTiming(percentage, { duration: 1000 });
  }, [percentage]);

  const GetAttendance = async () => {
    // Add code to get attendance from the database
    const q=query(collection(db,'MyInfo'),where('email','==',user.email))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setMyInfo(doc.data());
    });
    console.log(MyInfo);
  }
  useEffect(() => {
    GetAttendance();
  }
  , [user]);

  return (
    <View style={{ marginTop: 20 }}>
      <View
        style={{
          backgroundColor: '#8667F2',
          padding: 30,
          borderRadius: 10,
          marginTop: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View>
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              fontWeight: 'bold',
            }}
          >
            Attendance
          </Text>
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              marginTop: 10,
            }}
          >
            Updated On: DD-MM-YYYY
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.white,
              borderRadius: 99,
              marginTop: 20,
              paddingHorizontal: 20,
              paddingVertical: 10,
              alignItems: 'center',
            }}
            onPress={()=>{Alert.alert('This Feature is not available right now')}}
          >
            <Text
              style={{
                color: 'black',
                fontSize: 16,
              }}
            >
              View Subject wise
            </Text>
          </TouchableOpacity>
        </View>

        {/* Circular Progress in place of the image */}
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Svg width={100} height={100}>
            <Circle
              stroke="gray"
              fill="none"
              cx="50"
              cy="50"
              r={radius}
              strokeWidth={strokeWidth}
            />
            <AnimatedCircle
              stroke="#00FF00"
              fill="none"
              cx="50"
              cy="50"
              r={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              animatedProps={animatedProps}
              strokeLinecap="round"
            />
          </Svg>
          <View
            style={{
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              {`${percentage}%`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
