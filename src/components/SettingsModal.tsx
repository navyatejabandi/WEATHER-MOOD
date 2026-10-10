import React from 'react';
import { AuthUser, WeatherData } from '../types';
import { X, LogOut, MapPin, Thermometer, User, RefreshCw } from 'lucide-react';

interface SettingsModalProps {
  currentUser: AuthUser | null;
  weather: WeatherData;
  onClose: () => void;
  onLogout: () => void;
  onChangeLocation: (city: string) => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  currentUser,
  weather,
  onClose,
  onLogout,
  onChangeLocation,
  onResetData,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white rounded-3xl p-5 max-w-xs w-full shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-sm font-heading">
            Settings & Account
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Card */}
        {currentUser && (
          <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-slate-800 text-xs truncate">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 truncate">{currentUser.identifier}</div>
            </div>
          </div>
        )}

        <div className="mt-4 space-y-2 text-xs">
          {/* Quick city switch */}
          <div className="p-2.5 rounded-xl border border-slate-200/80">
            <div className="text-[10px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-indigo-500" />
              <span>Quick Locations</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['Hyderabad', 'Bengaluru', 'Mumbai', 'London', 'Tokyo'].map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    onChangeLocation(c);
                    onClose();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                    weather.city.toLowerCase() === c.toLowerCase()
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Demo Data */}
          <button
            onClick={() => {
              onResetData();
              onClose();
            }}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-2 font-medium text-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Demo Statistics</span>
          </button>

          {/* Log Out */}
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center gap-2 font-bold text-xs transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out & Lock App</span>
          </button>
        </div>
      </div>
    </div>
  );
};
