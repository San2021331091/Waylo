import React from 'react';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {HomeStackParamList} from "@/navigation_types/homestackparamlist";
import Home from "@/screens/Home";
import Profile from "@/screens/Profile";
import SpecificTrip from "@/screens/SpecificTrip";
import Map from "@/screens/Map";
import Explore from "@/screens/Explore";
import Search from "@/screens/Search";



const HomeStack:React.FC = ():React.JSX.Element => {
    const Stack = createNativeStackNavigator<HomeStackParamList>();
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="HomeMain" component={Home} />
            <Stack.Screen name='Profile' component={Profile}/>
            <Stack.Screen name ='Trip' component={SpecificTrip}/>
            <Stack.Screen name='Explore' component={Explore}/>
            <Stack.Screen name='Map' component={Map}/>
            <Stack.Screen name='Search' component={Search}/>
        </Stack.Navigator>
    );
};

export default HomeStack;
