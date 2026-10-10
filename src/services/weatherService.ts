import { WeatherData, HourlyProgressionItem, MoodType } from '../types';

export class WeatherService {
  /**
   * Format current local device time in 12-hour AM/PM format
   */
  static getCurrentTimeString(date: Date = new Date()): string {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  /**
   * Format date e.g. "Tuesday, Oct 10"
   */
  static getCurrentDateString(date: Date = new Date()): string {
    return date.toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }

  /**
   * Determine mood based on weather factors
   */
  static estimateMoodFromWeather(
    temp: number,
    condition: string,
    humidity: number,
    windSpeed: number,
    aqi: number
  ): { mood: MoodType; probability: number; reason: string } {
    const isComfortableTemp = temp >= 20 && temp <= 29;
    const isCold = temp < 15;
    const isHot = temp > 33;
    const isClear = /clear|sun/i.test(condition);
    const isRain = /rain|drizzle|shower/i.test(condition);
    const isHighAQI = aqi > 120;

    if (isHighAQI && isHot) {
      return {
        mood: 'irritated',
        probability: 58,
        reason: 'High temperatures combined with poor air quality can create physical discomfort and fatigue.',
      };
    }

    if (isRain) {
      return {
        mood: 'calm',
        probability: 52,
        reason: 'Soothing rainfall and overcast light encourage introspection, quiet focus, and relaxed pacing.',
      };
    }

    if (isComfortableTemp && isClear) {
      return {
        mood: 'happy',
        probability: 56,
        reason: 'Pleasant temperatures and bright clear skies trigger serotonin release and positive outdoor drive.',
      };
    }

    if (isCold && isRain) {
      return {
        mood: 'sad',
        probability: 48,
        reason: 'Dim light, cold precipitation, and prolonged cloud cover frequently reduce energy levels.',
      };
    }

    if (isComfortableTemp) {
      return {
        mood: 'calm',
        probability: 51,
        reason: 'Mild, stable atmospheric pressure supports steady emotions and easy mental clarity.',
      };
    }

    return {
      mood: 'okay',
      probability: 49,
      reason: 'Balanced atmospheric conditions without extreme shifts promote neutral, steady focus.',
    };
  }

  /**
   * Generate 6 progression points across the next 1 hour dynamically based on current time
   */
  static generateOneHourProgression(baseWeather: WeatherData, baseDate: Date = new Date()): HourlyProgressionItem[] {
    const items: HourlyProgressionItem[] = [];
    const stepMinutes = 10;

    for (let i = 0; i < 6; i++) {
      const stepDate = new Date(baseDate.getTime() + i * stepMinutes * 60 * 1000);
      const timeLabel = this.getCurrentTimeString(stepDate);
      const offsetLabel = i === 0 ? 'Now' : `+${i * 10}m`;

      // slight realistic fluctuation
      const tempDelta = i === 0 ? 0 : Math.round(Math.sin(i * 0.8) * 1);
      const stepTemp = baseWeather.temp + tempDelta;
      const moodEst = this.estimateMoodFromWeather(
        stepTemp,
        baseWeather.condition,
        baseWeather.humidity,
        baseWeather.windSpeed,
        baseWeather.aqi
      );

      let icon: 'sun' | 'cloud-sun' | 'cloud' | 'sunset' = 'sun';
      const hours = stepDate.getHours();
      if (hours >= 17 && hours <= 19) {
        icon = 'sunset';
      } else if (/cloud/i.test(baseWeather.condition)) {
        icon = i % 2 === 0 ? 'cloud-sun' : 'cloud';
      } else {
        icon = 'sun';
      }

      items.push({
        id: `prog-${i}-${stepDate.getTime()}`,
        timeLabel,
        offsetLabel,
        temp: stepTemp,
        condition: baseWeather.condition,
        predictedMood: moodEst.mood,
        moodProbability: Math.min(88, moodEst.probability - i * 1),
        weatherIcon: icon,
      });
    }

    return items;
  }

  /**
   * Generate 24-hour day timeline for today's mood distribution of the day
   */
  static generateTodayHourlyTimeline(baseWeather: WeatherData): Array<{
    hour: number;
    hourLabel: string;
    temp: number;
    condition: string;
    mood: MoodType;
    probability: number;
    isPast: boolean;
    isCurrent: boolean;
  }> {
    const currentHour = new Date().getHours();
    const result = [];

    const hourMoodMap: Record<number, { mood: MoodType; prob: number; tempDelta: number; cond: string }> = {
      0: { mood: 'calm', prob: 58, tempDelta: -4, cond: 'Quiet Night' },
      1: { mood: 'calm', prob: 60, tempDelta: -4, cond: 'Quiet Night' },
      2: { mood: 'calm', prob: 62, tempDelta: -5, cond: 'Cool Night' },
      3: { mood: 'calm', prob: 61, tempDelta: -5, cond: 'Pre-Dawn Cool' },
      4: { mood: 'calm', prob: 59, tempDelta: -5, cond: 'Early Dawn' },
      5: { mood: 'calm', prob: 57, tempDelta: -4, cond: 'Dawn Light' },
      6: { mood: 'calm', prob: 55, tempDelta: -3, cond: 'Morning Sunrise' },
      7: { mood: 'happy', prob: 53, tempDelta: -2, cond: 'Crisp Morning' },
      8: { mood: 'happy', prob: 56, tempDelta: -1, cond: 'Sunny Morning' },
      9: { mood: 'happy', prob: 58, tempDelta: 0, cond: 'Bright Sunshine' },
      10: { mood: 'happy', prob: 60, tempDelta: 1, cond: 'Warm Clear Sky' },
      11: { mood: 'happy', prob: 58, tempDelta: 2, cond: 'Peak Sunshine' },
      12: { mood: 'okay', prob: 52, tempDelta: 3, cond: 'Midday Heat' },
      13: { mood: 'okay', prob: 50, tempDelta: 3, cond: 'Warm Afternoon' },
      14: { mood: 'okay', prob: 48, tempDelta: 2, cond: 'Sun & Breeze' },
      15: { mood: 'happy', prob: 52, tempDelta: 2, cond: 'Gentle Afternoon' },
      16: { mood: 'happy', prob: 55, tempDelta: 1, cond: 'Golden Hour' },
      17: { mood: 'happy', prob: 57, tempDelta: 0, cond: 'Pleasant Sundown' },
      18: { mood: 'calm', prob: 58, tempDelta: -1, cond: 'Twilight Glow' },
      19: { mood: 'calm', prob: 60, tempDelta: -2, cond: 'Cool Dusk' },
      20: { mood: 'calm', prob: 62, tempDelta: -2, cond: 'Clear Evening' },
      21: { mood: 'calm', prob: 64, tempDelta: -3, cond: 'Starlit Sky' },
      22: { mood: 'calm', prob: 62, tempDelta: -3, cond: 'Quiet Night' },
      23: { mood: 'calm', prob: 60, tempDelta: -4, cond: 'Night Breeze' },
    };

    for (let h = 0; h < 24; h++) {
      const data = hourMoodMap[h] || { mood: 'calm', prob: 50, tempDelta: 0, cond: 'Normal' };
      const dateH = new Date();
      dateH.setHours(h, 0, 0, 0);
      const hourLabel = dateH.toLocaleTimeString([], { hour: 'numeric', hour12: true });

      result.push({
        hour: h,
        hourLabel,
        temp: baseWeather.temp + data.tempDelta,
        condition: data.cond,
        mood: data.mood,
        probability: data.prob,
        isPast: h < currentHour,
        isCurrent: h === currentHour,
      });
    }

    return result;
  }

  /**
   * Calculate Today's Mood Distribution of the Day (in percentages)
   */
  static calculateTodayMoodDistribution(baseWeather: WeatherData): {
    happy: number;
    calm: number;
    okay: number;
    sad: number;
    irritated: number;
    totalHours: number;
    dominantMood: MoodType;
  } {
    const timeline = this.generateTodayHourlyTimeline(baseWeather);
    const counts: Record<MoodType, number> = {
      happy: 0,
      calm: 0,
      okay: 0,
      sad: 0,
      irritated: 0,
    };

    timeline.forEach((item) => {
      counts[item.mood] = (counts[item.mood] || 0) + 1;
    });

    const total = timeline.length; // 24 hours
    const happyPct = Math.round((counts.happy / total) * 100);
    const calmPct = Math.round((counts.calm / total) * 100);
    const okayPct = Math.round((counts.okay / total) * 100);
    const sadPct = Math.round((counts.sad / total) * 100);
    const irritatedPct = Math.max(0, 100 - (happyPct + calmPct + okayPct + sadPct));

    const entries: [MoodType, number][] = [
      ['happy', happyPct],
      ['calm', calmPct],
      ['okay', okayPct],
      ['sad', sadPct],
      ['irritated', irritatedPct],
    ];

    entries.sort((a, b) => b[1] - a[1]);
    const dominantMood = entries[0][0];

    return {
      happy: happyPct,
      calm: calmPct,
      okay: okayPct,
      sad: sadPct,
      irritated: irritatedPct,
      totalHours: total,
      dominantMood,
    };
  }

  /**
   * Real browser Geolocation detection with reverse geocoding and real weather fallback
   */
  static async detectUserLocation(): Promise<{
    city: string;
    state: string;
    temp?: number;
    condition?: string;
    humidity?: number;
    windSpeed?: number;
  }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Free client reverse geocoding with no API key
            const res = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            if (!res.ok) throw new Error('Reverse geocoding failed');
            const data = await res.json();
            const city = data.city || data.locality || data.principalSubdivision || 'Local City';
            const state = data.principalSubdivisionCode || data.countryCode || '';

            // Optional: Fetch live open-meteo weather
            let liveTemp: number | undefined;
            let liveCond: string | undefined;
            let liveHum: number | undefined;
            let liveWind: number | undefined;

            try {
              const meteoRes = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
              );
              if (meteoRes.ok) {
                const meteoData = await meteoRes.json();
                if (meteoData.current) {
                  liveTemp = Math.round(meteoData.current.temperature_2m);
                  liveHum = Math.round(meteoData.current.relative_humidity_2m);
                  liveWind = Math.round(meteoData.current.wind_speed_10m);
                  const code = meteoData.current.weather_code;
                  if (code === 0) liveCond = 'Clear sky';
                  else if (code <= 3) liveCond = 'Partly cloudy';
                  else if (code >= 51 && code <= 67) liveCond = 'Rain showers';
                  else if (code >= 71) liveCond = 'Snow';
                  else liveCond = 'Mostly clear';
                }
              }
            } catch {
              // fallback is fine
            }

