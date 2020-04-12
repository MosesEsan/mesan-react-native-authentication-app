import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, Image, StyleSheet, Text, View} from 'react-native';

import moment from "moment";
import {Icon} from 'react-native-elements';
import ParallaxScrollView from 'react-native-parallax-scroll-view';

import {useEvent} from "../../providers/event";
import {useAuth} from "../../providers/auth";
import {deleteEvent, getEvent} from "../../services/event";

import {NavIcon, Placeholder} from 'mesan-react-native-components'

import {font} from "../../theme";
import {showErrorAlert, showSuccessAlert} from "../../utils";

const EventInfo = ({icon, title, subtitle}) => {
    return (
        <View style={styles.dateContainer}>
            <Icon {...icon}/>
            <View style={styles.dateTime}>
                <Text style={styles.date}>{title}</Text>
                {subtitle !== null && <Text style={styles.time}>{subtitle}</Text>}
            </View>
        </View>
    )
};

EventInfo.defaultProps = {
    subtitle: null
};

export default function EventDetails(props) {
    const {navigation} = props;
    const {navigate} = navigation;

    //1 - DECLARE VARIABLES
    const [event, setEvent] = useState(null);

    const [isFetching, setIsFetching] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [IsDeleting, setDeleting] = useState(false);

    const {state, crud, getStateData} = useEvent();
    const {data} = state;

    //access user data
    const auth = useAuth();
    const user = auth['state']['user'];

    //==================================================================================================

    //2 - MAIN CODE BEGINS HERE
    useEffect(() => getData(), [data]);

    //==================================================================================================

    //3 - GET DATA
    function getData() {
        setIsFetching(true);

        let event_ = navigation.getParam('event');
        let event = getStateData(event_['_id']);

        setIsFetching(false);

        if (!event) navigation.goBack();
        else if (event) {
            setEvent(event);

            if (event.userId === user._id){
                let navProps = {
                    onEdit: () => onEditEvent(event),
                    onDelete: () => onDelete(event),
                    IsDeleting
                };
                navigation.setParams(navProps);
            }
        }
    }

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            let response = await getEvent(event['_id']);

            crud.update(response.event);

            setIsRefreshing(false);
        } catch (error) {
            setIsRefreshing(false);
            showErrorAlert(error.message);
        }
    }, [isRefreshing]);

    //==================================================================================================

    //4 - ON EDIT
    const onEditEvent = (event) => navigate('AddEditEvent', {event});

    //4b - ON DELETE
    async function onDelete(event) {
        Alert.alert(
            'Delete Event',
            "Are you sure you want to delete this event?",
            [
                {text: 'Delete', onPress: () => onDeleteEvent(event)},
                {text: 'Cancel', style: 'cancel'}
            ],
            {cancelable: true},
        );
    }

    //4c - ON DELETE PRODUCT
    async function onDeleteEvent(event) {
        setDeleting(true);

        try {
            await deleteEvent(event['_id']);

            showSuccessAlert("The Event has been deleted successfully.", 'Event Deleted');

            setDeleting(false);

            crud.delete(event);

        } catch (error) {
            showErrorAlert(error.message);
            setDeleting(false);
        }
    }

    //==================================================================================================

    // 5 - PROPS
    const refreshProps = {refreshing: isRefreshing, onRefresh};

    const date = useMemo(() => {
        if (event) {
            const {start_date, end_date} = event;

            let startDate = new Date(`${start_date}`);
            let startDateFormatted = moment(startDate).format("ddd, MMM DD YYYY");
            let startTimeFormatted = moment(startDate).format("h:mm A");

            if (end_date !== undefined) {
                let endDate = new Date(`${end_date}`);
                startDate = moment(startDate).format("ddd, MMM DD YYYY");
                endDate = moment(endDate).format("ddd, MMM DD YYYY");

                let isSame = moment(startDate).isSame(endDate);
                let endTime = moment(endDate).format(isSame ? "h:mm A" : "ddd, MMM DD h:mm A");

                startTimeFormatted = `${startTimeFormatted} - ${endTime}`
            }

            return {startDate: startDateFormatted, startTime: startTimeFormatted}
        }

        return null;
    }, [event]);

    //==================================================================================================

    //6 - RENDER
    if (isFetching) return <Placeholder isFetching={isFetching}/>;

    return (
        <ParallaxScrollView
            backgroundColor="#ccc"
            contentBackgroundColor="#fff"
            parallaxHeaderHeight={300}
            {...refreshProps}
            renderBackground={() => <Image source={{uri: event.image, width: window.width, height: 350}}/>}>
            <View style={styles.wrapper}>
                <Text style={styles.name}>{event.name}</Text>
                <EventInfo icon={{type: 'font-awesome', name: 'calendar', size: 20, color: '#bab9bb'}}
                           title={date.startDate} subtitle={date.startTime}/>
                <EventInfo icon={{type: 'font-awesome', name: 'location-arrow', size: 20, color: '#bab9bb'}}
                           title={event['location']}/>
                {
                    event['category_name'] &&
                    <EventInfo icon={{type: 'font-awesome', name: 'tag', size: 20, color: '#bab9bb'}}
                               title={event['category_name']}/>
                }
                <Text style={styles.description}>{event.description}</Text>
            </View>
        </ParallaxScrollView>
    )
};

EventDetails.navigationOptions = ({navigation}) => {
    let onEdit = navigation.getParam('onEdit') || null;
    let onDelete = navigation.getParam('onDelete') || null;

    return {
        title: null,
        headerRight: () => (
            <View style={{flexDirection: "row"}}>
                {onEdit && <NavIcon type={"entypo"} name={"edit"} onPress={onEdit} color={'#666'}/>}
                {onEdit && <NavIcon type={"material-community"} name={"delete"} onPress={onDelete} color={'#666'}/>}
            </View>
        )
    };
};

//STYLES
const styles = StyleSheet.create({
    wrapper: {
        padding: 8 * 2
    },

    name: {
        color: "#262744",
        fontFamily: font,
        fontWeight: "600",
        fontSize: 22,
        marginBottom: 20
    },

    dateContainer: {
        flexDirection: "row",
        marginBottom: 14
    },

    dateTime: {
        marginLeft: 12
    },

    date: {
        color: "#262744",
        fontFamily: font,
        fontWeight: "500",
        fontSize: 16,
        lineHeight: 18
    },

    time: {
        color: "#9f9ea0",
        fontFamily: font,
        fontWeight: "500",
        fontSize: 14,
        lineHeight: 21
    },

    location: {
        fontSize: 14,
        lineHeight: 21,
        fontFamily: font,
        fontWeight: "500",
        color: "#262744",
        marginBottom: 4
    },

    category: {
        fontSize: 14,
        lineHeight: 21,
        fontFamily: font,
        fontWeight: "400",
        color: "#9f9ea0",
    },

    description: {
        color: "#262744",
        fontFamily: font,
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 24,
        marginVertical: 10
    }
});