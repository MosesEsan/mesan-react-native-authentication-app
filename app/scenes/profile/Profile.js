import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, View, StyleSheet, Alert} from 'react-native';

import {deleteEvent, getEvents} from "../../services/event";
import {useAuth} from "../../providers/auth";
import {useProfile} from "../../providers/profile";

import EventItem from "../../components/EventItem";
import UserPanel from "../../components/UserPanel";
import {Empty, FilterView, Footer, Placeholder, Header} from 'mesan-react-native-components'
import {showErrorAlert, showSuccessAlert} from "../../utils";

export default function Profile(props) {
    const {navigation} = props;
    const {navigate} = navigation;

    //1 - DECLARE VARIABLES
    const [filters, setFilters] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [filterVisible, setFilterVisible] = useState(false);
    const [isDeleting, setDeleting] = useState(false);

    const authObj = useAuth();
    const user = authObj.state.user;

    const {state, fetch, crud} = useProfile();
    let {isFetching, isRefreshing, error, data} = state;

    //==================================================================================================

    //2 - MAIN CODE BEGINS HERE
    useEffect(() => {
        navigation.setParams({onPress: () => setFilterVisible(true), badge: selectedFilters.length});
        getData()
    }, [filters]);

    //==================================================================================================

    //3 - GET DATA
    function getData(refresh = false, more = false) {
        let filters = {};

        //Apply any selected filter
        selectedFilters.map((filter) => {
            const {name, ...clone} = filter;
            filters = {...filters, ...clone};
        });

        //create params object
        let params = {
            page: more ? state.nextPage : 1,
            user: user['_id'],  //PASS THE USER ID
            limit: 5,
            group: false,
            sort_order: 'asc',
            ...filters
        };

        fetch(() => getEvents(params), refresh, more);
    }

    let onRefresh = () => getData(true);
    let onEndReached = () => (!state.isFetchingMore && state.nextPage) ? getData(false, true) : null;

    //==================================================================================================

    //4 - ON EDIT
    const onEditEvent = (event) => navigate('AddEditEvent', {event});

    //4b - ON DELETE
    async function onDeleteEvent(event) {
        setDeleting(true);

        try {
            await deleteEvent(event['_id']);

            showSuccessAlert("The Event has been deleted successfully.", 'Event Deleted');

            setDeleting(false);

            crud.delete(event);

        } catch (error) {
            showErrorAlert(error.message);
            setDeleting(false);
        }
    }

    //==================================================================================================

    //FLATLIST ITEMS RENDERING
    //4a - RENDER ITEM
    const renderItem = (props) => {
        let {item, index} = props;
        let onPress = () => navigate("MyEventDetails", {event: item});
        let onEdit = () => onEditEvent(item);
        let onDelete = () => onDeleteEvent(item);

        return <EventItem item={item} index={index} onPress={onPress} onEdit={onEdit} onDelete={onDelete}/>
    };

    //4b - RENDER EMPTY
    const renderEmpty = () => {
        let string = selectedFilters.map((filter) => filter.name);
        let message = selectedFilters.length > 0 ? `No events matches your filter(s):\n ${string.join(', ')}` : "There are no events available.";

        return <Empty message={message}/>
    };

    //4b - RENDER HEADER
    const renderHeader = () => {
        return (
            <View>
                <UserPanel/>
                <Header title={"My Events"} onPress={() => setFilterVisible(true)}
                        containerStyle={styles.headerContainer}
                        headerText={{}}
                        ctaText={"Filter"} ctaStyle={styles.cta} />
            </View>
        )
    };

    //4c - RENDER FOOTER
    const renderFooter = () => (
        <View>
            <FilterView
                modal={true}
                filters={filters_}
                onDone={onDoneFilter}
                visible={filterVisible}
                onCancel={() => setFilterVisible(false)}/>

            {(state.nextPage) ? <Footer/> : null}
        </View>
    );

    //==================================================================================================

    // 6 - FLATLIST PROPS
    const keyExtractor = (item, index) => `event_${item['_id'].toString()}${index.toString()}`;
    const refreshProps = {refreshing: isRefreshing, onRefresh};
    const loadMoreProps = {onEndReached, onEndReachedThreshold: 0};

    //==================================================================================================

    // 6b - FILTERS PROPS
    const filters_ = useMemo(() => {
        if (filters) return filters;
        else {
            //SORT BY FILTERS
            let sortByFilters = [
                {name: "Most Recent", sort_by: "createdAt", sort_order:'desc'},
                {name: "Oldest", sort_by: "createdAt", sort_order:'asc'},
                {name: "Name - A-Z", sort_by: "name", sort_order:'asc'},
                {name: "Name - Z-A", sort_by: "name", sort_order:'desc'}
            ];

            return [{title: "Sort By", options: sortByFilters}];
        }
    }, []);

    const onDoneFilter = useCallback(({filters, selected}) => {
        setFilters(selected.length > 0 ? filters : null);
        setSelectedFilters(selected);
        setFilterVisible(false);
    }, []);

    //==================================================================================================

    //7 - RENDER VIEW
    if (isFetching || error) return <Placeholder isFetching={isFetching} error={error} onRetry={getData}/>;

    return (
        <FlatList
            data={data}
            extraData={state}
            initialNumToRender={5}
            renderItem={renderItem}
            ListEmptyComponent={renderEmpty}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            style={{backgroundColor: "#ffffff"}}
            contentContainerStyle={{minHeight: '100%'}}
            keyExtractor={keyExtractor}
            {...loadMoreProps}
            {...refreshProps}/>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingTop: 8, paddingBottom: 8, paddingRight: 12, alignItems:'center',
         marginTop: 10
    },

    cta: {
        paddingVertical: 8, paddingHorizontal: 12, backgroundColor:"#ccc", borderRadius:15, color:"#fff"
    }
});