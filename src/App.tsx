import React, { useState, useEffect } from 'react';
import { ScreenName, WeatherData, AuthUser, SentEmailRecord } from './types';
import { INITIAL_WEATHER, AppStore } from './services/store';
import { EmailService } from './services/emailService';
import { WeatherService } from './services/weatherService';
import { ScreenLogin } from './components/ScreenLogin';
import { ScreenHome } from './components/ScreenHome';
import { ScreenMoodInsights } from './components/ScreenMoodInsights';
import { ScreenWeatherConditions } from './components/ScreenWeatherConditions';
import { ScreenPrediction } from './components/ScreenPrediction';
import { ScreenLogMood } from './components/ScreenLogMood';
import { ScreenLocationRadar } from './components/ScreenLocationRadar';
import { SettingsModal } from './components/SettingsModal';
import { EmailViewerModal } from './components/EmailViewerModal';

export default function App() {
  // Website is strictly locked by default on load
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('HOME');
  const [weather, setWeather] = useState<WeatherData>(INITIAL_WEATHER);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [lastSentEmail, setLastSentEmail] = useState<SentEmailRecord | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Sync real-time device clock on mount and periodically
  useEffect(() => {
    const syncTime = () => {
      const realTime = WeatherService.getCurrentTimeString();
      setWeather((prev) => ({
        ...prev,
        timeString: realTime,
      }));
    };
    syncTime();
    const timer = setInterval(syncTime, 15000);
    return () => clearInterval(timer);
  }, []);

  // Try silent background detection for current user location if browser permits
  useEffect(() => {
    if (navigator.geolocation) {
      WeatherService.detectUserLocation()
        .then((loc) => {
          setWeather((prev) => ({
            ...prev,
            city: loc.city,
            state: loc.state,
            temp: loc.temp ?? prev.temp,
            condition: loc.condition ?? prev.condition,
            humidity: loc.humidity ?? prev.humidity,
            windSpeed: loc.windSpeed ?? prev.windSpeed,
            timeString: WeatherService.getCurrentTimeString(),
          }));
        })
        .catch(() => {
          // Graceful fallback
        });
    }
  }, []);

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    // Send automated weather-based mood email report upon login
    const sent = EmailService.sendLoginMoodReport(user, weather);
    setLastSentEmail(sent);
    setCurrentScreen('HOME');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    AppStore.setStoredUser(null);
    setCurrentScreen('HOME');
  };

  const handleCityChange = (newCity: string) => {
    setWeather((prev) => ({
      ...prev,
      city: newCity,
    }));
  };

  const handleUpdateWeather = (newWeather: WeatherData) => {
    setWeather(newWeather);
  };

  const handleResetData = () => {
    localStorage.clear();
    setWeather(INITIAL_WEATHER);
    setCurrentUser(null);
    setCurrentScreen('HOME');
  };

  const handleResendEmail = () => {
    if (currentUser) {
      const sent = EmailService.sendLoginMoodReport(currentUser, weather);
      setLastSentEmail(sent);
    }
  };

  // 1. Website completely locked until authentication succeeds
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-0 select-none">
        <div className="w-full max-w-md min-h-screen bg-white shadow-2xl relative overflow-hidden flex flex-col">
          <ScreenLogin onLoginSuccess={handleLoginSuccess} />
        </div>
      </div>
    );
  }

  // 2. Logged-in screens
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-0 select-none">
      <div className="w-full max-w-md min-h-screen bg-white shadow-2xl relative overflow-hidden flex flex-col">
        {/* Screen 1: Home — Current Weather Forecast of their located place */}
        {currentScreen === 'HOME' && (
          <ScreenHome
            weather={weather}
            currentUser={currentUser}
            lastSentEmail={lastSentEmail}
            onOpenMoodInsights={() => setCurrentScreen('MOOD_INSIGHTS')}
            onOpenWeatherConditions={() => setCurrentScreen('WEATHER_CONDITIONS')}
            onOpenPrediction={() => setCurrentScreen('PREDICTION')}
            onOpenLogMood={() => setCurrentScreen('LOG_MOOD')}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenEmailViewer={() => setShowEmailModal(true)}
            onOpenLocationRadar={() => setCurrentScreen('LOCATION_RADAR')}
            onChangeLocation={handleCityChange}
            onUpdateWeather={handleUpdateWeather}
          />
        )}

        {/* Screen 2: Mood Insights — Today's Mood Distribution of the Day (Placed next to Home!) */}
        {currentScreen === 'MOOD_INSIGHTS' && (
          <ScreenMoodInsights
            weather={weather}
            onOpenHome={() => setCurrentScreen('HOME')}
            onOpenWeatherConditions={() => setCurrentScreen('WEATHER_CONDITIONS')}
            onOpenPrediction={() => setCurrentScreen('PREDICTION')}
            onOpenLogMood={() => setCurrentScreen('LOG_MOOD')}
          />
        )}

        {/* Screen 3: Weather Conditions Impact — Mood under Sunny/Cloudy/Rainy & Statistical Influence */}
        {currentScreen === 'WEATHER_CONDITIONS' && (
          <ScreenWeatherConditions
            weather={weather}
            onOpenHome={() => setCurrentScreen('HOME')}
            onOpenMoodInsights={() => setCurrentScreen('MOOD_INSIGHTS')}
            onOpenPrediction={() => setCurrentScreen('PREDICTION')}
            onOpenLogMood={() => setCurrentScreen('LOG_MOOD')}
          />
        )}

        {/* Screen 4: Prediction — ML Probabilities, Similar Days, Model Evaluation */}
        {currentScreen === 'PREDICTION' && (
          <ScreenPrediction
            weather={weather}
            onBack={() => setCurrentScreen('HOME')}
            onOpenHome={() => setCurrentScreen('HOME')}
            onOpenLogMood={() => setCurrentScreen('LOG_MOOD')}
            onOpenMoodInsights={() => setCurrentScreen('MOOD_INSIGHTS')}
            onOpenWeatherConditions={() => setCurrentScreen('WEATHER_CONDITIONS')}
          />
        )}

        {/* Screen 5: Log Mood (+) — Optional Feedback with Weather Snapshot */}
        {currentScreen === 'LOG_MOOD' && (
          <ScreenLogMood
            weather={weather}
            onBack={() => setCurrentScreen('HOME')}
            onOpenInsights={() => setCurrentScreen('MOOD_INSIGHTS')}
            onOpenPrediction={() => setCurrentScreen('PREDICTION')}
          />
        )}

        {/* Screen 6: Detailed Location Radar & GPS */}
        {currentScreen === 'LOCATION_RADAR' && (
          <ScreenLocationRadar
            weather={weather}
            onBack={() => setCurrentScreen('HOME')}
            onUpdateWeather={handleUpdateWeather}
          />
        )}

        {/* Settings Modal (Includes Sign Out / Lock App) */}
        {isSettingsOpen && (
          <SettingsModal
            currentUser={currentUser}
            weather={weather}
            onClose={() => setIsSettingsOpen(false)}
            onLogout={handleLogout}
            onChangeLocation={handleCityChange}
            onResetData={handleResetData}
          />
        )}

        {/* Sent WeatherMood Email Viewer Modal */}
        {showEmailModal && lastSentEmail && (
          <EmailViewerModal
            email={lastSentEmail}
            onClose={() => setShowEmailModal(false)}
            onResend={handleResendEmail}
          />
        )}
      </div>
    </div>
  );
}
