import React, { useState } from 'react';
import {Alert, View} from 'react-native';

import * as api from "../../services/auth";

import Form from 'react-native-basic-form';
import {Header, ErrorText} from "../../components/Shared";

export default function ForgotPassword(props) {
    const {navigation} = props;

    //1 - DECLARE VARIABLES
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fields = [{name: 'email', label: 'Email Address', required: true}];

    async function onSubmit(state) {
        setLoading(true);

        try {
            let response = await api.forgotPassword(state);
            setLoading(false);

            Alert.alert(
                'Recover Password',
                response.message,
                [{text: 'OK', onPress: () => navigation.goBack()}],
                {cancelable: false},
            );
        } catch (error) {
            setError(error.message);
            setLoading(false)
        }
    }

    let formProps = {title: "Submit", fields, onSubmit, loading };
    return (
        <View style={{flex: 1, paddingHorizontal: 16, backgroundColor:"#fff"}}>
            <Header title={"Recover Password"}/>
            <View style={{flex:1}}>
                <ErrorText error={error}/>
                <Form {...formProps}/>
            </View>
        </View>
    );
};

ForgotPassword.navigationOptions = ({}) => {
    return {
        title: ``
    }
};