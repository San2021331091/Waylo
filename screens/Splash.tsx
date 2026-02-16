import React, { useEffect } from "react";
import LinearGradient from "react-native-linear-gradient";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSpring 
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/navigation_types/rootstackparamlist";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SplashScreenColor } from "@/colors/splashscreencolor";

const Splash: React.FC = (): React.JSX.Element => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Shared value for bounce
  const scale = useSharedValue(1);

  useEffect(() => {
    // Spring bounce animation
    scale.value = withRepeat(
      withSpring(1.2, { damping: 5, stiffness: 120 }),
      -1, // infinite
      true // reverse
    );

    // Navigate after 6 seconds
    const timer = setTimeout(() => {
      navigation.replace("RootStack");
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  // Animated style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <LinearGradient
      colors={SplashScreenColor}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1 justify-center items-center"
    >
      <Animated.Image
        source={{ uri: "https://i.postimg.cc/7PMbzqZh/waylo.png" }}
        className="w-40 h-40"
        resizeMode="contain"
        style={animatedStyle}
      />
    </LinearGradient>
  );
};

export default Splash;
