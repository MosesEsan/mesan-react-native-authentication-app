import React, { useState } from 'react';

import * as api from "../../services/auth";
import { useAuth } from "../../providers/auth";

import Form from 'react-native-basic-form';

export default function UpdateProfile (props) {
    const {navigation} = props;

    //1 - DECLARE VARIABLES
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { state, updateUser } = useAuth();
    const user = state.user;

    //==================================================================================================

    //2 - ON SUBMIT
    async function onSubmit(data) {
        setLoading(true);

        try {
            let response = await api.updateProfile(state.user['_id'], data);
            updateUser(response.user);

            setLoading(false);

            navigation.goBack();
        } catch (error) {
            setError(error.message);
            setLoading(false)
        }
    }

    //==================================================================================================

    // 3 - FORM PROPS
    //Form fields
    const fields = [
        {name: 'firstName', label: 'First Name', required: true},
        {name: 'lastName', label: 'Last Name', required: true},
        {name: 'username', label: 'Username', required: true}
    ];

    //==================================================================================================

    //7 - RENDER
    return (
        <Form
            fields={fields}
            initialData={user}
            loading={loading}
            title={'Submit'}
            error={error}
            onSubmit={onSubmit}
            buttonStyle={{backgroundColor: "#5070FE"}}
            style={{backgroundColor: "white", paddingHorizontal: 16}}/>
    );
};

UpdateProfile.navigationOptions = ({}) => {
    return {
        title: `Update Profile`
    }
};