import React, {useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { NavigationContext } from 'react-navigation';

import {Button} from 'react-native-elements';

import * as Permissions from "expo-permissions/build/Permissions";
import * as ImagePicker from "expo-image-picker/build/ImagePicker";
import {Image} from 'react-native-basic-form';

import {updateProfile} from "../services/auth";
import {useAuth} from "../providers/auth"

import {font} from "../theme"
import { showSuccessAlert, showErrorAlert} from "../utils";

export default function UserPanel(props) {
    const navigation = useContext(NavigationContext);
    const {navigate} = navigation;

    //1 - DECLARE VARIABLES
    const {state, handleLogout, updateUser } = useAuth();
    const user = state.user;

    //==================================================================================================

    //2 - ON UPDATE PROFILE
    const onUpdate = () => {
        navigate('UpdateProfile')
    };

    //3 - ON LOGOUT
    const onLogOut = () => {
        handleLogout();
        navigate('Auth');
    };

    //==================================================================================================

    //4 - PROFILE IMAGE FUNCTION
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

    async function onImageSelected(data) {
        // setLoading(true);

        try {
            let response = await updateProfile(user._id, {profileImage:data});
            updateUser(response.user);

            // setLoading(false);

            showSuccessAlert(response.message, 'Profile Image Updated');
        } catch (error) {
            showErrorAlert(error.message);
            // setLoading(false)
        }
    }

    //==================================================================================================

    //5 - RENDER VIEW
    return (
        <View style={styles.container}>
            <Image
                image={user.hasOwnProperty('profileImage')  ? user.profileImage : null }
                size={100}
                borderWidth={0}
                getPermission={null}
                showImagePicker={showImagePicker}
                onImageSelected={onImageSelected}
                containerStyle={styles.imageContainer}/>

            <View style={styles.info}>

                <Text style={styles.name}>{`${user.firstName} ${user.lastName}`}</Text>
                <Text style={styles.username}>{`${user.username}`}</Text>

                <View style={styles.buttonsContainer}>

                    <Button title={"Update Profile"} onPress={onUpdate}
                            containerStyle={styles.buttonContainer}
                            buttonStyle={[styles.button]}
                            titleStyle={styles.buttonText}/>

                    <Button title={"Log Out"} onPress={onLogOut}
                            containerStyle={styles.buttonContainer}
                            buttonStyle={[styles.button]}
                            titleStyle={styles.buttonText}/>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1, marginRight:2, paddingHorizontal:16, paddingVertical:8,
        flexDirection:"row"
    },

    imageContainer:{
        width: 90,
        height: 90,
        marginRight: 16,
        flex:0
    },

    image: {
        borderRadius:8,
        width: 90,
        height: 90,
        backgroundColor: "#ccc"
    },

    name:{
        color: "#262744",
        fontFamily: font,
        fontWeight: "600",
        fontSize: 16,
        marginBottom: 2
    },

    username: {
        fontSize: 14,
        lineHeight: 21,
        fontFamily: font,
        fontWeight: "400",
        color: "#9f9ea0",
    },

    buttonsContainer:{
        flexDirection:"row",
        marginTop: 6
    },

    buttonContainer: {
        marginRight: 8
    },

    button: {
        height: 33,
        backgroundColor: "#733AC2"
    },

    buttonText: {
        fontSize: 13,
        color: "#fff",
        fontFamily: font,
        fontWeight: "500"
    }
});