import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootStack from "@/navigation/RootStack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from "./screens/Splash";
import { RootStackParamList } from "./navigation_types/rootstackparamlist";


const App: React.FC = (): React.JSX.Element => {
    const Stack = createNativeStackNavigator<RootStackParamList>();

    return (

        <NavigationContainer>

            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* First show splash */}
                <Stack.Screen name="Splash" component={Splash} />
                {/* Then RootStack decides which stack to show */}
                <Stack.Screen name="RootStack" component={RootStack} />
            </Stack.Navigator>

        </NavigationContainer>


    );
}


export default App;
