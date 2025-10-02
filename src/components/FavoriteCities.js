import React from 'react';
import './FavoriteCities.css';

const FavoriteCities = ({ favorites, onCityClick, onRemove }) => {
  if (favorites.length === 0) return null;

  return (
    <div className="favorite-cities">
      <h3>Favorite Cities</h3>
      <div className="favorites-list">
        {favorites.map(city => (
          <div key={city} className="favorite-item">
            <button 
              className="city-button"
              onClick={() => onCityClick(city)}
            >
              {city}
            </button>
            <button 
              className="remove-button"
              onClick={() => onRemove(city)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteCities;