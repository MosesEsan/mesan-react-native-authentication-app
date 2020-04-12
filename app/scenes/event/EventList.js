import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, Text, View, Dimensions} from 'react-native';

import moment from "moment";

import {getEvents} from "../../services/event";
import {useEvent} from "../../providers/event";

import EventItem from "../../components/EventItem";
import {Empty, Footer, NavIcon, Placeholder, FilterView, Panel, Header} from 'mesan-react-native-components'

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
    let {isFetching, isRefreshing, error, data, categories} = state;

    //==================================================================================================

    //2 - MAIN CODE BEGINS HERE
    useEffect(() => {
        navigation.setParams({onPress: () => setFilterVisible(true)});
        getData()
    }, [filters]);

    //==================================================================================================

    //3 - GET DATA
    function getData(refresh = false, more = false) {
        let filters = {};

        //Apply any selected filter
        selectedFilters.map((filter, idx) => {
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
    const renderItem = ({item, index}) => {
        let onPress = () => navigate("EventDetails", {event: item});

        return <EventItem item={item} index={index} onPress={onPress}/>
    };

    //4b - RENDER HEADER
    const renderHeader = () => {

        if (selectedFilters.length > 0){
            let string = selectedFilters.map((filter) => filter.name)

            return <Header title={`${string.join(', ')} Events`}/>
        }else{
            return(
                <Panel title={"Popular"}
                       data={data}
                       itemWidth={(windowWidth * .80)}
                       margin={12}
                       containerStyle={{paddingTop: 12}}
                       titleStyle={{fontFamily: font,color: "#0E0E27", marginBottom: 6}}
                       renderItem={({item}) => <EventItem item={item} isFeatured={true}/>}/>
            )
        }

    }
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
    const keyExtractor = (item, index) => `event_${item._id.toString()}${index.toString()}`;
    const refreshProps = {refreshing: isRefreshing, onRefresh};
    const loadMoreProps = {onEndReached, onEndReachedThreshold: 0, ListFooterComponent: renderFooter};

    //==================================================================================================

    // 6b - FILTERS PROPS
    const filters_ = useMemo(() => {
        if (filters) return filters;
        else {
            //CATEGORIES
            let categories_ = [];
            categories.map((category, idx) => {
                let {_id, name} = category;
                categories_.push({name, category: _id})
            });

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

            return [{title: "By Date", options: dateFilters}, {title: "Categories", options: categories_}];
        }
    }, [categories]);

    const onDoneFilter = useCallback(({filters, selected}) => {
        setFilters(selected.length > 0 ? filters : null);
        setSelectedFilters(selected);
        setFilterVisible(false);
    }, []);

    //==================================================================================================

    //7 - RENDER VIEW
    if (isFetching || error) return <Placeholder isFetching={isFetching} error={error} onRetry={getData}/>

    return (
        <FlatList
            data={data}
            extraData={state}
            initialNumToRender={5}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={() => <Empty message={"There are no events available."}/>}
            style={{backgroundColor: "#ffffff"}}
            contentContainerStyle={{minHeight: '100%'}}
            keyExtractor={keyExtractor}
            {...loadMoreProps}
            {...refreshProps}/>
    );
};

EventList.navigationOptions = ({navigation}) => {
    let onCreate = () => navigation.navigate('AddEditEvent');
    let onSearch = () => navigation.navigate('Search');
    let onPress = navigation.getParam('onPress');
    let style = {height: 40, width: 40, borderRadius: 40/2};

    return {
        title: "Events",
        headerRight: () => (
            <View style={{flexDirection:"row"}}>
                <NavIcon type={"ionicon"} name={"md-add"} onPress={onCreate} color={'#4D515D'} style={style}/>
                <NavIcon type={"ionicon"} name={"md-search"} onPress={onSearch} color={'#4D515D'} style={style}/>
                <NavIcon type={"octicon"} name={"settings"} onPress={onPress} color={'#2C1F8D'} style={style} size={19}/>
            </View>
        )
    };
};

