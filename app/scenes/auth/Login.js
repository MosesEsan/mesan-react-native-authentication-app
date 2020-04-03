import React, { useState } from 'react';
import {View} from 'react-native';

import * as api from "../../services/auth";
import { useAuth } from "../../providers/auth";

import Form from 'react-native-basic-form';
import CTA from "../../components/CTA";
import {Header, ErrorText} from "../../components/Shared";

export default function Login(props) {
    const {navigation} = props;
    const {navigate} = navigation;

    //1 - DECLARE VARIABLES
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { handleLogin } = useAuth();

    const fields = [
        {name: 'email', label: 'Email Address', required: true},
        {name: 'password', label: 'Password', required: true, secure: true}
    ];

    async function onSubmit(state) {
        setLoading(true);

        try {
            let response = await api.login(state);
            await handleLogin(response);

            setLoading(false);

            //check if username is null
            let username = (response.user.username !== null);
            if (username) navigate('App');
            else navigation.replace('Username');
        } catch (error) {
            setError(error.message);
            setLoading(false)
        }
    }

    let formProps = {title: "Login", fields, onSubmit, loading};
    return (
        <View style={{flex: 1, paddingHorizontal: 16, backgroundColor:"#fff"}}>
            <Header title={"Login"}/>
            <View style={{flex: 1}}>
                <ErrorText error={error}/>
                <Form {...formProps}>
                    <CTA
                        ctaText={"Forgot Password?"}
                        onPress={() => navigation.navigate("ForgotPassword")}
                        style={{marginTop: 20}}/>

                    <CTA
                        title={"Don't have an account?"}
                        ctaText={"Register"}
                        onPress={() => navigation.replace("Register")}
                        style={{marginTop: 50}}/>
                </Form>
            </View>
        </View>
    );
};

Login.navigationOptions = ({}) => {
    return {
        title: ``
    }
};