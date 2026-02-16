import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from '@/supabase/SupabaseClient';

import AuthStack from './AuthStack';
import TabNavigator from './TabNavigator';
import {RootStackParamList} from "@/navigation_types/rootstackparamlist";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
        });

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
            }
        );

        return () => listener.subscription.unsubscribe();
    }, []);

  

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {session ? (
                <Stack.Screen name="AppTabs" component={TabNavigator} />
            ) : (
                <Stack.Screen name="Auth" component={AuthStack} />
            )}
        </Stack.Navigator>
    );
};

export default RootStack;
