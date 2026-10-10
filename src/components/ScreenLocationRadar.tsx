import React, { useState } from 'react';
import { WeatherData } from '../types';
import { WeatherService } from '../services/weatherService';
import { CuteMascot } from './CuteMascot';
import { 
  ArrowLeft, 
  MapPin, 
  Navigation, 
  Compass, 
  Wind, 
  Droplets, 
  Sun, 
  Cloud, 
  ShieldAlert, 
  Check, 
  RefreshCw,
  Sparkles,
  Thermometer,
  Leaf
} from 'lucide-react';

interface ScreenLocationRadarProps {
  weather: WeatherData;
  onBack: () => void;
  onUpdateWeather: (newWeather: WeatherData) => void;
}

const PRESET_CITIES = [
  { city: 'Hyderabad', state: 'TG', temp: 28, condition: 'Mostly clear', humidity: 55, wind: 12, aqi: 103, aqiStatus: 'Poor' as const },
  { city: 'Tokyo', state: 'JP', temp: 21, condition: 'Mild Sunshine', humidity: 48, wind: 9, aqi: 35, aqiStatus: 'Good' as const },
  { city: 'London', state: 'UK', temp: 16, condition: 'Overcast & Drizzle', humidity: 78, wind: 18, aqi: 28, aqiStatus: 'Good' as const },
  { city: 'New York', state: 'US', temp: 23, condition: 'Clear Autumn Sky', humidity: 45, wind: 14, aqi: 42, aqiStatus: 'Good' as const },
  { city: 'Paris', state: 'FR', temp: 19, condition: 'Gentle Breeze', humidity: 58, wind: 11, aqi: 39, aqiStatus: 'Good' as const },
  { city: 'Singapore', state: 'SG', temp: 31, condition: 'Tropical Clouds', humidity: 82, wind: 10, aqi: 55, aqiStatus: 'Moderate' as const },
];

