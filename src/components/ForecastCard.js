import React from 'react';
import './ForecastCard.css';

const ForecastCard = ({ forecast }) => {
  const getDailyForecast = () => {
    const dailyData = {};
    
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          humidity: item.main.humidity,
          description: item.weather[0].description,
          icon: item.weather[0].icon
        };
      } else {
        dailyData[date].temp_min = Math.min(dailyData[date].temp_min, item.main.temp_min);
        dailyData[date].temp_max = Math.max(dailyData[date].temp_max, item.main.temp_max);
      }
    });
    
    return Object.values(dailyData).slice(0, 5);
  };

  const dailyForecast = getDailyForecast();

  return (
    <div className="forecast-card">
      <h3>5-Day Forecast</h3>
      <div className="forecast-list">
        {dailyForecast.map((day, index) => (
          <div key={index} className="forecast-item">
            <div className="forecast-date">
              {new Date(day.date).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
            <img 
              src={`https://openweathermap.org/img/wn/${day.icon}.png`}
              alt={day.description}
              className="forecast-icon"
            />
            <div className="forecast-temps">
              <span className="temp-max">{Math.round(day.temp_max)}°</span>
              <span className="temp-min">{Math.round(day.temp_min)}°</span>
            </div>
            <div className="forecast-humidity">
              {day.humidity}% humidity
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastCard;