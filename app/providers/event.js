
import React, {useMemo, useContext} from 'react';

//IMPORT REDUCER, INITIAL STATE AND ACTION TYPES
import useActionCreator from "../utils/useActionCreator";

// CONTEXT ===================================
const EventContext = React.createContext();

function EventProvider(props) {
    const {state, dispatch, fetch, crud, getStateData} = useActionCreator("events", ["categories", "popular"]);
    const categoryObj = useActionCreator("categories");

    const value = useMemo(() => {
        return {state, dispatch, fetch, crud, getStateData, categoryObj};
    }, [state, categoryObj['state']]);

    return (
        <EventContext.Provider value={value}>
            {props.children}
        </EventContext.Provider>
    );
}

const useEvent = () => useContext(EventContext);
export { EventContext, useEvent }
export default EventProvider;