export const ScreenLocationRadar: React.FC<ScreenLocationRadarProps> = ({
  weather,
  onBack,
  onUpdateWeather,
}) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectStatus, setDetectStatus] = useState<string | null>(null);
  const [manualCity, setManualCity] = useState('');

  const handleDetectGPS = async () => {
    setIsDetecting(true);
    setDetectStatus('Requesting GPS permission from device...');

    try {
      const loc = await WeatherService.detectUserLocation();
      const updated: WeatherData = {
        ...weather,
        city: loc.city,
        state: loc.state,
        temp: loc.temp ?? weather.temp,
        condition: loc.condition ?? weather.condition,
        humidity: loc.humidity ?? weather.humidity,
        windSpeed: loc.windSpeed ?? weather.windSpeed,
        timeString: WeatherService.getCurrentTimeString(),
      };

      onUpdateWeather(updated);
      setDetectStatus(`Detected: ${loc.city}, ${loc.state}`);
      setTimeout(() => setDetectStatus(null), 4000);
    } catch (err: any) {
      setDetectStatus(err.message || 'Unable to detect location. Please grant location access.');
      setTimeout(() => setDetectStatus(null), 5000);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSelectPreset = (p: typeof PRESET_CITIES[0]) => {
    const updated: WeatherData = {
      ...weather,
      city: p.city,
      state: p.state,
      temp: p.temp,
      condition: p.condition,
      humidity: p.humidity,
      windSpeed: p.wind,
      aqi: p.aqi,
      aqiStatus: p.aqiStatus,
      timeString: WeatherService.getCurrentTimeString(),
    };
    onUpdateWeather(updated);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCity.trim()) return;

    const updated: WeatherData = {
      ...weather,
      city: manualCity.trim(),
      state: 'Custom',
      timeString: WeatherService.getCurrentTimeString(),
    };
    onUpdateWeather(updated);
    setManualCity('');
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#E0F2FE] via-[#F8FAFC] to-[#F1F5F9] text-slate-800 pb-24 select-none">
      <div className="px-5 pt-4">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={onBack}
            className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-white/80 transition-all flex items-center gap-1"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs font-semibold">Back</span>
          </button>
          <div className="text-center">
            <h2 className="text-base font-extrabold text-slate-800 font-heading">
              Location &amp; Weather Radar
            </h2>
            <div className="text-[10px] text-slate-400 font-medium">
              Live Atmosphere &amp; Biometrics
            </div>
          </div>
          <CuteMascot size="sm" className="w-8 h-7" />
        </div>

        {/* Current Active Location Card */}
        <div className="bg-white border border-indigo-200/90 rounded-3xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  Active Coordinates
                </div>
                <h3 className="text-lg font-black text-slate-800 font-heading leading-tight">
                  {weather.city}, {weather.state}
                </h3>
                <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                  Synchronized with local device time: <strong>{weather.timeString}</strong>
                </div>
              </div>
            </div>

            <span className="text-2xl font-black text-slate-800">
              {weather.temp}°C
            </span>
          </div>

          {/* Detect Location Button */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleDetectGPS}
              disabled={isDetecting}
              className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {isDetecting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Detecting GPS Location...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  <span>Detect My Current Location (GPS)</span>
                </>
              )}
            </button>

            {detectStatus && (
              <div className="text-center text-[11px] font-semibold text-indigo-700 bg-indigo-50/80 py-1.5 px-3 rounded-xl border border-indigo-200">
                {detectStatus}
              </div>
            )}
          </div>
        </div>

        {/* Real Atmospheric Radar Breakdown */}
        <div className="mt-4">
          <div className="text-xs font-bold text-slate-700 mb-2.5 px-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              <span>Atmospheric Radar Factors</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Impact on Serotonin &amp; Mood
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Humidity */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] text-sky-600 font-semibold mb-1">
                <span className="flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>Humidity</span>
                </span>
                <span className="text-slate-400">{weather.humidity > 60 ? 'High' : 'Optimal'}</span>
              </div>
              <div className="text-base font-extrabold text-slate-800">
                {weather.humidity}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Ideal range 40–60% for focus
              </div>
            </div>

            {/* Wind */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] text-indigo-600 font-semibold mb-1">
                <span className="flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5" />
                  <span>Wind Speed</span>
                </span>
                <span className="text-slate-400">Light</span>
              </div>
              <div className="text-base font-extrabold text-slate-800">
                {weather.windSpeed} km/h
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Gentle air flow promotes calmness
              </div>
            </div>

            {/* Air Quality AQI */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] text-emerald-600 font-semibold mb-1">
                <span className="flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5" />
                  <span>Air Quality</span>
                </span>
                <span className="text-[10px] font-bold text-amber-600">{weather.aqiStatus}</span>
              </div>
              <div className="text-base font-extrabold text-slate-800">
                {weather.aqi} AQI
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Particulate matter influence
              </div>
            </div>

            {/* Solar Index */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] text-amber-600 font-semibold mb-1">
                <span className="flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5" />
                  <span>Sunlight Index</span>
                </span>
                <span className="text-slate-400">Moderate</span>
              </div>
              <div className="text-base font-extrabold text-slate-800">
                UV 5.2
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Promotes daytime mood elevation
              </div>
            </div>
          </div>
        </div>

        {/* Quick City Presets */}
        <div className="mt-4">
          <div className="text-xs font-bold text-slate-700 mb-2 px-1">
            Test Different City Climates
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {PRESET_CITIES.map((p) => {
              const isSelected = weather.city === p.city;
              return (
                <button
                  key={p.city}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`shrink-0 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200/80 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span>{p.city}</span>
                    <span className="text-[10px] opacity-75">{p.temp}°C</span>
                  </div>
                  <div className={`text-[9px] font-normal ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {p.condition}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Manual City Form */}
        <form onSubmit={handleManualSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            value={manualCity}
            onChange={(e) => setManualCity(e.target.value)}
            placeholder="Type any city or town name..."
            className="flex-1 bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold shadow-2xs transition-all shrink-0"
          >
            Set City
          </button>
        </form>
      </div>
    </div>
  );
};
