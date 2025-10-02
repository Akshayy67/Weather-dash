const API_BASE = import.meta.env.VITE_USE_PROXY === "true" 
  ? `${import.meta.env.VITE_PROXY_BASE || ""}/api`
  : "https://api.openweathermap.org/data/2.5";

const API_KEY = import.meta.env.VITE_OWM_API_KEY;

export async function fetchCurrent(city) {
  const useProxy = import.meta.env.VITE_USE_PROXY === "true";
  
  let url;
  if (useProxy) {
    url = `${API_BASE}/weather/${encodeURIComponent(city)}`;
  } else {
    url = `${API_BASE}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  }

  const response = await fetch(url);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("City not found");
    }
    throw new Error("Failed to fetch weather data");
  }
  
  return response.json();
}

export async function fetchForecast(city) {
  const useProxy = import.meta.env.VITE_USE_PROXY === "true";
  
  let url;
  if (useProxy) {
    url = `${API_BASE}/forecast/${encodeURIComponent(city)}`;
  } else {
    url = `${API_BASE}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  }

  const response = await fetch(url);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("City not found");
    }
    throw new Error("Failed to fetch forecast data");
  }
  
  return response.json();
}


