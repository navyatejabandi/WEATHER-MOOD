import React, { useState } from 'react';
import { CuteMascot } from './CuteMascot';
import { WeatherData, MoodType } from '../types';
import { WeatherService } from '../services/weatherService';
import { AppStore } from '../services/store';
import { MoodEmoji } from './MoodEmoji';
import { 
  Sparkles, 
  ChevronRight, 
  Home as HomeIcon,
  Plus, 
  BarChart2, 
  CloudSun, 
  Brain,
  Clock,
  Layers,
  SunMedium
} from 'lucide-react';

interface ScreenMoodInsightsProps {
  weather: WeatherData;
  onOpenHome: () => void;
  onOpenWeatherConditions: () => void;
  onOpenPrediction: () => void;
  onOpenLogMood: () => void;
}

export const ScreenMoodInsights: React.FC<ScreenMoodInsightsProps> = ({
  weather,
  onOpenHome,
  onOpenWeatherConditions,
  onOpenPrediction,
  onOpenLogMood,
}) => {
  const [activeTab, setActiveTab] = useState<'TODAY' | 'TIME_OF_DAY'>('TODAY');
  const feedbackList = AppStore.getFeedbackRecords();

  // Dynamic Today's Mood Distribution of the Day
  const todayDist = WeatherService.calculateTodayMoodDistribution(weather);
  const todayTimeline = WeatherService.generateTodayHourlyTimeline(weather);

  // Donut SVG circumference calculation for Today's distribution
  const radius = 38;
  const circumference = 2 * Math.PI * radius; // ~238.76

  const happyStroke = (todayDist.happy / 100) * circumference;
  const calmStroke = (todayDist.calm / 100) * circumference;
  const okayStroke = (todayDist.okay / 100) * circumference;
  const sadStroke = (todayDist.sad / 100) * circumference;
  const irritatedStroke = (todayDist.irritated / 100) * circumference;

  // Time-of-day blocks for today
  const timeOfDayBlocks = [
    { period: 'Morning (6 AM – 12 PM)', mood: 'Happy' as MoodType, pct: 58, cond: 'Crisp morning sun & fresh air', icon: '🌅' },
    { period: 'Afternoon (12 PM – 5 PM)', mood: 'Okay' as MoodType, pct: 50, cond: 'Peak daylight warmth & activity', icon: '☀️' },
    { period: 'Evening (5 PM – 9 PM)', mood: 'Calm' as MoodType, pct: 62, cond: 'Golden hour twilight & cooling breeze', icon: '🌇' },
    { period: 'Night (9 PM – 6 AM)', mood: 'Calm' as MoodType, pct: 64, cond: 'Quiet ambient coolness & rest', icon: '🌙' },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#E0F2FE] via-[#F8FAFC] to-[#F1F5F9] text-slate-800 pb-24 select-none">
      <div className="px-5 pt-4">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CuteMascot size="sm" className="w-9 h-7" />
            <div>
              <div className="text-lg font-extrabold text-slate-800 font-heading leading-tight flex items-center">
                <span className="text-[#3B82F6]">Mood</span>
                <span className="text-[#8B5CF6] ml-1">Insights</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                Part 1: Overall distribution of the day
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenWeatherConditions}
            className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full hover:bg-indigo-100 transition-colors"
          >
            <span>Weather Impact →</span>
          </button>
        </div>

        {/* View Switcher: Overall of the Day | By Time of Day */}
        <div className="bg-slate-200/70 p-1 rounded-2xl flex items-center gap-1 mb-3.5">
          <button
            type="button"
            onClick={() => setActiveTab('TODAY')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'TODAY'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Today's Overall (Of the Day)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('TIME_OF_DAY')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'TIME_OF_DAY'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Time-of-Day Shifts
          </button>
        </div>

        {activeTab === 'TODAY' && (
          <div className="space-y-3.5">
            {/* Primary Donut Card: Overall Mood Distribution OF THE DAY */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 font-heading">
                    Today's Mood Distribution
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    (Of the day across 24 hours of atmospheric conditions)
                  </p>
                </div>
                <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  {weather.city} · Today
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-4">
                {/* Donut Chart */}
                <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#F1F5F9" strokeWidth="16" />
                    <circle
                      cx="50" cy="50" r={radius} fill="transparent" stroke="#FBBF24" strokeWidth="16"
                      strokeDasharray={`${happyStroke} ${circumference}`} strokeDashoffset="0"
                    />
                    <circle
                      cx="50" cy="50" r={radius} fill="transparent" stroke="#34D399" strokeWidth="16"
                      strokeDasharray={`${calmStroke} ${circumference}`} strokeDashoffset={-happyStroke}
                    />
                    <circle
                      cx="50" cy="50" r={radius} fill="transparent" stroke="#FB923C" strokeWidth="16"
                      strokeDasharray={`${okayStroke} ${circumference}`} strokeDashoffset={-(happyStroke + calmStroke)}
                    />
                    <circle
                      cx="50" cy="50" r={radius} fill="transparent" stroke="#60A5FA" strokeWidth="16"
                      strokeDasharray={`${sadStroke} ${circumference}`} strokeDashoffset={-(happyStroke + calmStroke + okayStroke)}
                    />
                    <circle
                      cx="50" cy="50" r={radius} fill="transparent" stroke="#F87171" strokeWidth="16"
                      strokeDasharray={`${irritatedStroke} ${circumference}`} strokeDashoffset={-(happyStroke + calmStroke + okayStroke + sadStroke)}
                    />
                  </svg>

                  {/* Center Stat */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-black text-slate-800 leading-none">
                      {todayDist.happy}%
                    </span>
                    <span className="text-[9px] font-bold text-[#F59E0B]">
                      Happy
                    </span>
                  </div>
                </div>

                {/* Legend with percentages */}
                <div className="flex-1 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24] shrink-0"></span>
                      <span className="font-semibold text-slate-700 text-[11px]">Happy</span>
                    </div>
                    <span className="font-bold text-slate-800 text-[11px]">{todayDist.happy}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#34D399] shrink-0"></span>
                      <span className="font-semibold text-slate-700 text-[11px]">Calm</span>
                    </div>
                    <span className="font-bold text-slate-800 text-[11px]">{todayDist.calm}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FB923C] shrink-0"></span>
                      <span className="font-semibold text-slate-700 text-[11px]">Okay</span>
                    </div>
                    <span className="font-bold text-slate-800 text-[11px]">{todayDist.okay}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#60A5FA] shrink-0"></span>
                      <span className="font-semibold text-slate-700 text-[11px]">Sad</span>
                    </div>
                    <span className="font-bold text-slate-800 text-[11px]">{todayDist.sad}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F87171] shrink-0"></span>
                      <span className="font-semibold text-slate-700 text-[11px]">Irritated</span>
                    </div>
                    <span className="font-bold text-slate-800 text-[11px]">{todayDist.irritated}%</span>
                  </div>
                </div>
              </div>

              {/* Dominant Mood of the Day Card */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between bg-amber-50/50 p-2.5 rounded-2xl">
                <div className="flex items-center gap-2">
                  <MoodEmoji mood={todayDist.dominantMood} size="sm" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Dominant Mood of the Day</span>
                    <span className="text-xs font-black text-slate-800 capitalize">{todayDist.dominantMood} ({todayDist.happy}%)</span>
                  </div>
                </div>
                <span className="text-[10px] text-amber-700 font-bold bg-amber-100/70 px-2 py-0.5 rounded-full">
                  Favorable Daylight
                </span>
              </div>
            </div>

            {/* Next Step Gateway: Weather Conditions & Following Correlations */}
            <div
              onClick={onOpenWeatherConditions}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-3xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer group flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-1.5 text-blue-200 text-[10px] font-bold uppercase tracking-wider">
                  <CloudSun className="w-3.5 h-3.5" />
                  <span>Part 2 Analysis</span>
                </div>
                <h4 className="text-sm font-extrabold mt-0.5">
                  Weather Conditions &amp; Mood Impact
                </h4>
                <p className="text-[11px] text-indigo-100/90 mt-0.5">
                  See mood percentages under sunny, cloudy &amp; rainy skies.
                </p>
              </div>
              <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
                <ChevronRight className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        )}

        {/* View 2: Time-of-Day Shifts for Today */}
        {activeTab === 'TIME_OF_DAY' && (
          <div className="space-y-2.5">
            <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-xs">
              <h3 className="text-xs font-bold text-slate-800 font-heading">
                Today's Time-of-Day Mood Shifts
              </h3>
              <p className="text-[10px] text-slate-400 mb-3">
                How emotional probability evolves across 4 phases of today
              </p>

              <div className="space-y-2.5">
                {timeOfDayBlocks.map((block) => (
                  <div
                    key={block.period}
                    className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{block.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-slate-800">{block.period}</div>
                        <div className="text-[10px] text-slate-400">{block.cond}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-indigo-600">{block.mood}</div>
                      <div className="text-[10px] text-slate-500 font-bold">{block.pct}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenWeatherConditions}
              className="w-full py-3 bg-white border border-indigo-200 text-indigo-600 rounded-2xl text-xs font-bold shadow-xs hover:border-indigo-400 transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore Weather Factors (Temp, Rain, AQI) →</span>
            </button>
          </div>
        )}
      </div>

      {/* Modern 5-Tab Bottom Navigation (Mood is right next to Home!) */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-2.5 z-30 flex items-center justify-between shadow-lg">
        {/* Home */}
        <button
          type="button"
          onClick={onOpenHome}
          className="flex flex-col items-center text-slate-400 hover:text-indigo-600 font-medium text-[10px] gap-0.5 focus:outline-none transition-colors"
        >
          <HomeIcon className="w-5 h-5 stroke-[2]" />
          <span>Home</span>
        </button>

        {/* Mood Insights (Active) */}
        <button
          type="button"
          className="flex flex-col items-center text-indigo-600 font-bold text-[10px] gap-0.5 focus:outline-none"
        >
          <BarChart2 className="w-5 h-5 stroke-[2.2]" />
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

        {/* ML Prediction */}
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
