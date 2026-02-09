import React from "react";
import TabNavigator from "@/navigation/TabNavigator";
import {NavigationContainer} from "@react-navigation/native";


const App: React.FC = (): React.JSX.Element => {

    return (

        <NavigationContainer>

            <TabNavigator/>

        </NavigationContainer>


    );
}


export default App;
