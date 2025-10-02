import { useState } from "react";

const SearchBar = ({ onSearch, onLocationSearch, initial }) => {
  const [city, setCity] = useState(initial || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <div className="w-full">
      <div className="card bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/20 shadow-lg">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-2 sm:gap-3"
        >
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name (e.g., London, New York, Tokyo)..."
            className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-white/30 bg-white/20 text-white placeholder-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 text-sm sm:text-base lg:text-lg"
          />
          <div className="flex gap-2 sm:gap-3">
            <button
              type="submit"
              disabled={!city.trim()}
              className="flex-1 sm:flex-none px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              🔍 Search
            </button>
            <button
              type="button"
              onClick={onLocationSearch}
              className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base"
              title="Use current location"
            >
              📍
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
