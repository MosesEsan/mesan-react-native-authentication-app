import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';

import EventProvider from "../providers/event";

//IMPORT SCENES
import EventListScreen from "../scenes/event/EventList";
import EventDetailsScreen from "../scenes/event/EventDetails";
import AddEditEventScreen from "../scenes/event/AddEditEvent";


const EventStack = createStackNavigator(
    {
        EventList: {
            screen: EventListScreen,
        },
        EventDetails: {
            screen: EventDetailsScreen,
        }
    }
);
const AddEditEventStack = createStackNavigator(
    {
        AddEditEvent: {
            screen: AddEditEventScreen,
        }
    }
);
export {EventProvider, EventStack, AddEditEventStack}