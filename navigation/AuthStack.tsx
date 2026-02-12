import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '@/screens/Login';
import Register from '@/screens/Register';
import {AuthStackParamList} from "@/navigation_types/authstackparamlist";



const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
    );
};

export default AuthStack;
