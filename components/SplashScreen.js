import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, withRepeat ,withSpring} from 'react-native-reanimated';
import { Colors } from '../constants/Colors';
import { FadeInRight } from 'react-native-reanimated';

export default function SplashScreen() {
  const rotateValue = useSharedValue(0);
  const animationValue = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    rotateValue.value = withRepeat(
      withTiming(360, {
        duration: 4000,
        easing: Easing.ease,
      }),
      -1,//infinite loop
      0  // no delay
    );
  }, [rotateValue]);

  useEffect(()=>{
    animationValue.value=1;
  },[]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotateValue.value}deg` }],
    };
  });
  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(animationValue.value, { damping: 2 }),
      transform: [{ scale: withSpring(animationValue.value, { damping: 2 }) }]
    };
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.green }}>
      <Animated.Image
        source={require('../assets/images/splash.png')}
        style={[{
          position: 'absolute',
          width: 400,
          height: 400,
          top: -200, 
          left: -200, 
        }, animatedStyle]}
      />
      <Animated.Image
        source={require('../assets/images/splash.png')}
        style={[{
          position: 'absolute',
          width: 400,
          height: 400,
          bottom: -200, 
          right: -200,  
        }, animatedStyle]}
      />
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Animated.Text style={[{ fontSize: 35, fontWeight: 'bold' ,letterSpacing:2}]}
            entering={FadeInRight.delay(300).duration(400)}
        >CBIT Connect</Animated.Text>
      </View>
    </View>
  );
}
