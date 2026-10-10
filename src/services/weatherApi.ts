import { WeatherData, HourlyProgressionItem, MoodType } from '../types';

export class WeatherApiService {
  static getLiveTime(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  static getSixTimingsFromNow(baseTemp: number, condition: string): HourlyProgressionItem[] {
    const now = new Date();
    const items: HourlyProgressionItem[] = [];

    const offsets = [0, 10, 20, 30, 40, 50];
    offsets.forEach((minOffset, idx) => {
      const futureTime = new Date(now.getTime() + minOffset * 60 * 1000);
      const timeStr = futureTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      const offsetStr = minOffset === 0 ? 'Now' : `+${minOffset}m`;

      // Slight temperature variance
      const tempVariance = idx === 0 ? 0 : idx <= 2 ? 0 : idx <= 4 ? -1 : -2;
      const t = baseTemp + tempVariance;

      const predictedMood: MoodType = idx <= 2 ? 'happy' : 'calm';
      const prob = idx === 0 ? 54 : idx === 1 ? 53 : idx === 2 ? 51 : idx === 3 ? 49 : idx === 4 ? 48 : 50;

      items.push({
        id: `t-live-${idx}`,
        timeLabel: timeStr,
        offsetLabel: offsetStr,
        temp: t,
        condition: minOffset === 0 ? condition : minOffset <= 20 ? 'Clear sky' : 'Gentle breeze',
        predictedMood,
        moodProbability: prob,
        weatherIcon: idx <= 2 ? 'sun' : 'cloud-sun',
      });
    });

    return items;
  }

  static async fetchLiveLocationAndWeather(): Promise<WeatherData | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;

            // 1. Get city name from fast reverse geocoding
            let city = 'Current Location';
            let state = '';
            try {
              const geoRes = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
              );
              if (geoRes.ok) {
                const geoData = await geoRes.json();
                city = geoData.city || geoData.locality || geoData.principalSubdivision || 'Local City';
                state = geoData.countryCode || '';
              }
            } catch {
              // fallback
            }

            // 2. Fetch live weather from Open-Meteo
            let temp = 28;
            let condition = 'Mostly clear';
            let humidity = 55;
            let windSpeed = 12;
            let precipitation = 0;
            let high = 34;
            let low = 23;

            try {
              const weatherRes = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
              );
              if (weatherRes.ok) {
                const wData = await weatherRes.json();
                if (wData.current) {
                  temp = Math.round(wData.current.temperature_2m);
                  humidity = Math.round(wData.current.relative_humidity_2m || 55);
                  windSpeed = Math.round(wData.current.wind_speed_10m || 12);
                  precipitation = Math.round(wData.current.precipitation || 0);

                  const code = wData.current.weather_code;
                  if (code === 0) condition = 'Clear sky';
                  else if (code <= 3) condition = 'Partly cloudy';
                  else if (code <= 65) condition = 'Rain showers';
                  else condition = 'Mostly clear';
                }
                if (wData.daily && wData.daily.temperature_2m_max) {
                  high = Math.round(wData.daily.temperature_2m_max[0]);
                  low = Math.round(wData.daily.temperature_2m_min[0]);
                }
              }
            } catch {
              // fallback
            }

            resolve({
              temp,
              condition,
              conditionIcon: 'sun',
              precipitation,
              high,
              low,
              humidity,
              windSpeed,
              aqi: 98,
              aqiStatus: 'Moderate',
              city,
              state,
              timeString: this.getLiveTime(),
            });
          } catch {
            resolve(null);
          }
        },
        () => {
          // Geolocation declined or timeout
          resolve(null);
        },
        { timeout: 7000 }
      );
    });
  }
}
