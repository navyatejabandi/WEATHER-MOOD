import React, { useState } from 'react';
import { WeatherData, MoodType, MoodFeedbackRecord } from '../types';
import { MoodEmoji } from './MoodEmoji';
import { LushMeadow } from './LushMeadow';
import { AppStore } from '../services/store';
import { WeatherService } from '../services/weatherService';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Pen, 
  Lightbulb, 
  Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScreenLogMoodProps {
  weather: WeatherData;
  onBack: () => void;
  onOpenInsights: () => void;
  onOpenPrediction: () => void;
}

export const ScreenLogMood: React.FC<ScreenLogMoodProps> = ({
  weather,
  onBack,
  onOpenInsights,
  onOpenPrediction,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType>('happy');
  const [note, setNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const newRecord: MoodFeedbackRecord = {
      id: 'fb_' + Date.now(),
      timestamp: new Date().toISOString(),
      dateLabel: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timeLabel: weather.timeString || WeatherService.getCurrentTimeString(),
      confirmedEstimate: selectedMood === 'happy',
      reportedMood: selectedMood,
      predictedMood: 'happy',
      confidenceAtLog: 54,
      weatherSnapshot: {
        temp: weather.temp,
        condition: weather.condition,
        humidity: weather.humidity,
        windSpeed: weather.windSpeed,
        aqi: weather.aqi,
        precipitation: weather.precipitation,
      },
      note: note.trim() || undefined,
      isUserLabelled: true,
    };

    AppStore.addFeedbackRecord(newRecord);
    setIsSaved(true);

    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      onBack();
    }, 900);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#E0F2FE] via-[#F8FAFC] to-[#FEF3C7]/30 text-slate-800 pt-3 pb-0 select-none">
      <div className="px-5">
        {/* Top App Bar with Back Button */}
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-white/80 transition-all"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-bold text-slate-800 font-heading">
            Log Your Mood
          </h2>
          <div className="w-8" />
        </div>

        {/* Big Question Header */}
        <div className="text-center mt-1">
          <h1 className="text-xl font-extrabold text-slate-800 font-heading">
            How's the weather
            <br />
            making you feel today?
          </h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Your mood + weather = better you!
          </p>
        </div>

        {/* Automatic Current Weather Banner */}
        <div className="mt-4 bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            {/* Mini Weather Icon */}
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-amber-500 fill-current">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-800 font-heading">
                {weather.temp}°C <span className="font-normal text-slate-500 text-[11px] ml-1">{weather.condition}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                <span className="flex items-center gap-0.5">
                  <MapPin className="w-3 h-3 text-indigo-500" />
                  {weather.city}, {weather.state}
                </span>
                <span className="flex items-center gap-0.5">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {weather.timeString}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Mood Options (3 Top, 2 Bottom) */}
        <div className="mt-5 space-y-3">
          {/* Top Row: Happy, Calm, Okay */}
          <div className="grid grid-cols-3 gap-3">
            {/* Happy */}
            <button
              type="button"
              onClick={() => setSelectedMood('happy')}
              className={`flex flex-col items-center p-3 rounded-2xl bg-white border transition-all ${
                selectedMood === 'happy'
                  ? 'border-amber-400 ring-2 ring-amber-300 shadow-md scale-102 bg-amber-50/40'
                  : 'border-slate-200/80 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <MoodEmoji mood="happy" size="md" className="mb-2" />
              <span className="text-xs font-bold text-slate-700">Happy</span>
            </button>

            {/* Calm */}
            <button
              type="button"
              onClick={() => setSelectedMood('calm')}
              className={`flex flex-col items-center p-3 rounded-2xl bg-white border transition-all ${
                selectedMood === 'calm'
                  ? 'border-emerald-400 ring-2 ring-emerald-300 shadow-md scale-102 bg-emerald-50/40'
                  : 'border-slate-200/80 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <MoodEmoji mood="calm" size="md" className="mb-2" />
              <span className="text-xs font-bold text-slate-700">Calm</span>
            </button>

            {/* Okay */}
            <button
              type="button"
              onClick={() => setSelectedMood('okay')}
              className={`flex flex-col items-center p-3 rounded-2xl bg-white border transition-all ${
                selectedMood === 'okay'
                  ? 'border-orange-400 ring-2 ring-orange-300 shadow-md scale-102 bg-orange-50/40'
                  : 'border-slate-200/80 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <MoodEmoji mood="okay" size="md" className="mb-2" />
              <span className="text-xs font-bold text-slate-700">Okay</span>
            </button>
          </div>

          {/* Bottom Row: Sad, Irritated */}
          <div className="grid grid-cols-2 gap-3 max-w-[240px] mx-auto">
            {/* Sad */}
            <button
              type="button"
              onClick={() => setSelectedMood('sad')}
              className={`flex flex-col items-center p-3 rounded-2xl bg-white border transition-all ${
                selectedMood === 'sad'
                  ? 'border-sky-400 ring-2 ring-sky-300 shadow-md scale-102 bg-sky-50/40'
                  : 'border-slate-200/80 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <MoodEmoji mood="sad" size="md" className="mb-2" />
              <span className="text-xs font-bold text-slate-700">Sad</span>
            </button>

            {/* Irritated */}
            <button
              type="button"
              onClick={() => setSelectedMood('irritated')}
              className={`flex flex-col items-center p-3 rounded-2xl bg-white border transition-all ${
                selectedMood === 'irritated'
                  ? 'border-rose-400 ring-2 ring-rose-300 shadow-md scale-102 bg-rose-50/40'
                  : 'border-slate-200/80 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <MoodEmoji mood="irritated" size="md" className="mb-2" />
              <span className="text-xs font-bold text-slate-700">Irritated</span>
            </button>
          </div>
        </div>

        {/* Optional Note Input */}
        <div className="mt-5">
          <div className="relative flex items-center">
            <Pen className="absolute left-3.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Add a note (optional)..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-2xs"
            />
          </div>
        </div>

        {/* Primary Save Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaved}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
              isSaved
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white active:scale-[0.98]'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Entry Saved & Calibrated!</span>
              </>
            ) : (
              <>
                <span>💜 Save Entry</span>
              </>
            )}
          </button>
        </div>

        {/* Tip Information Card */}
        <div className="mt-4 bg-amber-50/70 border border-amber-200/60 rounded-2xl p-3 flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
            Logging your mood helps the app learn your personal pattern and gives more accurate predictions.
          </p>
        </div>
      </div>

      {/* Bottom Meadow */}
      <LushMeadow className="-mx-5 mt-4" />
    </div>
  );
};
