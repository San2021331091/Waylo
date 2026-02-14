import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    ScrollView,
    Alert,
} from "react-native";
import FastImage from "react-native-fast-image";
import LinearGradient from "react-native-linear-gradient";
import { supabase } from "@/supabase/SupabaseClient";
import { Place } from "@/models/places";
import { useRoute, useNavigation } from "@react-navigation/core";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SpecificTripsColor } from "@/colors/specifictripscolor";

// 🔥 Reanimated
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
} from "react-native-reanimated";
import {HomeStackParamList} from "@/navigation_types/homestackparamlist";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

const { width } = Dimensions.get("window");
const CARD_HEIGHT = width * 0.55;

const SpecificTrip: React.FC = (): React.JSX.Element => {
    const [place, setPlace] = useState<Place | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const route = useRoute();
    const navigation = useNavigation();
    const mapNavigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
    const { id } = route.params as { id: string };

    // 🔥 Reanimated values
    const opacity = useSharedValue<number>(0);
    const translateY = useSharedValue<number>(40);

    useEffect(() => {
        fetchPlaceById(id).then();
    }, [id]);

    useEffect(() => {
        if (place) {
            opacity.value = withTiming(1, { duration: 800 });
            translateY.value = withSpring(0, {
                damping: 12,
                stiffness: 100,
            });
        }
    }, [place]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ translateY: translateY.value }],
        };
    });

    const fetchPlaceById = async (placeId: string) => {
        const { data, error } = await supabase
            .from("places")
            .select("*")
            .eq("id", placeId)
            .single();

        if (error) console.log(error.message);
        else if (data) setPlace(data);

        setLoading(false);
    };

    const getWeatherIcon = (weather?: string) => {
        if (!weather) return "sunny";

        const w = weather.toLowerCase();
        if (w.includes("sun")) return "sunny";
        if (w.includes("partly")) return "partly-sunny";
        if (w.includes("cloud")) return "cloudy";
        if (w.includes("rain")) return "rainy";
        if (w.includes("storm")) return "thunderstorm";
        if (w.includes("snow")) return "snow";
        if (w.includes("night")) return "moon";

        return "sunny";
    };

    const handleBooking = async () => {
        if (!place) return;

        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;

        if (!user) {
            Alert.alert("Please login first");
            return;
        }

        const { error } = await supabase
            .from("bookings")
            .insert([
                {
                    user_id: user.id,
                    place_id: place.id,
                    travel_date: new Date(),
                    guests: 1,
                    total_price: place.price_usd,
                    status: "pending",
                    place_title: place.title,
                    city: place.city,
                    country: place.country,
                },
            ]);

        if (error) {
            console.log(error.message);
            Alert.alert("Booking failed");
        } else {
            Alert.alert("Booking successful 🎉");
        }
    };



    if (loading)
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#22c55e" />
            </View>
        );

    if (!place)
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-red-500 text-lg">Place not found</Text>
            </View>
        );

    return (
        <ScrollView
            className="flex-1 bg-white"
            contentContainerStyle={{ paddingBottom: 60}}
        >
            {/* Image */}
            <View className="relative">
                <FastImage
                    source={{ uri: place.image_url }}
                    style={{ width: "100%", height: CARD_HEIGHT }}
                    resizeMode={FastImage.resizeMode.cover}
                />

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="absolute top-12 left-4 bg-green-500 p-3 rounded-full"
                >
                    <Icon name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <LinearGradient
                colors={SpecificTripsColor}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                className="p-6 m-5 rounded-3xl"
            >
                <View className="flex-row items-start">

                    {/* Title */}
                    <Animated.Text
                        style={animatedStyle}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        className="flex-1 text-4xl font-bold text-green-700"
                    >
                        {place.title}
                    </Animated.Text>

                    {/* Price */}
                    <View className="ml-3">
                        <Text className="text-3xl font-bold text-green-600">
                            ${place.price_usd}
                        </Text>
                    </View>

                </View>

                {(place.city || place.country) && (
                    <Text className="text-green-500 mt-5 text-lg font-semibold">
                        {place.city}
                        {place.country ? `, ${place.country}` : ""}
                    </Text>
                )}

                <Text className="text-green-700 mt-5 text-lg leading-7 font-bold">
                    {place.description}
                </Text>

                {/* Info Row */}
                <View className="flex-row justify-between mt-6 flex-wrap">

                        <View className="flex-row items-center mb-3">
                            <Icon name="clock-outline" size={24} color="#4B5563" />
                            <Text className="ml-2 text-lg text-green-700">
                                {place.duration_days} Days
                            </Text>
                        </View>


                        <View className="flex-row items-center mb-3">
                            <Ionicons
                                name="navigate-outline"
                                size={24}
                                color="#4B5563"
                            />
                            <Text className="ml-2 text-lg text-green-700">
                                {place.distance_km} km
                            </Text>
                        </View>


                        <View className="flex-row items-center mb-3">
                            <Ionicons
                                name={getWeatherIcon(place.weather_icon)}
                                size={24}
                                color="#4B5563"
                            />
                            <Text className="ml-2 text-lg text-green-700">
                                {place.temperature}°C
                            </Text>
                        </View>
                </View>

                {/* Coordinates */}

                    <View className="mt-5">
                        <Text className="text-green-500 text-lg font-semibold">
                            Latitude: {place.latitude}
                        </Text>
                        <Text className="text-green-500 text-lg font-semibold mt-1">
                            Longitude: {place.longitude}
                        </Text>
                        <TouchableOpacity className="bg-green-500 mt-3 mb-3 rounded-full py-3 items-center active:opacity-70 shadow" onPress={
                            (): void => mapNavigation.navigate('Map',{ longitude: place?.longitude, latitude: place?.latitude})
                        }>
                            <Text className="text-white font-bold text-xl">
                                See location
                            </Text>
                        </TouchableOpacity>
                    </View>

                <TouchableOpacity className="bg-green-600 mt-10 mb-10 rounded-full py-5 items-center active:opacity-80 shadow" onPress={handleBooking}>
                    <Text className="text-white font-bold text-xl">
                        Book Now
                    </Text>
                </TouchableOpacity>
            </LinearGradient>
        </ScrollView>
    );
};

export default SpecificTrip;
