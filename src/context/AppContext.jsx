//- a PROVIDER at the top of app that holds the app state
//- a HOOK you can call anywhere (useApp()) to read that state and update it.
//- a REDUCER that knows how to handle a few actions: set region, store fetched countries

import { createContext, useContext, useReducer } from "react";

//creating the context / a global box for our state
const AppContext = createContext ()

//defining starting state / what it looks like in beginning
const initialState = {
    selectedRegion: null, //'Europe', 'Asia'...
    countriesByRegion: {}, // {Europe: [...], Asia: [...]}
    collection: {}, // { CCA3: countryObj }
};

// reducer = decides how the state changes when we send it an 'action'
function reducer(state, action) {
    if (action.type === 'SET_REGION') {
        return { ...state, selectedRegion: action.payload };
    }
    if (action.type === 'SET_COUNTRIES') {
        const { region, countries } = action.payload;
        return {
            ...state,
            countriesByRegion: {
                ...state.countriesByRegion,
                [region]: countries,
            },
        };
    }

    //if the action type is not recognixed, return the state unchanged
    return state;
}

//Provider component that wraps your app
export function AppProvider({ children }) {
    //useReducer gives us [state, dispatch]
    const [state, dispatch] = useReducer(reducer, initialState);

    //we pass down state + dispatch to the rest of the app
    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}

//custom hook so we can use the context more easily
export function useApp() {
    return useContext(AppContext);
}