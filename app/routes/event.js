import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';

import EventProvider from "../providers/event";

//IMPORT SCENES
import EventListScreen from "../scenes/event/EventList";
import EventDetailsScreen from "../scenes/event/EventDetails";
import AddEditEventScreen from "../scenes/event/AddEditEvent";
import SearchScreen from "../scenes/event/Search";


import {headerStyle, headerTitleStyle} from "../theme";

const EventStack = createStackNavigator(
    {
        EventList: EventListScreen,
        EventDetails: EventDetailsScreen,
        Search: SearchScreen,
    },
    {
        initialRouteName: 'EventList',
        defaultNavigationOptions: () => ({headerStyle, headerTitleStyle: [headerTitleStyle, {fontSize: 24}], headerTitleAlign: 'left'})
    }
);
const AddEditEventStack = createStackNavigator(
    {
        AddEditEvent: {
            screen: AddEditEventScreen,
        }
    }
);
export {EventProvider, EventStack, AddEditEventStack, SearchScreen}