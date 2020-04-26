import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';

import {Icon} from 'react-native-elements';

//IMPORT ROUTES
import AuthStack from "./routes/auth";
import AuthLoading from "./scenes/auth/AuthLoading";
import AuthProvider from "./providers/auth";

import {ProfileProvider, ProfileStack} from "./routes/profile";
import {AddEditEventStack, EventProvider, EventStack} from "./routes/event";

const TabNavigator = createBottomTabNavigator(
    {
        Event: EventStack,
        Profile: ProfileStack
    },
    {
        defaultNavigationOptions: ({navigation}) => ({
            tabBarIcon: ({focused, horizontal, tintColor}) => {
                const {routeName} = navigation.state;
                let iconName, iconType = 'ionicon';
                if (routeName === 'Event') {
                    iconName = `md-list-box`;
                } else if (routeName === 'Profile') {
                    iconName = `cart-plus`;
                    iconType = `material-community`;
                }

                return <Icon type={iconType} name={iconName} size={22} color={tintColor}/>
            }
        }),

        tabBarOptions: {
            activeTintColor: "#0a163d",
            inactiveTintColor: 'gray',
        },
    });


//MAIN STACK
const MainStack = createSwitchNavigator(
    {
        Loading: AuthLoading,
        Auth: AuthStack,
        App: TabNavigator
    },
    {initialRouteName: 'Loading'}
);

//ROOT STACK
const RootStack = createStackNavigator(
    {
        Main: MainStack,
        AddEditEvent: AddEditEventStack,
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
                <ProfileProvider>
                    <Navigator/>
                </ProfileProvider>
            </EventProvider>
        </AuthProvider>
    );
}