import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MapView, { Marker, UrlTile, PROVIDER_DEFAULT } from "react-native-maps";

const GEOAPIFY_API_KEY = process.env.METRO_PUBLIC_GEOAPIFY_API_KEY || "";

type RouteParams = {
    MapScreen: {
        latitude?: number;
        longitude?: number;
    };
};

const Map: React.FC = () => {
    const route = useRoute<RouteProp<RouteParams, "MapScreen">>();
    const navigation = useNavigation();

    const latitude = route.params?.latitude;
    const longitude = route.params?.longitude;

    if (latitude === undefined || longitude === undefined) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>No location provided</Text>
            </View>
        );
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    const [address, setAddress] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const reverseGeocode = async () => {
            try {
                const res = await fetch(
                    `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${GEOAPIFY_API_KEY}`
                );
                const data = await res.json();
                if (data.features && data.features.length > 0) {
                    setAddress(data.features[0].properties.formatted);
                }
            } catch (err) {
                console.log("Geoapify Reverse Geocode Error:", err);
            } finally {
                setLoading(false);
            }
        };
        reverseGeocode().then();
    }, [lat, lng]);

    // Adjust delta for better Android rendering
    const latitudeDelta = 0.02;
    const longitudeDelta = 0.02;

    return (
        <View className="flex-1">
            {/* Loading overlay */}
            {loading && (
                <View className="absolute inset-0 justify-center items-center z-10 bg-white/50">
                    <ActivityIndicator size="large" color="#34D399" />
                </View>
            )}

            {/* Map */}
            <MapView
                provider={PROVIDER_DEFAULT}
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta,
                    longitudeDelta,
                }}
                showsUserLocation={false}
                showsMyLocationButton={false}
                rotateEnabled={false}
                pitchEnabled={false}
            >
                {/* OpenStreetMap tiles */}
                <UrlTile
                    urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maximumZ={19}
                    flipY={false}
                />

                {/* Marker */}
                <Marker
                    coordinate={{ latitude: lat, longitude: lng }}
                    title="You are here"
                    description={address || ""}
                    className='bg-green-500 text-white'
                />
            </MapView>

            {/* Back button */}
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="absolute top-12 left-5 bg-green-500 p-3 rounded-full shadow"
            >
                <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>


        </View>
    );
};

export default Map;
