import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useRoute, useNavigation } from "@react-navigation/core";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

const LOCATIONIQ_API_KEY = "YOUR_LOCATIONIQ_KEY"; // 👈 Put your key here

const Map: React.FC = (): React.JSX.Element => {
    const route = useRoute();
    const navigation = useNavigation();

    const { longitude, latitude } = route.params as {
        longitude: number;
        latitude: number;
    };

    const [address, setAddress] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        reverseGeocode().then();
    }, []);

    const reverseGeocode = async () => {
        try {
            const response = await fetch(
                `https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_API_KEY}&lat=${latitude}&lon=${longitude}&format=json`
            );

            const data = await response.json();
            setAddress(data.display_name);
        } catch (error) {
            console.log("Reverse Geocode Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* 🗺 Map */}
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                <Marker coordinate={{ latitude, longitude }} />
            </MapView>

            {/* 🔙 Back Button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            {/* 📍 Bottom Card */}
            <View style={styles.bottomCard}>
                {loading ? (
                    <ActivityIndicator size="small" color="#22c55e" />
                ) : (
                    <>
                        <Text style={styles.title}>Selected Location</Text>
                        <Text style={styles.address}>
                            {address ?? "Address not found"}
                        </Text>
                    </>
                )}
            </View>
        </View>
    );
};

export default Map;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: width,
        height: height,
    },
    backButton: {
        position: "absolute",
        top: 50,
        left: 20,
        backgroundColor: "#22c55e",
        padding: 10,
        borderRadius: 30,
        elevation: 5,
    },
    bottomCard: {
        position: "absolute",
        bottom: 30,
        left: 20,
        right: 20,
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 20,
        elevation: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 6,
        color: "#111",
    },
    address: {
        fontSize: 14,
        color: "#555",
    },
});
