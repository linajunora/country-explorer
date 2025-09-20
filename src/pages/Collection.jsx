import { useApp } from '../context/AppContext.jsx';
import { Link } from 'react-router-dom';

export default function Collection() {
    
  const { state } = useApp();
  const currentCollection = {
    ...state.collection,
  }
  console.log(currentCollection);

  const countriesArray = Object.values(currentCollection);
  console.log(countriesArray);

 

  return (
    <div className='countries-grid'>
      {countriesArray.map(country => (
        <div key={country.cca3} className="country-card">
          <Link to={`/countries/${country.cca3}`}>
            <img
              src={country.flags.png}
              alt={country.name.common}
              className="country-img"
            />
          </Link>
          <p>{country.name.common}</p>
        </div>
      ))}
    </div>
  );
  
}