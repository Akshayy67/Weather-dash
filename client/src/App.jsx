import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastList from "./components/ForecastList";
import LoadingCard from "./components/LoadingCard";
import { fetchCurrent, fetchForecast } from "./api";
import { summarizeForecast } from "./utils";
import {
  loadFavorites,
  saveFavorites,
  loadRecent,
  saveRecent,
} from "./storage";
import "./App.css";

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [city, setCity] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [recent, setRecent] = useState([]);

  // Load favorites and recent cities on mount
  useEffect(() => {
    setFavorites(loadFavorites());
    setRecent(loadRecent());
  }, []);

  // Function to get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Use reverse geocoding to get city name from coordinates
          const useProxy = import.meta.env.VITE_USE_PROXY === "true";
          const proxyBase = import.meta.env.VITE_PROXY_BASE || "";

          let response;
          if (useProxy) {
            response = await fetch(
              `${proxyBase}/api/reverse-geocode?lat=${latitude}&lon=${longitude}`
            );
          } else {
            response = await fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${
                import.meta.env.VITE_OWM_API_KEY
              }`
            );
          }

          if (response.ok) {
            const data = await response.json();
            if (data.length > 0) {
              const cityName = data[0].name;
              await searchWeather(cityName);
            } else {
              setError("Could not determine your location");
            }
          } else {
            setError("Could not determine your location");
          }
        } catch (err) {
          setError("Failed to get your location");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError("Location access denied by user.");
            break;
          case error.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setError("Location request timed out.");
            break;
          default:
            setError("An unknown error occurred.");
            break;
        }
      }
    );
  };

  // Main function to search for weather
  const searchWeather = async (searchCity) => {
    if (!searchCity.trim()) return;

    setLoading(true);
    setError("");
    setWeather(null);
    setForecast(null);

    try {
      // Fetch current weather and forecast in parallel
      const [currentData, forecastData] = await Promise.all([
        fetchCurrent(searchCity),
        fetchForecast(searchCity),
      ]);

      setWeather(currentData);
      setForecast(summarizeForecast(forecastData.list));
      setCity(currentData.name);

      // Update recent cities
      const updatedRecent = saveRecent(currentData.name, recent);
      setRecent(updatedRecent);
    } catch (err) {
      setError(err.message || "Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite city
  const toggleFavorite = (cityName) => {
    const newFavorites = favorites.includes(cityName)
      ? favorites.filter((fav) => fav !== cityName)
      : [...favorites, cityName];

    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  // Handle search from SearchBar
  const handleSearch = (searchCity) => {
    searchWeather(searchCity);
  };

  // Handle location search from SearchBar
  const handleLocationSearch = () => {
    getCurrentLocation();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
            Weather Dashboard
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-200">
            Get current weather and 5-day forecast for any city
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full mb-4 sm:mb-6 lg:mb-8">
          <SearchBar
            onSearch={handleSearch}
            onLocationSearch={handleLocationSearch}
            initial=""
          />
        </div>

        {/* Favorites and Recent Cities */}
        {(favorites.length > 0 || recent.length > 0) && (
          <div className="w-full mb-4 sm:mb-6 lg:mb-8">
            {favorites.length > 0 && (
              <div className="mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2 sm:mb-3 text-center">
                  Favorite Cities
                </h3>
                <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                  {favorites.map((fav) => (
                    <button
                      key={fav}
                      onClick={() => searchWeather(fav)}
                      className="px-2 sm:px-3 py-1 sm:py-2 bg-yellow-500/20 text-yellow-200 rounded-full text-xs sm:text-sm hover:bg-yellow-500/30 transition-colors border border-yellow-500/30"
                    >
                      ⭐ {fav}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {recent.length > 0 && (
              <div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2 sm:mb-3 text-center">
                  Recent Searches
                </h3>
                <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                  {recent.map((recentCity) => (
                    <button
                      key={recentCity}
                      onClick={() => searchWeather(recentCity)}
                      className="px-2 sm:px-3 py-1 sm:py-2 bg-slate-500/20 text-slate-200 rounded-full text-xs sm:text-sm hover:bg-slate-500/30 transition-colors border border-slate-500/30"
                    >
                      {recentCity}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="w-full">
            <LoadingCard message="Loading weather data..." />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="w-full mb-4 sm:mb-6 lg:mb-8">
            <div className="card bg-red-500/20 border border-red-500/50 rounded-2xl p-4 sm:p-6 text-center shadow-lg">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">⚠️</div>
              <h3 className="text-lg sm:text-xl font-semibold text-red-200 mb-2">
                Oops! Something went wrong
              </h3>
              <p className="text-red-300 text-sm sm:text-base">{error}</p>
              <p className="text-red-400 text-xs sm:text-sm mt-2">
                Please try again or check your internet connection.
              </p>
            </div>
          </div>
        )}

        {/* Weather Data */}
        {weather && !loading && (
          <div className="w-full space-y-4 sm:space-y-6">
            <WeatherCard
              data={weather}
              city={city}
              onToggleFavorite={() => toggleFavorite(city)}
              isFavorite={favorites.includes(city)}
            />

            {forecast && (
              <ForecastList
                days={forecast.map((day) => ({
                  date: new Date(day.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  }),
                  temp: day.max,
                  icon: day.icon,
                  description: day.desc,
                  humidity: day.humidity,
                }))}
              />
            )}
          </div>
        )}

        {/* Welcome Message */}
        {!weather && !loading && !error && (
          <div className="w-full">
            <div className="card bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 lg:p-8 text-center shadow-lg border border-white/20">
              <div className="text-4xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6">
                🌤️
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">
                Welcome to Weather Dashboard
              </h2>
              <p className="text-slate-200 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8">
                Search for a city to get started, or use your current location
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-slate-300">
                <div className="card bg-white/10 rounded-xl p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl mb-2">🌡️</div>
                  <p className="font-medium text-sm sm:text-base">
                    Current Weather
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Real-time conditions
                  </p>
                </div>
                <div className="card bg-white/10 rounded-xl p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl mb-2">📅</div>
                  <p className="font-medium text-sm sm:text-base">
                    5-Day Forecast
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Extended predictions
                  </p>
                </div>
                <div className="card bg-white/10 rounded-xl p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl mb-2">⭐</div>
                  <p className="font-medium text-sm sm:text-base">
                    Favorite Cities
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Quick access
                  </p>
                </div>
                <div className="card bg-white/10 rounded-xl p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl mb-2">📍</div>
                  <p className="font-medium text-sm sm:text-base">
                    Location Services
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Auto-detect location
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
