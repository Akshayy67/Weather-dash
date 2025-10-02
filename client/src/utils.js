export function kelvinToC(k) { return k - 273.15 }
export function toC(n) { return Math.round(n) + '°C' }
export function toSpeed(ms) { return Math.round(ms) + ' m/s' }

// Group 3-hourly forecast list into daily buckets and pick midday entries
export function summarizeForecast(forecastList) {
  const dailyData = {};
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!dailyData[date]) {
      dailyData[date] = {
        date: item.dt_txt.split(' ')[0],
        min: item.main.temp_min,
        max: item.main.temp_max,
        humidity: item.main.humidity,
        desc: item.weather[0].description,
        icon: item.weather[0].icon
      };
    } else {
      dailyData[date].min = Math.min(dailyData[date].min, item.main.temp_min);
      dailyData[date].max = Math.max(dailyData[date].max, item.main.temp_max);
    }
  });
  
  return Object.values(dailyData).slice(0, 5);
}

export function iconUrl(code) { return `https://openweathermap.org/img/wn/${code}@2x.png` }


