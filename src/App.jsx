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
import Terms from './components/Terms';
import Privacy from './components/Privacy'
import MyFoods from './components/MyFoods';
import CalendarPage from './components/CalendarPage';



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
        const instantURL = `https://api.spoonacular.com/food/ingredients/search?query=${encodeURIComponent(query)}&number=10&apiKey=${import.meta.env.VITE_API_KEY}`;
        const instantResponse = await fetch(instantURL)
        
        if (!instantResponse.ok) {
          throw new Error(`Instant API HTTP error: ${instantResponse.status}`);
        }
        
        const instantData = await instantResponse.json()
        const options = instantData.results || [];
        
        const enrichedOptions = await Promise.all(options.map(async (option) => {
          const nutrientsURL = `https://api.spoonacular.com/food/ingredients/${option.id}/information?amount=100&unit=grams&apiKey=${import.meta.env.VITE_API_KEY}`;
          const nutrientsResponse = await fetch(nutrientsURL)
          
          if(!nutrientsResponse.ok) {
            const errText = await nutrientsResponse.text();
            console.error("Nutrients fetch error:", nutrientsResponse.status, errText);
            return {...option, nutrition: null};
          }
          const nutrientsData = await nutrientsResponse.json();
          const nutrientsArray = nutrientsData.nutrition?.nutrients || [];
          const getNutrientValue = (name) => {
            const nutrient = nutrientsArray.find(n => n.name.toLowerCase() === name.toLowerCase())
            return nutrient ? nutrient.amount : 0;
          }

          const nutrition = {
            servingSize: '100g',
            photo: { thumb: `https://spoonacular.com/cdn/ingredients_500x500/${option.image}` },
            nf_calories: getNutrientValue('Calories'),
            nf_total_fat: getNutrientValue('Fat'),
            nf_protein: getNutrientValue('Protein'),
            nf_total_carbohydrate: getNutrientValue('Carbohydrates')
          };
  
          return { ...option, food_name: option.name, nutrition };
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
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
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
        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>}>
        <Route index element={<CalendarPage />} />
        <Route path="calendar" element={<ProtectedRoute> <CalendarPage /> </ProtectedRoute>} />
        <Route path="my-foods" element={<ProtectedRoute> <MyFoods /> </ProtectedRoute> } />
      </Route>
        </Routes>
        </div>
  ) 
}
export default App;
