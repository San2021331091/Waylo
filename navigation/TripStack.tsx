import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Explore from "@/screens/Explore";
import SpecificTrip from "@/screens/SpecificTrip";
import { TripStackParamList } from "@/navigation_types/tripstackparamlist";
import Map from "@/screens/Map";
const Stack = createNativeStackNavigator<TripStackParamList>();

const TripStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ExploreList" component={Explore} />
            <Stack.Screen name="Trip" component={SpecificTrip} />
            <Stack.Screen name='Map' component={Map}/>
        </Stack.Navigator>
    );
};

export default TripStack;
