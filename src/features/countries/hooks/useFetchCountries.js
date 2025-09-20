//Import React Hooks
//Here useState lets you create local state (loading, error)
//useEffect lets you run side effects (do a fetch when region changes).
import { useEffect, useState} from "react";
//useApp is your helper to access the global Context (state and dispatch)
import { useApp } from "../../../context/AppContext.jsx";

// this is a React hook
// 1. watches which region the user selected from your global Context
// 2. if countries for that region are not already cached, it fetches them from the REST countries API
// 3. it stores the result in your global Context (so other pages can use it without refetching)
// 4. it exposes simple status flags (loading, error) and the list of the countries for that current region
// we then call this hook from Countries.jsx

//defining a custom hook named useFetchCountries
//hook names always start with use
export default function useFetchCountries() {
    // 🌍 GLOBAL STATE (shared across the app)
    //useApp gives you your global state and the dispatch function from Context
    const { state, dispatch } = useApp();

    // Pull out the pieces we care about from global state
    // immediately pick out: which region is selected. and countriesbyregion an object that will hold cached results per region
    const { selectedRegion, countriesByRegion } = state;

    // 📝 LOCAL STATE (private to this hook)
    //local state inside the hook (not global)
    const [loading, setLoading ] = useState(false);
    const [error, setError] = useState(null)

    // ⚡ SIDE EFFECT (fetch countries when needed)
    useEffect(() => {
        // This is your caching logic: fetch once per region, then reuse.
        //if nothing selected, nothing to fetch
        if (!selectedRegion) return;

        //already cached, skip fetch
        if (countriesByRegion[selectedRegion]) return;

        //AbortController lets us cancel the fetch if the component unmounts or 
        //the region changes quickly. That prevents “state update after unmount” errors.
        const abort = new AbortController();
        //fields limits what the API returns — you’re asking only for the data you need (smaller, faster responses).
        const fields = 'name,flags,population,currencies,maps,cca3';

        //before start fetching, setLoading to true, clear any prev. error
        setLoading(true);
        setError(null);

        //fetch with the region and the fields
        //pass signal so the request can be aborted if needed
        //if response is not OK, throw errir and jump to .catch
        //otherwise parse JSON
        fetch(`https://restcountries.com/v3.1/region/${selectedRegion}?fields=${fields}`, {
            signal: abort.signal,
          })
            .then((res) => {
               if (!res.ok) throw new Error(`HTTP ${res.status}`);
               return res.json();
            })
            //when data arrives, you dispatch and action to your Context reducer
            //payload has the region and the array of countries
            //your reducer stores that under countriesByRegion[region], so its cached for next time
            .then((data) => {
                
                const filtered = data.filter(
                    (country) => country.name.common.toLowerCase() !== 'israel'
                );
                //store data
                dispatch({
                    type: 'SET_COUNTRIES',
                    payload: { region: selectedRegion, countries: filtered },
                });
            })
            //only show error if it WASNT caused by an abort (user navigate too quickly)
            //setError shows message in UI
            .catch((err) => {
                if (err.name !== "AbortError") setError(err.message || "Failed to load");
            })
            //whether it succeeded or failed, you're done loading.
            .finally(() => setLoading(false));

            //the cleanup action runs if:
            // - the component using the hook unmounts, or
            // - the dependencies change (eg selectedRegion changes) before fetch finishes

            // dependencies explained:
            // - selectedREgion -> when user picks new region, the effect re-runs
            // - countriesByRegion -> if cache changes (after fetch), the effect runs; but because of
            //your early if return;, it exist so you dont loop
            // - dispatch included for completedness (react may warn otherwise)
            return () => abort.abort();
    }, [selectedRegion, countriesByRegion, dispatch]);

    //list is the current regions countries, or null if no region is selected
    //the hook returns a simple object: 
    //- loading -> for spinners/text
    //- error -> for error messages
    //- list -> the data to render (flags, names)
    //- selectedRegion -> handy for the UI
    const list = selectedRegion ? countriesByRegion[selectedRegion]: null;

    return { loading, error, list, selectedRegion };
}