import React from 'react';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {HomeStackParamList} from "@/navigation_types/homestackparamlist";
import Home from "@/screens/Home";
import Profile from "@/screens/Profile";
import NewTrip from "@/screens/NewTrip";
import SpecificTrip from "@/screens/SpecificTrip";
import Map from "@/screens/Map";


const HomeStack:React.FC = ():React.JSX.Element => {
    const Stack = createNativeStackNavigator<HomeStackParamList>();
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="HomeMain" component={Home} />
            <Stack.Screen name='Profile' component={Profile}/>
            <Stack.Screen name='NewTrip' component={NewTrip}/>
            <Stack.Screen name = 'Trip' component={SpecificTrip}/>
            <Stack.Screen name='Map' component={Map}/>
        </Stack.Navigator>
    );
};

export default HomeStack;
