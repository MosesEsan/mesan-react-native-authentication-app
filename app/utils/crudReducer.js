//ACTION TYPES
export const FETCH_REQUEST = 'FETCH_REQUEST';
export const CRUD_REQUEST = 'CRUD_REQUEST';

//FETCH REQUEST STATES
export const FETCH_STATE = {
    INITIAL: 'INITIAL',
    REFRESH: 'REFRESH',
    MORE: 'MORE',
    ERROR: 'ERROR',
    SUCCESS: 'SUCCESS'
};

export const CRUD_STATE = {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE'
};

//====
//INITIAL STATE
export const initialState = {
    isFetching: true,
    isFetchingMore: false,
    isRefreshing: false,
    error: null,
    data: [],
    totalResults:null, page:null, nextPage: null
};

//HANDLERS
export default function crudReducer (state = initialState, action) {
    switch (action.type) {
        case FETCH_REQUEST:{
            let [...data] = state.data;
            let fetchState = action.fetchState;
            let dataKey = action.dataKey || "data";
            let otherKeys = action.otherKeys || [];

            //REQUEST STATE
            let isFetching = (fetchState === FETCH_STATE.INITIAL);
            let isRefreshing = (fetchState === FETCH_STATE.REFRESH);
            let isFetchingMore = (fetchState === FETCH_STATE.MORE);
            let requestState = {isFetching, isRefreshing, isFetchingMore};

            //DATA STATE
            let newState = {};
            if (fetchState === FETCH_STATE.ERROR) newState = {error: action.error};
            else if (fetchState === FETCH_STATE.SUCCESS) {
                let response = action.data;
                let page = response.page || 1;
                let newData = response[`${dataKey}`];

                newState = {
                    data: (page > 1) ? [...data, ...newData] : newData,
                    page,
                    totalResults: response.totalResults || null,
                    nextPage: response.nextPage || null
                };

                //additional keys
                otherKeys.map((key, idx) => newState[key] = response[key] || null)
            }

            return {...state, ...requestState, ...newState};
        }

        case CRUD_REQUEST:{
            let [...data] = state.data;
            let newData  = action.data;
            let crudState = action.crudState;

            if (crudState === CRUD_STATE.CREATE) data.unshift(newData);
            else if (crudState === CRUD_STATE.DELETE) data = data.filter((obj) => obj._id !== newData._id);
            else if (crudState === CRUD_STATE.UPDATE) {
                const index = data.findIndex((obj) => obj._id === newData._id);
                if (index !== -1) data[index] = {...data[index], ...newData};
            }

            return {...state, data};
        }

        default:
            return state;
    }
};