import React  from 'react';
import {Alert} from "react-native";

export const showErrorAlert = (message = "") => showAlert("error", message);
export const showSuccessAlert = (message = "", title, onPress) => showAlert(null, message, title, onPress);

function showAlert(type, message = "", title = "Action Completed Successfully", onPress=null){
    let options = [{text: 'OK', onPress}];

    if (type === "error") title = "Something Went Wrong!";

    Alert.alert(title, message, options, {cancelable: false});
}
