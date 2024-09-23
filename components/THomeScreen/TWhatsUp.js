import React from 'react';
import { Dimensions, View, Text, ImageBackground } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Colors } from '../../constants/Colors';

const data = [
  { id: '1', title: 'Orientation', description: 'Welcome to new cbitians' },
  { id: '2', title: 'Accenture Placement Exam', description: 'Accenture exam is going on ppo labs' },
  // Add more items as needed
];

export default function TWhatsUp() {
  const width = Dimensions.get('window').width - 40;
  const height = width / 2 + width / 8; // Adjust this ratio as needed

  return (
    <View style={{ marginTop: 20 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <FontAwesome6 name="school" size={26} color="white" />
        <Text
          style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
            letterSpacing: 1,
          }}
        >
          Campus Buzz
        </Text>
      </View>
      <Carousel
        loop
        width={width}
        height={height}
        autoPlay={true}
        data={data}
        scrollAnimationDuration={2000}
        mode="parallax"
        modeConfig={{
          stackInterval: 30,
          translateY: -30,
        }}
        renderItem={({ index }) => {
          const item = data[index];
          return (
            <View
              key={item.id}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: Colors.white,
                borderRadius: 10,
                overflow: 'hidden',
                padding: 0,
              }}
            >
              <ImageBackground
                source={require('../../assets/images/CBIT.jpg')}
                style={{
                  width: width,
                  height: height,
                  justifyContent: 'center',
                }}
                imageStyle={{
                  borderRadius: 10,
                  opacity: 0.8, // Reduce the visibility of the image
                }}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark overlay to reduce image visibility
                    borderRadius: 10,
                    justifyContent: 'flex-end',
                    paddingBottom: 20, // Space for the text at the bottom
                    paddingHorizontal: 20,
                  }}
                >
                  <Text style={{ fontSize: 30, color: 'white', fontWeight: 'bold' }}>
                    {item.title}
                  </Text>
                  <Text style={{ color: 'white', marginTop: 5 }}>
                    {item.description}
                  </Text>
                </View>
              </ImageBackground>
            </View>
          );
        }}
      />
    </View>
  );
}
