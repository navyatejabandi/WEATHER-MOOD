import React, { useState } from 'react';
import { WeatherData } from '../types';
import { CuteMascot } from './CuteMascot';
import { MoodEmoji } from './MoodEmoji';
import { INITIAL_SIMILAR_RECORDS, AppStore } from '../services/store';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Droplets, 
  Wind, 
  Leaf, 
  Home as HomeIcon, 
  Plus, 
  BarChart3,
  CalendarDays,
  X,
  Calendar,
  Sparkles,
  Brain,
  Cpu,
  CheckCircle2,
  BarChart2,
  CloudSun
} from 'lucide-react';

interface ScreenPredictionProps {
  weather: WeatherData;
  onBack: () => void;
  onOpenHome: () => void;
  onOpenLogMood: () => void;
  onOpenMoodInsights: () => void;
  onOpenWeatherConditions: () => void;
}

export const ScreenPrediction: React.FC<ScreenPredictionProps> = ({
  weather,
  onBack,
  onOpenHome,
  onOpenLogMood,
  onOpenMoodInsights,
  onOpenWeatherConditions,
}) => {
  const [showPastDays, setShowPastDays] = useState(false);
  const modelSpecs = AppStore.getModelSpecs();

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#E0F2FE] via-[#F8FAFC] to-[#F1F5F9] text-slate-800 pb-24 select-none">
      <div className="px-5 pt-4">
        {/* Top App Bar with Back Button */}
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={onBack}
            className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-white/80 transition-all flex items-center gap-1"
            title="Back to Home"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs font-semibold">Home</span>
          </button>
          <h2 className="text-sm font-extrabold text-slate-800 font-heading">
            Mood Prediction (ML)
          </h2>
          <CuteMascot size="sm" className="w-8 h-7" />
        </div>

        {/* Intro Subtext Card */}
        <p className="text-center text-xs text-slate-500 font-medium px-4 leading-relaxed mt-1">
          Machine Learning models synthesize atmospheric variables to estimate mood probabilities with Bayesian recalibration.
        </p>

        {/* Most Likely Mood Highlight Card */}
        <div className="mt-3.5 bg-white border border-slate-200/90 rounded-3xl p-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <MoodEmoji mood="happy" size="lg" className="shrink-0" />
            <div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-xl font-black text-slate-800 font-heading">
                  Happy
                </h3>
                <span className="text-xs font-extrabold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  54% probability
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug mt-1">
                Sunny skies and comfortable temperature ({weather.temp}°C) closely match past days where users reported elevated contentment.
              </p>
            </div>
          </div>
        </div>

        {/* Section: Mood Probabilities (Current Conditions) */}
        <div className="mt-4">
          <div className="text-xs font-bold text-slate-700 mb-2 px-1 flex items-center justify-between">
            <span>Mood Probabilities (Current Conditions)</span>
            <span className="text-[10px] text-slate-400">All 5 Classes</span>
          </div>

          <div className="space-y-2.5 bg-white border border-slate-200/80 rounded-3xl p-3.5 shadow-2xs">
            {/* Happy (54%) */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-2 w-20 shrink-0">
                <MoodEmoji mood="happy" size="sm" />
                <span className="font-semibold text-slate-700 text-[11px]">Happy</span>
              </div>
              <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: '54%' }}></div>
              </div>
              <span className="w-9 text-right font-bold text-slate-700 text-[11px]">54%</span>
            </div>

            {/* Calm (22%) */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-2 w-20 shrink-0">
                <MoodEmoji mood="calm" size="sm" />
                <span className="font-semibold text-slate-700 text-[11px]">Calm</span>
              </div>
              <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '22%' }}></div>
              </div>
              <span className="w-9 text-right font-bold text-slate-700 text-[11px]">22%</span>
            </div>

            {/* Okay (12%) */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-2 w-20 shrink-0">
                <MoodEmoji mood="okay" size="sm" />
                <span className="font-semibold text-slate-700 text-[11px]">Okay</span>
              </div>
              <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-orange-400 h-full rounded-full" style={{ width: '12%' }}></div>
              </div>
              <span className="w-9 text-right font-bold text-slate-700 text-[11px]">12%</span>
            </div>

            {/* Sad (8%) */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-2 w-20 shrink-0">
                <MoodEmoji mood="sad" size="sm" />
                <span className="font-semibold text-slate-700 text-[11px]">Sad</span>
              </div>
              <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-sky-400 h-full rounded-full" style={{ width: '8%' }}></div>
              </div>
              <span className="w-9 text-right font-bold text-slate-700 text-[11px]">8%</span>
            </div>

            {/* Irritated (4%) */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-2 w-20 shrink-0">
                <MoodEmoji mood="irritated" size="sm" />
                <span className="font-semibold text-slate-700 text-[11px]">Irritated</span>
              </div>
              <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-rose-400 h-full rounded-full" style={{ width: '4%' }}></div>
              </div>
              <span className="w-9 text-right font-bold text-slate-700 text-[11px]">4%</span>
            </div>
          </div>
        </div>

        {/* Section: ML Model Architecture & Performance */}
        <div className="mt-4 bg-white border border-slate-200/80 rounded-3xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Cpu className="w-4 h-4 text-purple-600" />
              <span>Model Architecture &amp; Evaluation</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              {modelSpecs.status}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs mt-2 pt-2 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-2">
              <div className="text-[10px] text-slate-400">CV Accuracy</div>
              <div className="font-extrabold text-slate-800 text-xs mt-0.5">{modelSpecs.crossValidationAccuracy}%</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-2">
              <div className="text-[10px] text-slate-400">F1 Score</div>
              <div className="font-extrabold text-slate-800 text-xs mt-0.5">{modelSpecs.f1Score.toFixed(2)}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-2">
              <div className="text-[10px] text-slate-400">Samples</div>
              <div className="font-extrabold text-slate-800 text-xs mt-0.5">{modelSpecs.totalTrainingSamples}</div>
            </div>
          </div>

          <div className="mt-2 text-[10px] text-slate-400 text-center">
            {modelSpecs.algorithm} · Tested on held-out 20% test fold
          </div>
        </div>

        {/* Action Button: View Similar Past Days */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setShowPastDays(true)}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-xs active:scale-[0.98]"
          >
            <CalendarDays className="w-4 h-4" />
            <span>View Similar Past Days ({INITIAL_SIMILAR_RECORDS.length}) →</span>
          </button>
          <p className="text-[10px] text-slate-400 font-medium mt-1.5">
            Explore past days with similar weather and reported user emotions.
          </p>
        </div>
      </div>

      {/* Similar Past Days Modal */}
      {showPastDays && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm font-heading">
                    Similar Past Weather Days
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Matches with ~{weather.temp}°C conditions
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPastDays(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto py-3 space-y-2.5 flex-1 pr-1">
              {INITIAL_SIMILAR_RECORDS.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-indigo-50/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{item.date}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {item.similarityScore}% Match
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                    <div className="text-[11px] text-slate-500">
                      <div>
                        <span className="font-bold text-slate-700">{item.temp}°C</span> · {item.condition}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Humidity {item.humidity}% · Wind {item.windSpeed} km/h
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pl-2">
                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 block uppercase font-medium">Felt</span>
                        <span className="text-[11px] font-bold text-slate-700 capitalize">{item.reportedMood}</span>
                      </div>
                      <MoodEmoji mood={item.reportedMood} size="sm" />
                    </div>
                  </div>

                  {item.note && (
                    <div className="mt-2 text-[10px] text-slate-500 bg-white p-2 rounded-xl border border-slate-100 italic">
                      "{item.note}"
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowPastDays(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern 5-Tab Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-2.5 z-30 flex items-center justify-between shadow-lg">
        <button
          type="button"
          onClick={onOpenHome}
          className="flex flex-col items-center text-slate-400 hover:text-indigo-600 font-medium text-[10px] gap-0.5 focus:outline-none transition-colors"
        >
          <HomeIcon className="w-5 h-5 stroke-[2]" />
          <span>Home</span>
        </button>

        {/* Mood Insights */}
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

        {/* Weather Conditions */}
        <button
          type="button"
          onClick={onOpenWeatherConditions}
          className="flex flex-col items-center text-slate-400 hover:text-indigo-600 font-medium text-[10px] gap-0.5 focus:outline-none transition-colors"
        >
          <CloudSun className="w-5 h-5 stroke-[2]" />
          <span>Weather</span>
        </button>

        {/* Prediction (Active) */}
        <button
          type="button"
          className="flex flex-col items-center text-indigo-600 font-bold text-[10px] gap-0.5 focus:outline-none"
        >
          <Brain className="w-5 h-5 stroke-[2.2]" />
          <span>Prediction</span>
        </button>
      </div>
    </div>
  );
};
