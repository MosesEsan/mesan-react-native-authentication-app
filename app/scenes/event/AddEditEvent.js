import React, {useEffect, useMemo, useState} from 'react';
import {Button} from "react-native";

import * as Permissions from "expo-permissions/build/Permissions";
import * as ImagePicker from "expo-image-picker/build/ImagePicker";
import Form, {TYPES} from 'react-native-basic-form';

import {useEvent} from "../../providers/event";
import {createUpdateEvent, getCategories} from "../../services/event";

import {Placeholder} from 'mesan-react-native-components'

import { showSuccessAlert, showErrorAlert} from "../../utils";

export default function AddEditEvent(props) {
    const {navigation} = props;
    const event = navigation.getParam('event') || null;

    //1 - DECLARE VARIABLES
    const {crud, categoryObj} = useEvent();
    let {state, fetch} = categoryObj;
    let {isFetching, error, data} = state;

    const [loading, setLoading] = useState(false);

    //==================================================================================================

    //2 - MAIN CODE BEGINS HERE
    useEffect(() => {
        navigation.setParams({title: (!event) ? "Add Event" :  "Edit Event"});
        getData()
    }, []);

    //==================================================================================================

    //3 - GET DATA
    function getData() {
        let params = {limit: 10, group: false, sort_order: 'asc'};
        fetch(() => getCategories(params));
    }

    //==================================================================================================

    //4 - ON SUBMIT
    async function onSubmit(data) {
        setLoading(true);

        //convert the date to string
        data['start_date'] = data.start_date.toString();

        if(data.end_date && data.end_date == null || data.end_date === 'undefined') delete data['end_date'];
        else data['end_date'] = data.end_date.toString();

        try {
            let title = !event ? "Event Added Successfully." : "Event Updated Successfully.";
            let storeHandler = !event ? crud['add'] : crud['update'];
            let response = await createUpdateEvent(data, (event) ? event._id : null);

            storeHandler(response.event);
            setLoading(false);

            showSuccessAlert(response.message, title, () => navigation.pop());

        } catch (error) {
            showErrorAlert(error.message);
            setLoading(false)
        }
    }

    //==================================================================================================

    //5 - SHOW IMAGE FUNCTION
    async function showImagePicker() {
        const options =  {allowsEditing: true, aspect: [4, 3]};
        try{
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            const isGranted = status === 'granted';

            if (isGranted) {
                let ImagePicker_ =  ImagePicker.launchImageLibraryAsync;
                let response = await ImagePicker_(options);

                if (response.cancelled) return({cancelled: true});
                else return(response);

            } else {
                return({error: "Permission not granted"});
            }
        }catch(e){
            return({error: e});
        }
    }

    //==================================================================================================

    // 6 - FORM PROPS
    //Dropdown Options
    const options = useMemo(() => {
        return data.map((item, idx) => ({label: item.name, value: item._id}));
    }, [data]);

    //Form fields
    const fields = useMemo(() => {
        let fields_ = [
            {name: 'image', required: false, type: TYPES.Image},
            {name: 'name', label: 'EVENT NAME', required: true},
            {name: 'category', label: 'CATEGORY', required: true, type: TYPES.Dropdown, options},
            {name: 'location', label: 'VENUE', required: true},
            {name: 'description', label: 'DESCRIPTION', required: true, multiline: true},
            [
                {name: 'start_date', label: 'START DATE', required: true, type: TYPES.Date},
                {name: 'end_date', label: 'END DATE', required: true, type: TYPES.Date}
            ]
        ];

        //Check if an event was passed- this means we are in edit mode
        if (event){
            fields_.map((field, idx) => {
                let arr = Array.isArray(field);
                if (!arr) field['value'] = String(event[field.name]) || "";
                else if (arr) field.map((fld, index) => fld['value'] = String(event[fld.name]) || "")
            });
        }

        return fields_;
    }, [data]);

    //==================================================================================================

    //7 - RENDER
    if (isFetching || error) return <Placeholder isFetching={isFetching} error={error} onRetry={getData}/>

    return (
        <Form
            fields={fields}
            loading={loading}
            title={!event ? 'Create Event' : 'Update Event'}
            error={error}
            onSubmit={onSubmit}
            showImagePicker={showImagePicker}
            buttonStyle={{backgroundColor: "#5070FE"}}
            style={{backgroundColor: "white", paddingHorizontal: 16}}/>
    );
};

AddEditEvent.navigationOptions = ({navigation}) => {
    let title = navigation.getParam('title');
    return {
        title,
        headerLeft: () => <Button onPress={() => navigation.pop()} title="Cancel" color={"#666"}/>
    }
};