            resolve({
              city,
              state,
              temp: liveTemp,
              condition: liveCond,
              humidity: liveHum,
              windSpeed: liveWind,
            });
          } catch {
            // If reverse geocoding network fails, return fallback
            resolve({
              city: 'Detected Location',
              state: 'Local',
            });
          }
        },
        (error) => {
          reject(error);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  }

  /**
   * Predict Human Behavioral Changes Under Heat Conditions
   * Models the physiological & neurobehavioral impact of thermal stress, heat index, and mugginess.
   */
  static calculateHeatBehavioralImpact(temp: number, humidity: number): {
    heatIndex: number;
    stressCategory: 'Comfortable' | 'Caution' | 'Extreme Caution' | 'Danger' | 'Severe Danger';
    irritabilityRisk: number;
    cognitiveFatigueRisk: number;
    calmProbability: number;
    primaryBehavior: string;
    physiologicalDrivers: string[];
    mitigationTip: string;
  } {
    // Simplified Rothfusz approximation for Heat Index
    const T = (temp * 9) / 5 + 32; // convert to Fahrenheit
    const R = humidity;
    let HI_F = 0.5 * (T + 61.0 + (T - 68.0) * 1.2 + R * 0.094);

    if (HI_F >= 80) {
      HI_F =
        -42.379 +
        2.04901523 * T +
        10.14333127 * R -
        0.22475541 * T * R -
        0.00683783 * T * T -
        0.05481717 * R * R +
        0.00122874 * T * T * R +
        0.00085282 * T * R * R -
        0.00000199 * T * T * R * R;
    }

    const heatIndexC = Math.round(((HI_F - 32) * 5) / 9);

    if (temp >= 38 || heatIndexC >= 42) {
      return {
        heatIndex: heatIndexC,
        stressCategory: 'Severe Danger',
        irritabilityRisk: 72,
        cognitiveFatigueRisk: 84,
        calmProbability: 8,
        primaryBehavior: 'High Agitation & Lethargy: Impaired cognitive processing, acute impatience, and social withdrawal.',
        physiologicalDrivers: [
          'High cortisol & adrenaline output triggered by hyperthermic strain',
          'Severe sleep disruption from elevated core nighttime temperatures',
          'Vasodilation reducing blood flow efficiency to prefrontal cortex'
        ],
        mitigationTip: 'Seek conditioned air, aggressive hydration, and postpone complex mental negotiations.'
      };
    }

    if (temp >= 33 || heatIndexC >= 36) {
      return {
        heatIndex: heatIndexC,
        stressCategory: 'Extreme Caution',
        irritabilityRisk: 58,
        cognitiveFatigueRisk: 66,
        calmProbability: 18,
        primaryBehavior: 'Restlessness & Short Temper: Noticeable drop in patience, increased frustration under delays.',
        physiologicalDrivers: [
          'Elevated sympathetic nervous arousal due to continuous sweating & thermal discomfort',
          'Dehydration-linked neurotransmitter deceleration',
          'Circadian phase delay reducing restorative REM sleep'
        ],
        mitigationTip: 'Hydrate every 45 mins, reduce afternoon screen strain, and practice cooled breathwork.'
      };
    }

    if (temp >= 28 || heatIndexC >= 30) {
      return {
        heatIndex: heatIndexC,
        stressCategory: 'Caution',
        irritabilityRisk: 34,
        cognitiveFatigueRisk: 42,
        calmProbability: 40,
        primaryBehavior: 'Mild Slump & Distractibility: Moderate energy dips during peak solar hours, slight sensory overload.',
        physiologicalDrivers: [
          'Mild fluid loss inducing sluggish cognitive reflex',
          'Skin blood pooling causing slight afternoon drowsing'
        ],
        mitigationTip: 'Drink cold water with electrolytes, take shaded 5-minute pauses.'
      };
    }

    return {
      heatIndex: heatIndexC,
      stressCategory: 'Comfortable',
      irritabilityRisk: 12,
      cognitiveFatigueRisk: 18,
      calmProbability: 68,
      primaryBehavior: 'Optimal Homeostasis: Stable mood, high patience reserves, and balanced social interactions.',
      physiologicalDrivers: [
        'Balanced autonomic nervous system function',
        'Neutral thermoregulatory energy expenditure'
      ],
      mitigationTip: 'Enjoy outdoor activities or deep focus sessions during this thermal sweet spot.'
    };
  }
}
