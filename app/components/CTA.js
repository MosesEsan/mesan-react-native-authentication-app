import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

export default function CTA({title, ctaText, onPress, style, titleStyle, ctaStyle}){
    return (
        <View style={[styles.footer, style]}>
            {
                title &&
                <Text style={[styles.footerText, titleStyle, ctaText && {marginRight: 5}]}>
                    {title}
                </Text>
            }

            {
                ctaText &&
                <TouchableOpacity onPress={onPress}>
                    <Text style={[styles.footerCTA, ctaStyle]}>
                        {ctaText}
                    </Text>
                </TouchableOpacity>
            }
        </View>
    )
};

CTA.defaultProps = {
    title: null,
    ctaText: null,
    onPress:{},
    style: {},
    titleStyle: {},
    ctaStyle: {},
};

const styles = StyleSheet.create({
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    footerText: {
        fontSize: 16,
        fontFamily: "Helvetica Neue",
        color: "#636466"
    },

    footerCTA: {
        fontSize: 16,
        color: "#733AC2",
        fontWeight: "500",
        fontFamily: "Helvetica Neue"
    }
});