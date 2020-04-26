import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, View, Dimensions} from 'react-native';

import moment from "moment";

import {getEvents} from "../../services/event";
import {useEvent} from "../../providers/event";

import EventItem from "../../components/EventItem";
import {Empty, Footer, NavIcon, Placeholder, FilterView, Panel} from 'mesan-react-native-components'

import {font} from "../../theme";
const windowWidth = Dimensions.get('window').width;

export default function EventList(props) {
    const {navigation} = props;
    const {navigate} = navigation;

    //1 - DECLARE VARIABLES
    const [filters, setFilters] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [filterVisible, setFilterVisible] = useState(false);

    const {state, fetch} = useEvent();
    let {isFetching, isRefreshing, error, data, categories, popular} = state;

    //==================================================================================================

    //2 - MAIN CODE BEGINS HERE
    useEffect(() => {
        navigation.setParams({onPress: () => setFilterVisible(true), badge:selectedFilters.length});
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

    //FLATLIST ITEMS RENDERING
    //4a - RENDER ITEM
    const renderItem = (props) => {
        let {item, index} = props;
        let onPress = () => navigate("EventDetails", {event: item});

        return <EventItem item={item} index={index} onPress={onPress} isFeatured={props.isFeatured || false}/>
    };

    //4b - RENDER EMPTY
    const renderEmpty = () => {
        let string = selectedFilters.map((filter) => filter.name);
        let message = selectedFilters.length > 0 ? `No events matches your filter(s):\n ${string.join(', ')}` : "There are no events available.";

        return <Empty message={message}/>
    };

    //4b - RENDER HEADER
    const renderHeader = () => (
        <Panel title={"Popular"}
               data={selectedFilters.length > 0 ? [] : popular}
               itemWidth={(windowWidth * .80)}
               margin={12}
               containerStyle={{paddingTop: 12}}
               titleStyle={{fontFamily: font, color: "#0E0E27", marginBottom: 6}}
               renderItem={({item}) => renderItem({item, isFeatured: true})}/>
    );

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
            //CATEGORIES
            let categories_ = categories.map((category) => ({name: category.name, category: category['_id']}));

            //DATE FILTERS
            let dateFilters = [
                {name: "Today", start: moment().format('YYYY-MM-DD HH:mm')},
                {name: "Tomorrow", start: moment().add(1, 'days').format('YYYY-MM-DD HH:mm')},
                {
                    name: "This Week",
                    start: moment().startOf('week').format('YYYY-MM-DD HH:mm'),
                    end: moment().endOf('week').format('YYYY-MM-DD HH:mm')
                },
                {
                    name: "This Weekend",
                    start: moment().day(6).format('YYYY-MM-DD HH:mm'),
                    end: moment().day(7).format('YYYY-MM-DD HH:mm')
                },
            ];

            //SORT BY FILTERS
            let sortByFilters = [
                {name: "Most Recent", sort_by: "createdAt", sort_order:'desc'},
                {name: "Oldest", sort_by: "createdAt", sort_order:'asc'},
                {name: "Name - A-Z", sort_by: "name", sort_order:'asc'},
                {name: "Name - Z-A", sort_by: "name", sort_order:'desc'}
            ];

            return [{title: "Sort By", options: sortByFilters}, {title: "By Date", options: dateFilters}, {title: "Categories", options: categories_}];
        }
    }, [categories]);

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
};

EventList.navigationOptions = ({navigation}) => {
    let onPress = navigation.getParam('onPress');
    let badge = navigation.getParam('badge') || 0;

    let onCreate = () => navigation.navigate('AddEditEvent');
    let onSearch = () => navigation.navigate('Search');

    let style = {height: 40, width: 40, borderRadius: 40/2};

    return {
        title: "Events",
        headerRight: () => (
            <View style={{flexDirection:"row"}}>
                <NavIcon type={"ionicon"} name={"md-add"} onPress={onCreate} color={'#4D515D'} style={style} size={25}/>
                <NavIcon type={"ionicon"} name={"md-search"} onPress={onSearch} color={'#4D515D'} style={style} size={25}/>
                <NavIcon type={"octicon"} name={"settings"} onPress={onPress} color={'#2C1F8D'} style={style} size={22} badge={badge}/>
            </View>
        )
    };
};

