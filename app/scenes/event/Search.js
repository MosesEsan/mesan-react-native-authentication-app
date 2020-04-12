import React, {useState} from 'react';
import {ActivityIndicator, Dimensions, FlatList, Platform, StyleSheet, Text, View} from 'react-native';

import axios from 'axios';
import {SearchBar} from 'react-native-elements';

import {search} from "../../services/event";

import EventItem from "../../components/EventItem";
import {Empty} from 'mesan-react-native-components'


import { showErrorAlert} from "../../utils";
import EventDetails from "./EventDetails";
//VARIABLES
const SCREEN_HEIGHT = Dimensions.get('window').height;
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const STATUS_BAR_HEIGHT = Platform.select({ios: IS_IPHONE_X ? 44 : 20, android: 24});

export default function Search(props) {
    const {navigation} = props;
    const {navigate} = navigation;

    //1 - DECLARE VARIABLES
    const [cancelToken, setCancelToken] = useState('');
    const [result, setResult] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    //==================================================================================================

    //2 - HANDLE QUERY CHANGE
    const handleQueryChange = text => {
        setSearchText(text);
        executeSearch(text);
    };

    //==================================================================================================

    //3 - EXECUTE SEARCH
    async function executeSearch(text) {
        if (text.length > 0) {
            setIsSearching(true);

            // Cancel the previous request before making a new request
            if (cancelToken) cancelToken.cancel('Operation canceled by the user.');

            // Create a new CancelToken
            let cancelToken_ = axios.CancelToken.source();
            setCancelToken(cancelToken_);

            try {
                let response = await search(text, cancelToken_);
                setResult(response.events);
                setIsSearching(false)
            } catch (error) {
                if (!error.isCancel) showErrorAlert(error.message);
                setIsSearching(false)
            }
        } else {
            setResult([]);
            setIsSearching(false);
        }
    }

    //==================================================================================================

    //FLATLIST ITEMS RENDERING
    //4 - RENDER ITEM
    const renderItem = ({item, index}) => {
        let onPress = () => navigate("EventDetails", {event: item});

        return <EventItem item={item} index={index} onPress={onPress}/>
    };

    //4b - RENDER EMPTY
    const renderEmpty = () => {
        if (searchText.length > 0) return (<Empty message={`No matches found for your search: ${searchText}`}/>);
        else return null;
    };

    //==================================================================================================

    // 6 - FLATLIST PROPS
    const keyExtractor = (item, index) => `search_${item._id.toString()}${index.toString()}`;
    // const loadMoreProps = {onEndReached, onEndReachedThreshold: 0, ListFooterComponent: renderFooter};

    //==================================================================================================

    //5 - RENDER
    return (
        <View style={{backgroundColor: "#ffff", flex: 1,}}>
            <View style={{borderBottomColor: '#a7a7aa', borderBottomWidth: StyleSheet.hairlineWidth}}>
                <View style={{height: STATUS_BAR_HEIGHT}}/>
                <SearchBar
                    containerStyle={{backgroundColor: "#ffffff", paddingTop: 4, paddingBottom: 4}}
                    inputContainerStyle={{backgroundColor: "#eee"}}
                    placeholder="Type Here..."
                    onChangeText={handleQueryChange}
                    value={searchText}
                    showCancel={true}
                    onCancel={() => props.navigation.goBack()}
                    autoFocus={true}
                    platform={Platform.OS}/>
            </View>
            <View style={{flex: 1}}>
                {
                    (isSearching) ?
                        <ActivityIndicator style={{paddingVertical: 8}}/>
                        :
                        <FlatList
                            style={{backgroundColor: "#ffffff"}}
                            data={result}
                            initialNumToRender={5}
                            renderItem={renderItem}
                            ListEmptyComponent={renderEmpty}
                            keyExtractor={keyExtractor}/>
                }
            </View>
        </View>
    )
};

Search.navigationOptions = props => ({
    headerShown: false
});