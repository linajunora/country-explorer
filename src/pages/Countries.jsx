import { useApp } from "../context/AppContext.jsx";
import useFetchCountries from "../features/countries/hooks/useFetchCountries.js";

export default function Countries() {
  const { state, dispatch } = useApp();
  const { selectedRegion } = state;

  //call the hook (it will fetch if needed)
  const { loading, error, list } = useFetchCountries();
  
  const regions = ['Europe', 'Asia', 'Oceania', 'Americas', 'Africa'];

  function handleSelected(region) {
    dispatch({ type: 'SET_REGION', payload: region });
  }
    return (
      <div>
        <h2>Study Countries</h2>
        <div>
          {/*Maps r(region) ex: 'Africa' -> it calls handleSelected('Africa')
          -> handleSelected updates the global state of SET_REGION
          -> the dispatch goes to appContext reducer, which updates state.selectedRegion = 'Africa'*/}
          {regions.map((r) => (
            <button
            key={r}
            className="btn"
            onClick={() => handleSelected(r)}
            style={{ opacity: selectedRegion === r ? 1 : 0.7 }}
            >
              {r}
            </button>
          ))}
        </div>

        {!selectedRegion && <p>Select a region to load countries</p>}
        {selectedRegion && loading && <p>Loading...</p>}
        {selectedRegion && error && <p style={{ color: 'red'}}>Error: {error}</p>}
        {selectedRegion && list && (
          <div className="countries-grid">
            {list
              .slice()//shallow copy so i dont mutate state
              .sort((a, b) => a.name.common.localeCompare(b.name.common))
              .map((country) => (
              <div key={country.cca3} className="country-card">
                <img src={country.flags.png} className="country-img" alt={country.name.common} />
                <p>{country.name.common}</p>
              </div>
            ))} 
          </div>
        )}

        {/*Later: render your flagGrid here using `list`*/}
      </div>
    );
  }