import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';

import ProfileProvider from "../providers/profile";

//IMPORT SCENES
import ProfileScreen from "../scenes/profile/Profile";
import UpdateProfileScreen from "../scenes/profile/UpdateProfile";

import {headerStyle, headerTitleStyle} from '../theme'

const ProfileStack = createStackNavigator(
    {
        Profile: ProfileScreen,
        UpdateProfile: UpdateProfileScreen,
    },
    {
        initialRouteName: 'Profile',
        defaultNavigationOptions: () => ({headerStyle, headerTitleStyle})
    }
);

export {ProfileProvider, ProfileStack}