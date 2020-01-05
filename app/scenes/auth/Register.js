import React, { useState } from 'react';
import {Alert, View} from 'react-native';

import * as api from "../../services/auth";

import Form from 'react-native-basic-form';
import CTA from "../../components/CTA";
import {Header, ErrorText} from "../../components/Shared";

export default function Register(props) {
    const {navigation} = props;

    //1 - DECLARE VARIABLES
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fields = [
        {name: 'firstName', label: 'First Name', required: true},
        {name: 'lastName', label: 'Last Name', required: true},
        {name: 'email', label: 'Email Address', required: true},
        {name: 'password', label: 'Password', required: true, secure:true}
    ];

    async function onSubmit(state) {
        setLoading(true);

        try {
            let response = await api.register(state);
            setLoading(false);
            Alert.alert(
                'Registration Successful',
                response.message,
                [{text: 'OK', onPress: () => navigation.replace("Login")}],
                {cancelable: false},
            );
        } catch (error) {
            setError(error.message);
            setLoading(false)
        }
    }

    let formProps = {title: "Register", fields, onSubmit, loading };
    return (
        <View style={{flex: 1, paddingHorizontal: 16, backgroundColor:"#fff"}}>
            <Header title={"Register"}/>
            <View style={{flex:1}}>
                <ErrorText error={error}/>
                <Form {...formProps}>
                    <CTA
                        title={"Already have an account?"}
                        ctaText={"Login"}
                        onPress={() => navigation.replace("Login")}
                        style={{marginTop: 50}}/>
                </Form>
            </View>
        </View>
    );
};

Register.navigationOptions = ({}) => {
    return {
        title: ``
    }
};