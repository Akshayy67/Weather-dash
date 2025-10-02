import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ForecastCard from './components/ForecastCard';
import FavoriteCities from './components/FavoriteCities';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteCities');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const handleSearch = async (city) => {
    setLoading(true);
    setError('');
    
    try {
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(`/api/weather/${city}`),
        fetch(`/api/forecast/${city}`)
      ]);

      if (!weatherResponse.ok || !forecastResponse.ok) {
        throw new Error('City not found');
      }

      const weather = await weatherResponse.json();
      const forecast = await forecastResponse.json();

      setWeatherData(weather);
      setForecastData(forecast);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = (city) => {
    if (!favorites.includes(city)) {
      const newFavorites = [...favorites, city];
      setFavorites(newFavorites);
      localStorage.setItem('favoriteCities', JSON.stringify(newFavorites));
    }
  };

  const removeFromFavorites = (city) => {
    const newFavorites = favorites.filter(fav => fav !== city);
    setFavorites(newFavorites);
    localStorage.setItem('favoriteCities', JSON.stringify(newFavorites));
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Weather Dashboard</h1>
      </header>
      
      <main className="main-content">
        <SearchBar onSearch={handleSearch} />
        
        <FavoriteCities 
          favorites={favorites}
          onCityClick={handleSearch}
          onRemove={removeFromFavorites}
        />

        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        
        {weatherData && (
          <WeatherCard 
            weather={weatherData}
            onAddToFavorites={addToFavorites}
            isFavorite={favorites.includes(weatherData.name)}
          />
        )}
        
        {forecastData && <ForecastCard forecast={forecastData} />}
      </main>
    </div>
  );
}

export default App;