import React from 'react';
import './WeatherCard.css';

const WeatherCard = ({ weather, onAddToFavorites, isFavorite }) => {
  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <div className="weather-card">
      <div className="weather-header">
        <h2>{weather.name}, {weather.sys.country}</h2>
        <button 
          className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
          onClick={() => onAddToFavorites(weather.name)}
          disabled={isFavorite}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>
      
      <div className="weather-main">
        <img 
          src={getWeatherIcon(weather.weather[0].icon)}
          alt={weather.weather[0].description}
          className="weather-icon"
        />
        <div className="temperature">
          {Math.round(weather.main.temp)}°C
        </div>
        <div className="description">
          {weather.weather[0].description}
        </div>
      </div>
      
      <div className="weather-details">
        <div className="detail-item">
          <span className="label">Feels like:</span>
          <span className="value">{Math.round(weather.main.feels_like)}°C</span>
        </div>
        <div className="detail-item">
          <span className="label">Humidity:</span>
          <span className="value">{weather.main.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="label">Wind Speed:</span>
          <span className="value">{weather.wind.speed} m/s</span>
        </div>
        <div className="detail-item">
          <span className="label">Pressure:</span>
          <span className="value">{weather.main.pressure} hPa</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;