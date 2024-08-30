import { Stack } from "expo-router";
import React from "react";
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" 
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen name="DummyScreen/IntialScreen" 
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen name="DummyScreen/SecondScreen" 
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen name="DummyScreen/ThirdScreen" 
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen name="DummyScreen/FourthScreen" 
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen name="login/index" 
      />
      <Stack.Screen name="Signup/index" />
      <Stack.Screen name="(tabs)" 
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
}
