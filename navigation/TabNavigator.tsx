import {createBottomTabNavigator, BottomTabBar} from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeStack from '@/navigation/HomeStack';
import Profile from '@/screens/Profile';
import {bottomTabsColor} from "@/colors/bottomtabscolor";
import React from "react";
import {TabNavigatorParamList} from "@/navigation_types/tabnavigatorparamlist";
import TripStack from "@/navigation/TripStack";


const Tab = createBottomTabNavigator<TabNavigatorParamList>();

const TabNavigator:React.FC = (): React.JSX.Element => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,

                tabBarActiveTintColor: '#FFFFFF',
                tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',

                tabBarStyle: {
                    height: 72,
                    borderRadius: 24,
                    borderTopWidth: 0,
                    elevation: 0,
                    backgroundColor: 'transparent',
                },

                tabBarLabelStyle: {
                    fontSize: 14,
                    fontWeight: '700',
                    marginBottom: 8,
                },

                tabBarIconStyle: {
                    marginTop: 8,
                },
            }}
            tabBar={(props) => (
                <LinearGradient
                    colors={
                    bottomTabsColor
                    }
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={{
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                        right: 16,
                        height: 72,
                        borderRadius: 24,
                        overflow: 'hidden',
                    }}
                >
                    <BottomTabBar {...props} />
                </LinearGradient>
            )}
        >
            <Tab.Screen
                name="Home"
                component={HomeStack}
                options={{
                    tabBarIcon: ({color, size, focused}) => (
                        <Ionicons
                            name={focused ? 'home' : 'home-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />


            <Tab.Screen
                name="Explore"
                component={TripStack}
                options={{
                    tabBarIcon: ({color, size, focused}) => (
                        <Ionicons
                            name={focused ? 'compass' : 'compass-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({color, size, focused}) => (
                        <Ionicons
                            name={focused ? 'person' : 'person-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;
