import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    Alert,
} from "react-native";
import { supabase } from "@/supabase/SupabaseClient";
import { PlaceBookings } from "@/models/bookings";
import LinearGradient from "react-native-linear-gradient";
import { BookingCardsColor } from './../colors/bookingcardscolor';

const Bookings: React.FC = (): React.JSX.Element => {
    const [bookings, setBookings] = useState<PlaceBookings>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchBookings().then();
    }, []);

    // Fetch bookings from Supabase
    const fetchBookings = async () => {
        setLoading(true);
        try {
            const { data: userData } = await supabase.auth.getUser();
            const user = userData?.user;
            if (!user) {
                setBookings([]);
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("bookings")
                .select("*, places(*)")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) console.error(error)
            if (data) setBookings(data as PlaceBookings);
        } catch (err: any) {
            console.log("Error fetching bookings:", err.message);
            Alert.alert("Error", "Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    // Handle payment and update status
    const handlePayment = async (bookingId: string) => {
        setProcessingId(bookingId);

        try {
            // Update in Supabase
            const { error } = await supabase
                .from("bookings")
                .update({ status: "confirmed" })
                .eq("id", bookingId);

            if (error) console.error(error);

            // Update local state after successful payment
            setBookings((prev) =>
                prev.map((b) =>
                    b.id === bookingId ? { ...b, status: "confirmed" } : b
                )
            );

            Alert.alert("Payment successful", "Your booking is confirmed!");
        } catch (err:any) {
            Alert.alert("Payment failed", err.message);
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#22c55e" />
                <Text className="text-gray-400 mt-3">Loading your trips...</Text>
            </View>
        );
    }

    if (bookings.length === 0) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50 px-10">
                <Text className="text-5xl mb-4">✈️</Text>
                <Text className="text-lg font-semibold text-gray-700">
                    No bookings yet
                </Text>
                <Text className="text-gray-400 text-center mt-2">
                    When you book a trip, it will appear here.
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50 px-4 pt-4">
            <FlatList
                data={bookings}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
                renderItem={({ item }) => (
                    <LinearGradient
                        colors={BookingCardsColor}
                        className="mb-6 rounded-3xl p-6 shadow-lg"
                    >
                        <Text className="text-white text-2xl font-bold">
                            {item?.place_title}
                        </Text>

                        <Text className="text-green-100 mt-1 text-lg">
                            📍 {item?.city}, {item?.country}
                        </Text>

                        <View className="h-[1px] bg-green-300 opacity-30 my-4" />

                        <View className="flex-row justify-between items-center"   >
                            <View>
                                <Text className="text-green-200 text-lg">Travel Date</Text>
                                <Text className="text-white text-lg font-semibold">
                                    {item.travel_date}
                                </Text>
                            </View>

                            <View className="items-end">
                                <Text className="text-green-200 text-lg">Total</Text>
                                <Text className="text-white text-lg font-bold">
                                    ${item.total_price}
                                </Text>
                            </View>
                        </View>

                        {/* Pay Now button or status badge */}
                        {item.status === "pending" ? (
                            <TouchableOpacity
                                className="bg-yellow-500 mt-5 py-3 px-6 rounded-full self-start shadow"
                                onPress={() => handlePayment(item.id)}
                                disabled={processingId === item.id}
                                style={{ opacity: processingId === item.id ? 0.6 : 1 }}
                            >
                                <Text className="text-white font-bold text-lg">
                                    {processingId === item.id ? "Processing..." : "Pay Now"}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <View
                                className={`mt-5 px-4 py-2 rounded-full self-start ${
                                    item.status === "confirmed" ? "bg-green-600" : "bg-red-100"
                                }`}
                            >
                                <Text
                                    className={`text-lg font-bold ${
                                        item.status === "confirmed" ? "text-white" : "text-red-700"
                                    }`}
                                >
                                    {item.status.toUpperCase()}
                                </Text>
                            </View>
                        )}
                    </LinearGradient>
                )}
            />
        </View>
    );
};

export default Bookings;
