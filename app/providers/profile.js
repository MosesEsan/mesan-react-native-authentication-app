import React, {useMemo, useContext} from 'react';

//IMPORT REDUCER, INITIAL STATE AND ACTION TYPES
import useActionCreator from "../utils/useActionCreator";

// CONTEXT ===================================
const ProfileContext = React.createContext();

function ProfileProvider(props) {
    const {state, dispatch, fetch, crud, getStateData} = useActionCreator("events");

    const value = useMemo(() => {
        return {state, dispatch, fetch, crud, getStateData};
    }, [state]);

    return (
        <ProfileContext.Provider value={value}>
            {props.children}
        </ProfileContext.Provider>
    );
}

const useProfile = () => useContext(ProfileContext);
export { ProfileContext, useProfile }
export default ProfileProvider;