import { useState, useEffect } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import Header from './components/Header';
import FeaturesSection from './components/FeaturesSection';
import SearchResults from './components/SearchResults';
import { Routes, Route, useNavigate } from 'react-router-dom';

function App() {
  const [query, setQuery] = useState('');
  const [enrichedResults, setEnrichedResults] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSearch = async () => {
    console.log(`Sending request to Nutritionix API: ${new Date().toISOString()}`);


    try {
      const instantURL = `https://trackapi.nutritionix.com/v2/search/instant?query=${encodeURIComponent(query)}`;
      const instantResponse = await fetch(instantURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-APP-ID': import.meta.env.VITE_API_ID,
          'X-APP-KEY': import.meta.env.VITE_API_KEY
        }
      });

      if (!instantResponse.ok) {
        throw new Error(`Instant API HTTP error: ${instantResponse.status}`);
      }

      const instantData = await instantResponse.json()
      const options = instantData.common || [];

      const enrichedOptions = await Promise.all(options.map(async (option) => {
        const nutrientsURL = `https://trackapi.nutritionix.com/v2/natural/nutrients`;
        const nutrientsResponse = await fetch(nutrientsURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-APP-ID': import.meta.env.VITE_API_ID,
            'X-APP-KEY': import.meta.env.VITE_API_KEY
          },
          body: JSON.stringify({query: option.food_name})
        });

        if(!nutrientsResponse.ok) {
          const errText = await nutrientsResponse.text();
          console.error("Nutrients fetch error:", nutrientsResponse.status, errText);
          return {...option, nutrition: null};
        }
        const nutrientsData = await nutrientsResponse.json();
        return {...option, nutrition: nutrientsData.foods[0] };
      }))

      setEnrichedResults(enrichedOptions);
      setError(null);

      navigate('/results');
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err)
      setEnrichedResults([])
    }
  }
  return (
      <div>
        <Navigation />
        <Routes>
          <Route
          path='/'
          element={
            <>
        <Header />
        <FeaturesSection 
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
        />
        </>
          }
          />

          <Route 
          path='/results'
          element={
            <SearchResults 
            results={enrichedResults}
            searchTerm={query}
            error={error}
            query={query}
            setQuery={setQuery}
            handleSearch={handleSearch}
            />
          } 
        />
        </Routes>
        </div>
  ) 
}
export default App;
