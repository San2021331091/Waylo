import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { supabase } from "@/supabase/SupabaseClient";
import { Places } from "@/models/places";
import {useNavigation} from "@react-navigation/core";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {HomeStackParamList} from "@/navigation_types/homestackparamlist";
import {SearchCardColor} from "@/colors/searchcardcolor";

const Search: React.FC = (): React.JSX.Element => {
    const [query, setQuery] = useState<string>("");
    const [results, setResults] = useState<Places>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

    useEffect(() => {
        if (query.trim() === "") {
            setResults([]);
            return;
        }

        const delayDebounce = setTimeout(() => {
            fetchResults(query).then();
        }, 500); // debounce 500ms

        return () => clearTimeout(delayDebounce);
    }, [query]);

    const fetchResults = async (searchText: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("places")
                .select("*")
                .ilike("title", `%${searchText}%`)
                .order("created_at", { ascending: false });

            if (error) console.error(error);

            if (data) setResults(data as Places);
        } catch (err: any) {
            console.log("Search error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-gray-50 p-4">
            {/* Search Input */}
            <TextInput
                className="bg-white rounded-full p-4 text-lg mb-4 shadow text-[#16a34a]"
                placeholder="Search places..."
                placeholderTextColor="#0f0"
                value={query}
                onChangeText={setQuery}
            />

            {loading && (
                <View className="mt-4">
                    <ActivityIndicator size="large" color="#22c55e" />
                </View>
            )}

            {!loading && results.length === 0 && query !== "" && (
                <View className="mt-6 items-center">
                    <Text className="text-gray-400 text-lg">No results found</Text>
                </View>
            )}

            <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }}
                renderItem={({ item }) => (
                    <LinearGradient
                        colors={SearchCardColor}
                        className="mb-4 rounded-3xl p-4 shadow-lg"
                    >
                        <TouchableOpacity onPress={ ():void => navigation.navigate('Trip',{id : item.id})}>
                            <Text className="text-white text-xl font-bold">{item.title}</Text>
                            <Text className="text-white mt-1">{item.city}, {item.country}</Text>
                            <Text className="text-white mt-1">{item.description}</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                )}
            />
        </View>
    );
};

export default Search;
