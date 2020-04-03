import React from 'react';
import {View, TouchableHighlight, Text, Image, StyleSheet} from 'react-native';

import moment from "moment";

import {font} from "../theme"

export default function EventItem(props) {
    const {isFeatured} = props;

    if (isFeatured) return(
        <View style={[styles.featuredContainer, {}]}>
            <Component {...props} style={styles.innerContainer} imageStyle={{width: "100%", height: 140}}/>
        </View>
    );
    else return <Component {...props} style={styles.wrapper} imageStyle={styles.image}/>
}


export function Component(props) {
    const {item, onPress, style, imageStyle} = props;
    const {image, name, location, category_name, start_date, end_date} = item;

    let startTime = new Date(`${start_date}`);
    startTime = moment(startTime).format("ddd, MMM DD YYYY HH:mm");

    let endTime = (end_date !== undefined) ? end_date : null;
    if (endTime){
        endTime = new Date(`${end_date}`);
        endTime = moment(endTime).format("HH:mm");
    }
    return (
        <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" style={{flex: 1}} onPress={onPress}>
            <View style={style}>
                <Image style={imageStyle} resizeMode="cover" source={(image) ? {uri: image} : ""}/>
                <View style={[styles.eventInfo, props.isFeatured ? {padding: 8} : {marginLeft: 8}]}>
                    <Text style={styles.time}>{startTime}{(endTime !== null) && " - " + endTime}</Text>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.location}>{location }</Text>
                    <Text style={styles.category}>{category_name}</Text>
                </View>
            </View>
        </TouchableHighlight>
    );
}

EventItem.defaultProps = {
    item: null,
    onPress: null,
    isFeatured: false
};

const styles = StyleSheet.create({
    featuredContainer: {
        borderRadius: 8,
        backgroundColor: "#fff",
        shadowColor: "#c2c4cb",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.81,
        shadowRadius: 5.16,
        elevation: 20,
        height: 255
    },

    wrapper: {
        flex: 1,
        padding: 8* 2,
        backgroundColor: "#FFF",
        flexDirection: "row",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor:"#ccc",
    },

    innerContainer: {
        flex: 1,
        backgroundColor: "#FFF",
        borderRadius: 8,
        overflow:"hidden"
    },

    eventInfo:{
        flex:1
    },


    image: {
        borderRadius:8,
        width: 90,
        height: 90,
        marginRight: 8,
        backgroundColor: "#ccc"
    },

    time: {
        color: "#6962A1",
        fontFamily: font,
        fontWeight: "500",
        fontSize: 14,
        lineHeight: 21,
        marginBottom: 4
    },

    name:{
        color: "#262744",
        fontFamily: font,
        fontWeight: "600",
        fontSize: 16,
        marginBottom: 4
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
    }
});