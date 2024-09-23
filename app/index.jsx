import { Text, View } from "react-native";
import React from "react";
import SplashScreen from "../components/SplashScreen";
import { Colors } from "../constants/Colors";
import { useRouter } from "expo-router";

import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en'
import ru from 'javascript-time-ago/locale/ru'

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)


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
