const WeatherCard = ({ data, city, onToggleFavorite, isFavorite }) => {
  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  if (!data || !data.weather || !data.main) {
    return (
      <div className="card bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
        <div className="text-center">Loading weather data...</div>
      </div>
    );
  }

  return (
    <div className="card bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 text-white shadow-lg border border-white/20">
      {/* Header with city name and favorite button */}
      <div className="flex justify-between items-start mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
            {city}
          </h2>
          <p className="text-white/80 text-sm sm:text-base lg:text-lg">
            {data.sys?.country || ""}
          </p>
        </div>
        <button
          onClick={onToggleFavorite}
          className={`text-2xl sm:text-3xl transition-all duration-200 hover:scale-110 ${
            isFavorite
              ? "text-yellow-400 drop-shadow-lg"
              : "text-white/60 hover:text-yellow-400"
          }`}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "⭐" : "☆"}
        </button>
      </div>

      {/* Main weather display */}
      <div className="flex items-center justify-center mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="flex-shrink-0">
            <img
              src={getWeatherIcon(data.weather[0].icon)}
              alt={data.weather[0].description}
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-lg"
            />
          </div>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">
              {Math.round(data.main.temp)}°C
            </div>
            <div className="text-white/80 text-lg sm:text-xl capitalize font-medium">
              {data.weather[0].description}
            </div>
          </div>
        </div>
      </div>

      {/* Weather details grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="card bg-white/10 rounded-xl p-3 sm:p-4 border border-white/10">
          <div className="text-white/70 text-xs sm:text-sm font-medium mb-1">
            Feels like
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
            {Math.round(data.main.feels_like)}°C
          </div>
        </div>
        <div className="card bg-white/10 rounded-xl p-3 sm:p-4 border border-white/10">
          <div className="text-white/70 text-xs sm:text-sm font-medium mb-1">
            Humidity
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
            {data.main.humidity}%
          </div>
        </div>
        <div className="card bg-white/10 rounded-xl p-3 sm:p-4 border border-white/10">
          <div className="text-white/70 text-xs sm:text-sm font-medium mb-1">
            Wind Speed
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
            {data.wind?.speed || 0} m/s
          </div>
        </div>
        <div className="card bg-white/10 rounded-xl p-3 sm:p-4 border border-white/10">
          <div className="text-white/70 text-xs sm:text-sm font-medium mb-1">
            Pressure
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
            {data.main.pressure} hPa
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
