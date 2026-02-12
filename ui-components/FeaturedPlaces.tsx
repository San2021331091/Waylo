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
import { Places } from "@/models/places";
import { Card } from "@/components/ui/card";
import {featuredCardColor} from "@/colors/featuredcardcolor";
import {useNavigation} from "@react-navigation/core";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {HomeStackParamList} from "@/navigation_types/homestackparamlist";
import {RandomizedPlace} from "@/util/randomize";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = CARD_WIDTH * 0.6;

const FeaturedPlaces: React.FC = (): React.JSX.Element => {
    const [places, setPlaces] = useState<Places>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();


    useEffect(() => {
        fetchFeaturedPlaces().then();
    }, []);

    const fetchFeaturedPlaces = async (): Promise<void> => {
        const { data, error } = await supabase
            .from("places")
            .select("id, title, description, image_url, city, country, price_usd")
            .order("price_usd", { ascending: false })
            .limit(12);

        if (error) {
            console.log("Error fetching featured:", error.message);
        } else {

            const randomizedData = new RandomizedPlace()

            setPlaces(randomizedData.randomize(data));
        }

        setLoading(false);
    };

    if (loading) {
        return (
            <View className="h-64 justify-center items-center">
                <ActivityIndicator size="large" color="#22c55e" />
            </View>
        );
    }

    return (
        <View className="m-6">
            <Text className="text-2xl font-bold px-4 mb-4 text-green-600">
                Featured Places
            </Text>

            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={places}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{ width: CARD_WIDTH }}
                        className="mr-4"
                    >
                        <Card size="md" variant="elevated" className="rounded-3xl overflow-hidden">

                            <View className="w-full">

                                {/* Image (top of card) */}
                                <FastImage
                                    source={{ uri: item.image_url }}
                                    style={{
                                        width: "100%",
                                        height: CARD_HEIGHT,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                />

                                {/* Gradient text section */}
                                <LinearGradient
                                    colors={featuredCardColor}
                                    className="p-4"
                                >
                                    <Text className="text-xl font-bold text-green-800">
                                        {item.title}
                                    </Text>

                                    <Text className="text-green-500 font-semibold text-lg mt-1">
                                        {item.city}, {item.country}
                                    </Text>

                                    <Text numberOfLines={2} className="text-green-600 text-lg font-bold mt-2">
                                        {item.description}
                                    </Text>

                                    <Text className="text-green-600 font-semibold text-lg mt-3">
                                      Cost: ${item.price_usd}
                                    </Text>

                                    <View className='mt-2'>
                                        <TouchableOpacity
                                            className="bg-green-600 rounded-full py-3 px-6 items-center self-center shadow-md"
                                        onPress={ (): void => navigation.navigate('Trip',{id: item.id})}>
                                            <Text className="text-base font-semibold text-white">
                                                See more
                                            </Text>
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

export default FeaturedPlaces;
