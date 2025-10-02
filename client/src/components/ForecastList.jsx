const ForecastList = ({ days }) => {
  if (!days || days.length === 0) {
    return (
      <div className="card bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
        <div className="text-center">No forecast data available</div>
      </div>
    );
  }

  return (
    <div className="card bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 text-white shadow-lg border border-white/20">
      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 text-center text-white">
        5-Day Forecast
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
        {days.map((day, index) => (
          <div
            key={index}
            className="card bg-white/10 rounded-xl p-3 sm:p-4 text-center border border-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-105"
          >
            <div className="text-xs sm:text-sm text-white/80 mb-2 sm:mb-3 font-semibold">
              {day.date}
            </div>
            <div className="flex justify-center mb-2 sm:mb-3">
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                alt={day.description}
                className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-contain drop-shadow-lg"
              />
            </div>
            <div className="font-bold text-base sm:text-lg lg:text-xl mb-1 sm:mb-2 text-white">
              {Math.round(day.temp)}°C
            </div>
            <div className="text-xs sm:text-sm text-white/80 capitalize mb-1 sm:mb-2 font-medium">
              {day.description}
            </div>
            <div className="text-xs text-white/70 bg-white/10 rounded-full px-1 sm:px-2 py-1">
              {day.humidity}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastList;
