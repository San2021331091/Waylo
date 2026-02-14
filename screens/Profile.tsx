import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { supabase } from "@/supabase/SupabaseClient";
import UserEmail from "@/ui-components/UserEmail";
import Bookings from "@/ui-components/Bookings";

const Profile:React.FC = ():React.JSX.Element => {
    const [username, setUsername] = useState<string>("");

    useEffect(() => {
        const loadUser = async () => {
            const { data } = await supabase.auth.getUser();
            const user = data?.user;

            if (user) {
                // Generate stable username from user id
                const shortId = user.id.slice(0, 4);
                setUsername(`traveler_${shortId}`);
            }
        };

        loadUser().then();
    }, []);

    // Use gender-neutral DiceBear style
    const avatarUrl = `https://api.dicebear.com/7.x/initials/png?seed=${username}&backgroundColor=22c55e&textColor=ffffff`;

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <View className="flex-1 bg-white">

            {/* Header */}
            <View className="bg-green-700 rounded-b-3xl px-6 pt-16 pb-10 items-center shadow-lg">

                <Image
                    source={{ uri: avatarUrl }}
                    className="w-28 h-28 rounded-full bg-white"
                />

                <Text className="text-2xl font-bold text-white mt-4">
                    {username}
                </Text>

                <UserEmail />

                <TouchableOpacity
                    onPress={handleSignOut}
                    className="bg-green-500 mt-6 px-8 py-3 rounded-xl shadow active:opacity-80"
                >
                    <Text className="text-white font-bold text-lg">
                        Sign Out
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Bookings Section */}
            <View className="flex-1 pt-4">
                <Text className='text-2xl font-bold px-4 m-2 text-green-600'>
               Trips
                </Text>
                <Bookings />
            </View>

        </View>
    );


};

export default Profile;
