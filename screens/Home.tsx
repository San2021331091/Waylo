import React from 'react';
import { ScrollView, View, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from "@react-navigation/core";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {HomeStackParamList} from "@/navigation_types/homestackparamlist";
import ImageBanner from "@/ui-components/ImageBanner";
import FeaturedPlaces from "@/ui-components/FeaturedPlaces";
import WeekendTips from "@/ui-components/WeekendTips";
import PopularDestinations from "@/ui-components/PopularDestinations";


const Home: React.FC = (): React.JSX.Element => {

const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ paddingBottom: 60, paddingRight: 10 }}>

                <View className="flex-row justify-between items-center p-2">

                    {/* Image */}
                    <Image
                        source={{ uri: 'https://i.postimg.cc/fWp84wSm/waylo.png' }}
                        className="w-52 h-52"
                        resizeMode="contain"
                    />

                    {/* Search Button */}
                    <TouchableOpacity className="p-3 bg-green-500 rounded-full">
                        <Ionicons name="search-outline" size={20} color="#fff" className='font-bold' />
                    </TouchableOpacity>

                    {/* Profile Icon Button */}
                    <TouchableOpacity
                        className="p-3 bg-green-600 rounded-full"
                        onPress={ ():void => navigation.navigate('Profile')

                    }
                    >
                        <Ionicons name="person-circle-outline" size={28} color="#fff" />
                    </TouchableOpacity>

                </View>

                <View className='border-b border-gray-200 mx-4'>

                 <ImageBanner/>

                </View>
                <View className='mt-3'>
                    <FeaturedPlaces/>
                </View>

                <View className='mt-2'>
                    <WeekendTips/>
                </View>

                <View className='mt-2'>
                    <PopularDestinations/>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;
