import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import RootStack from "@/navigation/RootStack.tsx";


const App: React.FC = (): React.JSX.Element => {

    return (

        <NavigationContainer>

            <RootStack/>

        </NavigationContainer>


    );
}


export default App;
