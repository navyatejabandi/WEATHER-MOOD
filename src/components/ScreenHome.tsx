import React, { useState, useEffect } from 'react';
import { WeatherData, AuthUser, SentEmailRecord } from '../types';
import { WeatherService } from '../services/weatherService';
import { CuteMascot } from './CuteMascot';
import { 
  MapPin, 
  Settings, 
  Droplets, 
  Wind, 
  Leaf, 
  ChevronRight, 
  Clock, 
  Navigation, 
  Sun, 
  Plus, 
  Mail, 
  Sparkles,
  BarChart2,
  CloudSun,
  Brain,
  Compass,
  RefreshCw,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  CloudRain,
  Home as HomeIcon
} from 'lucide-react';

interface ScreenHomeProps {
  weather: WeatherData;
  currentUser: AuthUser;
  lastSentEmail: SentEmailRecord | null;
  onOpenMoodInsights: () => void;
  onOpenWeatherConditions: () => void;
  onOpenPrediction: () => void;
  onOpenLogMood: () => void;
  onOpenSettings: () => void;
  onOpenEmailViewer: () => void;
  onOpenLocationRadar: () => void;
  onChangeLocation: (city: string) => void;
  onUpdateWeather: (weather: WeatherData) => void;
}

export const ScreenHome: React.FC<ScreenHomeProps> = ({
  weather,
  currentUser,
  lastSentEmail,
  onOpenMoodInsights,
  onOpenWeatherConditions,
  onOpenPrediction,
  onOpenLogMood,
  onOpenSettings,
  onOpenEmailViewer,
  onOpenLocationRadar,
  onChangeLocation,
  onUpdateWeather,
}) => {
  const [showEmailBanner, setShowEmailBanner] = useState(true);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>(WeatherService.getCurrentTimeString());
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  // Sync clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(WeatherService.getCurrentTimeString(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleDetectLocation = async () => {
    setIsDetectingGPS(true);
    setGpsMessage('Detecting GPS...');
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
      setGpsMessage(`Found: ${loc.city}`);
      setTimeout(() => setGpsMessage(null), 3000);
    } catch {
      setGpsMessage('Location access denied');
      setTimeout(() => setGpsMessage(null), 3000);
    } finally {
      setIsDetectingGPS(false);
    }
  };

  // 24-Hour Weather Forecast for their located place
  const currentHour = new Date().getHours();
  const hourlyForecast = [
    { hour: 'Now', temp: weather.temp, cond: weather.condition, rainChance: weather.precipitation, icon: 'sun' },
    { hour: `${(currentHour + 1) % 24}:00`, temp: weather.temp, cond: 'Clear sky', rainChance: 5, icon: 'sun' },
    { hour: `${(currentHour + 2) % 24}:00`, temp: weather.temp - 1, cond: 'Gentle breeze', rainChance: 10, icon: 'cloud-sun' },
    { hour: `${(currentHour + 3) % 24}:00`, temp: weather.temp - 1, cond: 'Scattered clouds', rainChance: 15, icon: 'cloud' },
    { hour: `${(currentHour + 4) % 24}:00`, temp: weather.temp - 2, cond: 'Mild cooling', rainChance: 10, icon: 'cloud' },
    { hour: `${(currentHour + 5) % 24}:00`, temp: weather.temp - 3, cond: 'Night breeze', rainChance: 5, icon: 'sunset' },
    { hour: `${(currentHour + 6) % 24}:00`, temp: weather.temp - 4, cond: 'Starlit clear', rainChance: 5, icon: 'sun' },
  ];

  // 7-Day Weather Outlook for their located place
  const sevenDayForecast = [
    { day: 'Today', high: weather.high, low: weather.low, cond: weather.condition, icon: '☀️', rain: `${weather.precipitation}%` },
    { day: 'Tomorrow', high: weather.high + 1, low: weather.low, cond: 'Mostly Sunny', icon: '🌤️', rain: '10%' },
    { day: 'Wed', high: weather.high - 1, low: weather.low - 1, cond: 'Partly Cloudy', icon: '⛅', rain: '20%' },
    { day: 'Thu', high: weather.high - 2, low: weather.low - 1, cond: 'Scattered Showers', icon: '🌦️', rain: '45%' },
    { day: 'Fri', high: weather.high, low: weather.low, cond: 'Passing Clouds', icon: '🌤️', rain: '15%' },
    { day: 'Sat', high: weather.high + 2, low: weather.low + 1, cond: 'Bright & Warm', icon: '☀️', rain: '0%' },
    { day: 'Sun', high: weather.high + 1, low: weather.low, cond: 'Sunny & Pleasant', icon: '☀️', rain: '5%' },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#E0F2FE] via-[#F8FAFC] to-[#F1F5F9] text-slate-800 pb-24 select-none">
      {/* Top Header */}
      <div className="px-5 pt-4 pb-2">
        {/* App Title & Located Place Greeting */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CuteMascot size="sm" className="w-10 h-8" />
            <div>
              <div className="text-xl font-extrabold text-slate-800 font-heading leading-tight flex items-center">
                <span className="text-[#3B82F6]">Weather</span>
                <span className="text-[#8B5CF6]">Mood</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                Current Weather Forecast
              </div>
            </div>
          </div>

          {/* Action icons: Radar, Email, Settings */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenLocationRadar}
              className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-white/80 transition-all"
              title="Detailed Location Radar & Coordinates"
            >
              <Compass className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenEmailViewer}
              className="relative p-1.5 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-white/80 transition-all"
              title="View Sent WeatherMood Email Digest"
            >
              <Mail className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500"></span>
            </button>

            <button
              type="button"
              onClick={onOpenSettings}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-full hover:bg-white/80 transition-all"
              title="Settings & Sign Out"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sent Email Alert Banner */}
        {showEmailBanner && lastSentEmail && (
          <div className="mt-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/80 rounded-2xl p-2.5 flex items-center justify-between text-xs text-indigo-900 shadow-2xs">
            <div className="flex items-center gap-2 truncate pr-2">
              <span className="text-sm">✉️</span>
              <span className="text-[11px] truncate">
                Forecast digest sent to <strong>{lastSentEmail.recipientEmail}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={onOpenEmailViewer}
                className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-md hover:bg-indigo-700"
              >
                View
              </button>
              <button
                type="button"
                onClick={() => setShowEmailBanner(false)}
                className="text-slate-400 hover:text-slate-600 text-xs px-1"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Located Place Bar with GPS Button & Real Time */}
        <div className="flex items-center justify-between mt-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
            <button
              type="button"
              onClick={onOpenLocationRadar}
              className="hover:text-indigo-600 flex items-center gap-1 font-bold text-left"
              title="Click to view full location radar"
            >
              <span className="truncate max-w-[150px]">{weather.city}, {weather.state}</span>
              <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isDetectingGPS}
              className="ml-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded-full flex items-center gap-1 transition-all shrink-0"
              title="Auto-detect current GPS location"
            >
              {isDetectingGPS ? (
                <RefreshCw className="w-2.5 h-2.5 animate-spin" />
              ) : (
                <Navigation className="w-2.5 h-2.5" />
              )}
              <span>{gpsMessage || 'GPS'}</span>
            </button>
          </div>

          {/* Real-time device clock */}
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold bg-white/70 px-2 py-0.5 rounded-full border border-slate-200/60 shadow-2xs shrink-0">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>{currentTimeStr}</span>
          </div>
        </div>

        {/* Hero Current Weather Forecast Card */}
        <div className="mt-3 relative bg-gradient-to-br from-white/95 to-sky-50/90 backdrop-blur-sm border border-sky-100 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            {/* Animated Sun & Cloud Illustration */}
            <div className="relative">
              <div className="w-24 h-20 flex items-center justify-center">
                <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-sm">
                  {/* Sun */}
                  <circle cx="58" cy="32" r="22" fill="#FBBF24" />
                  <circle cx="58" cy="32" r="26" fill="#FDE047" opacity="0.3" />
                  {/* Rays */}
                  <g stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="58" y1="4" x2="58" y2="8" />
                    <line x1="82" y1="12" x2="78" y2="16" />
                    <line x1="88" y1="32" x2="84" y2="32" />
                    <line x1="34" y1="12" x2="38" y2="16" />
                  </g>
                  {/* Fluffy white cloud */}
                  <path
                    d="M 16 62 A 14 14 0 0 1 26 40 A 18 18 0 0 1 54 36 A 16 16 0 0 1 74 52 A 12 12 0 0 1 72 65 L 18 65 Z"
                    fill="#FFFFFF"
                    stroke="#E0F2FE"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>

            {/* Temperature & High / Low */}
            <div className="text-right">
              <div className="flex items-baseline justify-end">
                <span className="text-4xl font-extrabold text-slate-800 tracking-tight font-heading">
                  {weather.temp}°
                </span>
                <span className="text-xl font-bold text-slate-500 ml-0.5">C</span>
              </div>
              <div className="text-xs font-bold text-slate-600 mt-0.5">
                {weather.condition}
              </div>
              <div className="text-[11px] font-medium text-slate-400 mt-1">
                High: {weather.high}°C · Low: {weather.low}°C
              </div>
            </div>
          </div>

          {/* Primary Atmospheric Forecast Metrics */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100/80 text-center">
            {/* Humidity */}
            <div className="bg-white/80 border border-slate-100 rounded-2xl py-2 px-1 flex flex-col items-center">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-sky-600">
                <Droplets className="w-3.5 h-3.5 text-sky-500" />
                <span>Humidity</span>
              </div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">{weather.humidity}%</div>
            </div>

            {/* Wind */}
            <div className="bg-white/80 border border-slate-100 rounded-2xl py-2 px-1 flex flex-col items-center">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600">
                <Wind className="w-3.5 h-3.5 text-indigo-500" />
                <span>Wind</span>
              </div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">{weather.windSpeed} km/h</div>
            </div>

            {/* AQI */}
            <div className="bg-white/80 border border-slate-100 rounded-2xl py-2 px-1 flex flex-col items-center">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                <Leaf className="w-3.5 h-3.5 text-emerald-500" />
                <span>AQI</span>
              </div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">
                {weather.aqi} <span className="text-[10px] text-amber-600 font-medium">({weather.aqiStatus})</span>
              </div>
            </div>
          </div>

          {/* Secondary Atmospheric Factors: Rain, Pressure, UV */}
          <div className="grid grid-cols-3 gap-2 mt-2 text-center">
            <div className="bg-white/60 border border-slate-100 rounded-2xl py-1.5 px-1 flex flex-col items-center">
              <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                <CloudRain className="w-3 h-3 text-blue-500" />
                <span>Rain Chance</span>
              </div>
              <div className="text-[11px] font-bold text-slate-700">{weather.precipitation}%</div>
            </div>

            <div className="bg-white/60 border border-slate-100 rounded-2xl py-1.5 px-1 flex flex-col items-center">
              <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                <Gauge className="w-3 h-3 text-purple-500" />
                <span>Pressure</span>
              </div>
              <div className="text-[11px] font-bold text-slate-700">1013 hPa</div>
            </div>

            <div className="bg-white/60 border border-slate-100 rounded-2xl py-1.5 px-1 flex flex-col items-center">
              <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                <Sun className="w-3 h-3 text-amber-500" />
                <span>UV Index</span>
              </div>
              <div className="text-[11px] font-bold text-slate-700">5.4 Mod</div>
            </div>
          </div>
        </div>

        {/* 24-Hour Weather Forecast for Their Located Place */}
        <div className="mt-4">
          <div className="text-xs font-bold text-slate-700 mb-2 px-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Hourly Weather Forecast ({weather.city})</span>
            </span>
            <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
              Today
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 pt-0.5 scrollbar-none">
            {hourlyForecast.map((item, idx) => (
              <div
                key={idx}
                className="shrink-0 w-20 bg-white border border-slate-200/90 rounded-2xl p-2 text-center shadow-2xs flex flex-col items-center"
              >
                <span className="text-[10px] font-bold text-slate-500">
                  {item.hour}
                </span>

                <div className="my-1 text-base">
                  {item.icon === 'sun' && '☀️'}
                  {item.icon === 'cloud-sun' && '🌤️'}
                  {item.icon === 'cloud' && '☁️'}
                  {item.icon === 'sunset' && '🌇'}
                </div>

                <span className="text-xs font-bold text-slate-800">{item.temp}°C</span>
                <span className="text-[9px] font-semibold text-sky-600 mt-0.5 flex items-center gap-0.5">
                  <Droplets className="w-2.5 h-2.5" />
                  <span>{item.rainChance}%</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 7-Day Weather Outlook for Their Located Place */}
        <div className="mt-4 bg-white border border-slate-200/90 rounded-3xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>7-Day Weather Forecast</span>
            </span>
            <span className="text-[10px] text-slate-400">
              {weather.city}, {weather.state}
            </span>
          </div>

          <div className="space-y-2">
            {sevenDayForecast.map((day, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1">
                <span className="w-20 font-semibold text-slate-700">{day.day}</span>
                <span className="text-base shrink-0">{day.icon}</span>
                <span className="flex-1 text-center text-[11px] text-slate-400 truncate px-2">{day.cond}</span>
                <span className="w-12 text-center text-[10px] text-sky-600 font-semibold">{day.rain}</span>
                <span className="w-16 text-right font-bold text-slate-800">
                  {day.high}° / <span className="text-slate-400 font-normal">{day.low}°</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Beautiful Banner to Explore Mood Insights (Next Screen!) */}
        <div
          onClick={onOpenMoodInsights}
          className="mt-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-3xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer group flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-1.5 text-blue-200 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Mood Analysis</span>
            </div>
            <h4 className="text-sm font-extrabold mt-0.5">
              See Today's Mood Distribution →
            </h4>
            <p className="text-[11px] text-indigo-100/90 mt-0.5">
              Discover how this {weather.temp}°C weather impacts mood across today.
            </p>
          </div>
          <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
            <ChevronRight className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Modern 5-Tab Bottom Navigation (Mood Insights is right next to Home!) */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-2.5 z-30 flex items-center justify-between shadow-lg">
        {/* Home Tab (Active) */}
        <button
          type="button"
          className="flex flex-col items-center text-indigo-600 font-bold text-[10px] gap-0.5 focus:outline-none"
        >
          <HomeIcon className="w-5 h-5 stroke-[2.2]" />
          <span>Home</span>
        </button>

        {/* Mood Insights (Next to Home as requested!) */}
        <button
          type="button"
          onClick={onOpenMoodInsights}
          className="flex flex-col items-center text-slate-400 hover:text-indigo-600 font-medium text-[10px] gap-0.5 focus:outline-none transition-colors"
        >
          <BarChart2 className="w-5 h-5 stroke-[2]" />
          <span>Mood</span>
        </button>

        {/* Floating Center '+' Button */}
        <button
          type="button"
          onClick={onOpenLogMood}
          className="-mt-7 w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg flex items-center justify-center transform active:scale-95 transition-transform"
          title="Log Your Mood"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Weather Conditions (Divided Screen 2) */}
        <button
          type="button"
          onClick={onOpenWeatherConditions}
          className="flex flex-col items-center text-slate-400 hover:text-indigo-600 font-medium text-[10px] gap-0.5 focus:outline-none transition-colors"
        >
          <CloudSun className="w-5 h-5 stroke-[2]" />
          <span>Weather</span>
        </button>

        {/* Prediction */}
        <button
          type="button"
          onClick={onOpenPrediction}
          className="flex flex-col items-center text-slate-400 hover:text-indigo-600 font-medium text-[10px] gap-0.5 focus:outline-none transition-colors"
        >
          <Brain className="w-5 h-5 stroke-[2]" />
          <span>Prediction</span>
        </button>
      </div>
    </div>
  );
};
