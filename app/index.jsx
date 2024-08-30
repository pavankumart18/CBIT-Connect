import { Text, View } from "react-native";
import React from "react";
import SplashScreen from "../components/SplashScreen";
import { Colors } from "../constants/Colors";
import { useRouter } from "expo-router";
export default function Index() {
  const router = useRouter();
  React.useEffect(() => {
    setTimeout(() => {
      router.push("/DummyScreen/IntialScreen");
    }, 2000);
  }, []);
  return (
    <SplashScreen />
  );
}
