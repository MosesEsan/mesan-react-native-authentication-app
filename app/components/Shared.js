import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Icon, Badge} from 'react-native-elements';

//HEADER COMPONENT
export const Header = (props) => {
    let {title, style} = props;

    return (
        <View style={[styles.header, style]}>
            <Text style={styles.headerText}>
                {title}
            </Text>
        </View>
    )
};

Header.defaultProps = {
    title: "",
    style: {}
};

//ERROR COMPONENT
export const ErrorText = ({error}) => {
    return <Text style={styles.errorText}>{error}</Text>
};

ErrorText.defaultProps = {
    error: ""
};

const styles = StyleSheet.create({
    header: {
        height: 50,
        justifyContent: "center"
    },

    headerText: {
        fontSize: 25,
        color: "#362068",
        fontWeight: "400",
        fontFamily: "Helvetica Neue"
    },

    errorText:{
        marginBottom: 8,
        color:"red"
    }
});