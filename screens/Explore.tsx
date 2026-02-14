import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import FastImage from "react-native-fast-image";
import { supabase } from "@/supabase/SupabaseClient";
import { Card } from "@/components/ui/card";
import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Places } from "@/models/places";
import { AllPlacesCardColor } from "@/colors/allplacesscreencolor";
import {TripStackParamList} from "@/navigation_types/tripstackparamlist";
const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = CARD_WIDTH * 0.6;

const Explore: React.FC = (): React.JSX.Element => {
    const [places, setPlaces] = useState<Places>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigation = useNavigation<NativeStackNavigationProp<TripStackParamList>>();

    useEffect(() => {
        fetchAllPlaces().then();
    }, []);

    const fetchAllPlaces = async () => {
        try {
            const { data, error } = await supabase
                .from("places")
                .select(
                    "id, title, description, image_url, city, country, price_usd, duration_days, distance_km, weather_icon"
                )
                .order("created_at", { ascending: false });

            if (error) {
                console.log("Error fetching places:", error.message);
                setLoading(false);
                return;
            }

            if (data) setPlaces(data);
        } catch (err) {
            console.log("Fetch failed:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="h-full justify-center items-center">
                <ActivityIndicator size="large" color="#22c55e" />
            </View>
        );
    }

    if (!places.length) {
        return (
            <View className="h-full justify-center items-center">
                <Text className="text-lg font-semibold text-gray-700">
                    No places found.
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 p-4 m-4">
            <Text className="text-2xl font-bold text-green-600 mb-4 text-center">
                Explore Places
            </Text>

            <FlatList
                data={places}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }}
                renderItem={({ item }) => (
                    <Card size="md" variant="elevated" className="rounded-3xl overflow-hidden mb-6">
                        <View>
                            {/* Image */}
                            <FastImage
                                source={{ uri: item.image_url }}
                                style={{ width: "100%", height: CARD_HEIGHT }}
                                resizeMode={FastImage.resizeMode.cover}
                            />

                            {/* Gradient overlay with info */}
                            <LinearGradient
                                colors={AllPlacesCardColor}
                                className="p-4"
                            >
                                <Text className="text-xl font-bold text-green-800">{item.title}</Text>
                                <Text className="text-green-500 font-semibold text-lg mt-1">
                                    {item.city}, {item.country}
                                </Text>
                                <Text numberOfLines={2} className="text-green-600 text-lg font-bold mt-2">
                                    {item.description}
                                </Text>
                                <Text className="text-green-600 font-semibold text-lg mt-2">
                                    Duration: {item.duration_days} day(s)
                                </Text>
                                <Text className="text-green-600 font-semibold text-lg mt-1">
                                    Distance: {item.distance_km} km
                                </Text>
                                <Text className="text-green-600 font-semibold text-lg mt-1">
                                    Cost: ${item.price_usd}
                                </Text>
                                <Text className="text-green-600 font-semibold text-lg mt-1">
                                    Weather: {item.weather_icon}
                                </Text>

                                <View className="mt-2">
                                    {/* Only "See more" is clickable */}
                                    <TouchableOpacity
                                        className="bg-green-600 rounded-full py-3 px-6 items-center self-center shadow-md"
                                        activeOpacity={0.8}
                                        onPress={() => navigation.navigate("Trip", { id: item.id })}
                                    >
                                        <Text className="text-base font-semibold text-white">
                                            See more
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>
                        </View>
                    </Card>
                )}
            />
        </View>
    );
};

export default Explore;
