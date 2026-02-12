import React, {useEffect, useState} from "react";
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
import {supabase} from "@/supabase/SupabaseClient";
import {Places} from "@/models/places";
import {Card} from "@/components/ui/card";
import {useNavigation} from "@react-navigation/core";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {HomeStackParamList} from "@/navigation_types/homestackparamlist";
import {popularDestinationsCardColor} from "@/colors/populardestinationscardcolor.ts";
import {ShufflePlaceDaily} from "@/util/shuffleplacedaily.ts";

const {width} = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = CARD_WIDTH * 0.6;

const PopularDestinations: React.FC = (): React.JSX.Element => {
    const [places, setPlaces] = useState<Places>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

    useEffect(() => {
        fetchPopularPlaces().then();
    }, []);

    const fetchPopularPlaces = async (): Promise<void> => {
        const {data, error} = await supabase
            .from("places")
            .select(
                "id, title, description, image_url, city, country, price_usd, duration_days, distance_km, weather_icon, created_at"
            )
            .limit(50);

        if (error) {
            console.log("Error fetching popular destinations:", error.message);
            setLoading(false);
            return;
        }

        if (!data) {
            setLoading(false);
            return;
        }

        const shuffle = new ShufflePlaceDaily();
        setPlaces(shuffle.shuffleDaily(data));
        setLoading(false);
    };

    if (loading) {
        return (
            <View className="h-64 justify-center items-center">
                <ActivityIndicator size="large" color="#22c55e"/>
            </View>
        );
    }

    return (
        <View className="m-6">
            <Text className="text-2xl font-bold px-4 mb-4 text-green-600">
                Popular Destinations
            </Text>

            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={places}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 30}}
                renderItem={({item}) => (
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{width: CARD_WIDTH}}
                        className="mr-4"
                    >
                        <Card size="md" variant="elevated" className="rounded-3xl overflow-hidden ">
                            <View className="w-full">
                                {/* Image */}
                                <FastImage
                                    source={{uri: item.image_url}}
                                    style={{width: "100%", height: CARD_HEIGHT}}
                                    resizeMode={FastImage.resizeMode.cover}
                                />

                                {/* Gradient info */}
                                <LinearGradient colors={popularDestinationsCardColor} className="p-4">
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
                                        <TouchableOpacity
                                            className="bg-green-600 rounded-full py-3 px-6 items-center self-center shadow-md"
                                            onPress={() => navigation.navigate("Trip", {id: item.id})}
                                        >
                                            <Text className="text-base font-semibold text-white">See more</Text>
                                        </TouchableOpacity>
                                    </View>
                                </LinearGradient>
                            </View>
                        </Card>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default PopularDestinations;
