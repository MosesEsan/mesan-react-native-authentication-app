import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

//IMPORT ROUTES
import AuthStack from "./routes/auth";
import AuthLoading from "./scenes/auth/AuthLoading";
import AuthProvider from "./providers/auth";

import {EventProvider, AddEditEventStack, EventStack} from "./routes/event";

//APP ROUTES STACK
const MainStack = createSwitchNavigator(
    {
        Loading: AuthLoading,
        Auth: AuthStack,
        App: EventStack
    },
    {initialRouteName: 'Loading'}
);

const RootStack = createStackNavigator(
    {
        Main: {
            screen: MainStack,
        },
        AddEditEvent: {
            screen: AddEditEventStack,
        },
    },
    {
        mode: 'modal',
        headerMode: 'none'
    }
);
const Navigator = createAppContainer(RootStack);

export default function Router(props) {
    return (
        <AuthProvider>
            <EventProvider>
                <Navigator/>
            </EventProvider>
        </AuthProvider>
    );
}