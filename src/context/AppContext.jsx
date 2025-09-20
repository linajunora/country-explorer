//- a PROVIDER at the top of app that holds the app state
//- a HOOK you can call anywhere (useApp()) to read that state and update it.
//- a REDUCER that knows how to handle a few actions: set region, store fetched countries

import { createContext, useContext, useReducer } from "react";

//creating the context / a global box for our state
const AppContext = createContext ()

const saved = localStorage.getItem('collection');
//defining starting state / what it looks like in beginning
const initialState = {
    selectedRegion: null, //'Europe', 'Asia'...
    countriesByRegion: {}, // {Europe: [...], Asia: [...]}
    collection: saved ? JSON.parse(saved) : {} 
};

// reducer = decides how the state changes when we send it an 'action'
function reducer(state, action) {
    //action is the full object { type, payload }
    //action.payload is just 'Asia'
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
    //SAVE COUNTRY
    //in CountryDetails.jsx when you click Save Country, you run: addToCollection(country)
    //that helper dispatch type: 'ADD_TO...', payload: country
    //so the action object being sent into the reducer is:
    // {
    //     type: "ADD_TO_COLLECTION",
    //     payload: {
    //       cca3: "SWE",
    //       name: { common: "Sweden" },
    //       flags: { png: "...png" },
    //       population: 10000000,
    //       currencies: { SEK: { name: "Swedish krona" } },
    //       maps: { googleMaps: "..." }
    //       // ...rest of country data
    //     }
    //   }
    //STEP 2 REDUCER RUNS, recieves TWO things: - current state (whatever global state looks like), - the action object above
    if (action.type === 'ADD_TO_COLLECTION') {
        const country = action.payload;
        
        const newCollection = {
            ...state.collection,
            [country.cca3]: country, //key cca3
        };

        //local storage add
        localStorage.setItem('collection', JSON.stringify(newCollection));

        return {
            ...state,
            collection: newCollection,
        };
    }
    //REMOVE COUNTRY 
    if (action.type === 'REMOVE_FROM_COLLECTION') {
        const code = action.payload;
        
        //copy collection and delete one
        const newCollection = { ...state.collection };
        delete newCollection[code];

        localStorage.setItem('collection', JSON.stringify(newCollection));

        return {
            ...state,
            collection: newCollection,
        };
    }

    //if the action type is not recognixed, return the state unchanged
    return state;
}

//Provider component that wraps your app
export function AppProvider({ children }) {
    //useReducer gives us [state, dispatch]
    const [state, dispatch] = useReducer(reducer, initialState);

    //helper functions so components doesnt have to use dispatch
    const addToCollection = (country) => 
        dispatch({ type: 'ADD_TO_COLLECTION', payload: country});

    const removeFromCollection = (code) =>
        dispatch({ type: 'REMOVE_FROM_COLLECTION', payload: code });

    //we pass down state + dispatch to the rest of the app
    return (
        <AppContext.Provider value={{ state, dispatch, addToCollection, removeFromCollection }}>
            {children}
        </AppContext.Provider>
    );
}

//custom hook so we can use the context more easily
export function useApp() {
    return useContext(AppContext);
}