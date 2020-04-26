import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, Image, StyleSheet, Text, View} from 'react-native';

import moment from "moment";
import {Icon} from 'react-native-elements';
import ParallaxScrollView from 'react-native-parallax-scroll-view';

import {useEvent} from "../../providers/event";
import {getEvent} from "../../services/event";

import {Placeholder} from 'mesan-react-native-components'

import {font} from "../../theme";
import {showErrorAlert} from "../../utils";

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

    const {state, crud, getStateData} = useEvent();
    const {data} = state;

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
        else if (event) setEvent(event);
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

    // 6 - FLATLIST PROPS
    const refreshProps = {refreshing: isRefreshing, onRefresh};

    //==================================================================================================

    // 6b - FILTERS PROPS
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

    //7 - RENDER VIEW
    if (isFetching) return <Placeholder isFetching={isFetching}/>;

    return (
        <ParallaxScrollView
            backgroundColor="#ccc"
            contentBackgroundColor="#fff"
            parallaxHeaderHeight={300}
            showsVerticalScrollIndicator={false}
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

EventDetails.navigationOptions = ({}) =>  ({title: null});

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