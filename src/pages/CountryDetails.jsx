import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';


export default function CountryDetails() {
  //useParams is a react HOOK, looks at the current URL and gives an 
  //object with all the:params you defined in your routes
  const { countryCode } = useParams();
  //useApp is my own custom HOOK.
  const { state, addToCollection, removeFromCollection } = useApp();  
  
  //try to find the country from your cached list
  // 1 - state.countriesByRegion is an object with key: Europe, value: array of country objects
  // 2 - Object.values takes just the values of the object and puts them in an array (we now have an array of multiple arrays)
  // 3 - .flat() method takes an array of arrays and crushes them into one big array.
  //summary: “Take all the regions we’ve fetched, ignore the keys (Europe, Asia, …), just grab the arrays of countries, and merge them into one big array called allCountries.”
  const allCountries = Object.values(state.countriesByRegion).flat();
  const country = allCountries.find(c => c.cca3 === countryCode);

  if (!country) return <p>Country not found</p>;

  const isSaved = !!state.collection[country.cca3];

  function handleSave() {
    //passing the entire country object 
    addToCollection(country);
  }

  function handleRemove() {
    //when removing, just say delete the one with this key
    removeFromCollection(country.cca3);
  }

  return (
      <div className='country-div'>
        <img src={country.flags.png} alt={country.name.common}></img>
        <h2>{country.name.common}</h2>
        <p>Population: {country.population.toLocaleString()}</p>
        <p>
          {/* - if currencies is missing, use {} as a falllback
              - Object.values turns the object into an array of its values (multiple objects, swe kr, euro € -> one array)
              - .map(cur => cur.name) extract just the names ['Swedish krona', 'Euro']
              - .join(',') join into one string: 'Swedish krona', 'Euro'
              SUMMARY: So your <p>Currency: ...</p> renders a clean, comma-separated list.*/}
          Currency: {Object.values(country.currencies || {} )
          .map(cur => cur.name)
          .join(', ')
          }
        </p>
        <a href={country.maps.googleMaps} target='_blank'>View on Google Maps</a>
          {/*SAVE BUTTON GOES HERE*/}
          {isSaved ? (
            <button onClick={handleRemove}>Remove from collection</button>
          ) : (
            <button onClick={handleSave}>Save to collection</button>
          )}
      </div>
    );
  }