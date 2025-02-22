import { useState, useEffect, useRef } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import Header from './components/Header';
import FeaturesSection from './components/FeaturesSection';
import SearchResults from './components/SearchResults';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Spinner from './components/Spinner';
import BlogSection from './components/BlogSection';
import BlogDetail from './components/BlogDetail';
import NutritionCalculator from './components/NutritionCalculator';
import Register from './components/Register';
import VerifyEmail from './components/VerifyEmail';
import Dashboard from './components/Dashboard'
import ProtectedRoute from './components/ProtectedRoute';
import Logout from './components/Logout';
import Login from './components/Login';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);
  
  const [query, setQuery] = useState('');
  const [enrichedResults, setEnrichedResults] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if(location.pathname === '/') {
      setDisabled(false);
    }
  }, [location.pathname]);
  
  const handleSearch = async () => {
    navigate('/results');
    setQuery('');
    setIsLoading(true);
    setDisabled(true)
    setSearchTerm(query);
    setTimeout(async () => {
      
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
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err)
        setEnrichedResults([])
      } finally {
        setIsLoading(false);
      }
    }, 500);
    }
    return (
      <div>
        <Navigation />
        <ScrollToTop />
        <Routes>
          
          <Route path='/register' element={<Register />}/>
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<Logout />} /> 
          <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ ProtectedRoute>} />
          <Route
          path='/'
          element={
            <>
        <Header />
        <FeaturesSection 
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
        disabled={disabled}
        />
        <BlogSection />
        <NutritionCalculator />
        </>
          }
          />

          <Route 
          path='/results'
          element={
            <SearchResults 
            results={enrichedResults}
            searchTerm={searchTerm}
            error={error}
            query={query}
            setQuery={setQuery}
            handleSearch={handleSearch}
            isLoading={isLoading}
            />
          } 
        />
        <Route path='/blog/:id' element={<BlogDetail />} />
        </Routes>
        </div>
  ) 
}
export default App;
