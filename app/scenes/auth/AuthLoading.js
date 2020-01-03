import React, {useEffect} from 'react';
import {ActivityIndicator, View, Text} from 'react-native';
import { StackActions } from 'react-navigation';

import { useAuth } from "../../provider";

export default function AuthLoading(props) {
    const {navigate} = props.navigation;
    const { getAuthState } = useAuth();

    useEffect(() => {
        initialize()
    }, []);

    async function initialize() {
        try {
            const {user} = await getAuthState();

            if (user) {
                //check if username exist
                let username = !!(user.username);

                if (username) navigate('App');
                else navigate('Auth', {}, StackActions.replace({ routeName: "Username" }))

            } else navigate('Auth');
        } catch (e) {
            navigate('Auth');
        }
    }

    return (
        <View style={{backgroundColor: "#fff", alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <ActivityIndicator/>
            <Text>{"Loading User Data"}</Text>
        </View>
    );
};