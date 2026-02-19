import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "@/navigation_types/homestackparamlist";

const ImageBanner: React.FC = (): React.JSX.Element => {
    const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>()
    return (
        <View className="w-[95%] self-center h-80 rounded-2xl overflow-hidden">
            <ImageBackground
                source={{ uri: "https://i.postimg.cc/YCVGX0wm/nature.jpg" }}
                resizeMode="cover"
                className="flex-1 justify-center items-center"
            >
                {/* Dark Overlay */}
                <View className="absolute inset-0 bg-black/40" />

                {/* Content */}
                <View className="z-10 items-center px-6">
                    <Text className="text-white text-3xl font-bold text-center">
                        Plan your next adventure
                    </Text>

                    <TouchableOpacity className="mt-6 bg-green-600 px-6 py-3 rounded-full" onPress={(): void => navigation.navigate('Explore')}>
                        <Text className="text-white font-semibold">
                            Create a new trip plan
                        </Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
}
export default ImageBanner;