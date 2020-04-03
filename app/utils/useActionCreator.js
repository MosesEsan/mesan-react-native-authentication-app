import React, {useReducer} from 'react';
import crudReducer, {CRUD_REQUEST, CRUD_STATE, FETCH_REQUEST, FETCH_STATE, initialState} from "./crudReducer"

export default function useActionCreator(dataKey, otherKeys = []) {
    //additional keys
    otherKeys.map((key, idx) => initialState[key] = initialState[key] || []);

    const [state, dispatch] = useReducer(crudReducer, initialState || {});

    const fetch = async (apiRequest, refresh = false, more = false) => {
        let fetchState = refresh ? FETCH_STATE.REFRESH : FETCH_STATE.INITIAL;
        fetchState = more ? FETCH_STATE.MORE : fetchState;

        dispatch({type: FETCH_REQUEST, fetchState});
        try {
            let response = await apiRequest();
            dispatch({type: FETCH_REQUEST, fetchState: FETCH_STATE.SUCCESS, data: response, dataKey, otherKeys})
        } catch (error) {
            dispatch({type: FETCH_REQUEST, fetchState: FETCH_STATE.ERROR, error, dataKey, otherKeys})
        }
    };

    //2 - CRUD Operations
    const crud = {
        index: (data) => dispatch({type: FETCH_REQUEST, fetchState: FETCH_STATE.SUCCESS, data, dataKey}),
        add: (data) => dispatch({type: CRUD_REQUEST, crudState: CRUD_STATE.CREATE, data}),
        update: (data) => dispatch({type: CRUD_REQUEST, crudState: CRUD_STATE.UPDATE, data}),
        delete: (data) => dispatch({type: CRUD_REQUEST, crudState: CRUD_STATE.DELETE, data})
    };

    //3 - Get State Data
    const getStateData = (id) => {
        let index = state.data.findIndex((obj) => obj._id === id);
        return (index !== -1)  ? state.data[index]: null;
    };

    return {state, dispatch, fetch, crud, getStateData};
}