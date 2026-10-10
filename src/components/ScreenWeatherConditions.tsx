import React, { useState } from 'react';
import { CuteMascot } from './CuteMascot';
import { WeatherData } from '../types';
import { AppStore } from '../services/store';
import { WeatherService } from '../services/weatherService';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  Wind,
  Droplets, 
  Leaf, 
  Sparkles, 
  ChevronRight, 
  Home as HomeIcon, 
  Plus, 
  BarChart2, 
  CloudSun, 
  Brain, 
  Thermometer, 
  ArrowLeft,
  Flame,
  ShieldAlert,
  Zap,
  Activity
} from 'lucide-react';

interface ScreenWeatherConditionsProps {
  weather: WeatherData;
  onOpenHome: () => void;
  onOpenMoodInsights: () => void;
  onOpenPrediction: () => void;
  onOpenLogMood: () => void;
}

export const ScreenWeatherConditions: React.FC<ScreenWeatherConditionsProps> = ({
  weather,
  onOpenHome,
  onOpenMoodInsights,
  onOpenPrediction,
  onOpenLogMood,
}) => {
  const feedbackList = AppStore.getFeedbackRecords();

  // Interactive Heat Simulator state
  const [simulatedTemp, setSimulatedTemp] = useState<number>(weather.temp);
  const [simulatedHum, setSimulatedHum] = useState<number>(weather.humidity);

  // Compute behavioral changes under heat conditions
  const heatImpact = WeatherService.calculateHeatBehavioralImpact(simulatedTemp, simulatedHum);

  const heatPresets = [
    { label: '22°C Ideal', temp: 22, hum: 45, tag: 'Comfort' },
    { label: '29°C Warm', temp: 29, hum: 55, tag: 'Moderate' },
    { label: '34°C Hot', temp: 34, hum: 65, tag: 'Heat Stress' },
    { label: '39°C Extreme', temp: 39, hum: 75, tag: 'Severe Wave' },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#E0F2FE] via-[#F8FAFC] to-[#F1F5F9] text-slate-800 pb-24 select-none">
      <div className="px-5 pt-4">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={onOpenMoodInsights}
            className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-white/80 transition-all flex items-center gap-1"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs font-semibold">Mood</span>
          </button>

          <div className="text-center">
            <h2 className="text-base font-extrabold text-slate-800 font-heading">
              Weather &amp; Heat Conditions
            </h2>
            <div className="text-[10px] text-slate-400 font-medium">
              Behavioral Changes &amp; Heat Stress Analysis
            </div>
          </div>

          <CuteMascot size="sm" className="w-8 h-7" />
        </div>

        {/* HIGHLIGHT: Prediction of Human Behavioral Changes Under Heat Conditions */}
        <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 text-white rounded-3xl p-4 shadow-lg relative overflow-hidden mb-4">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                <Flame className="w-4 h-4 text-amber-200 fill-amber-200" />
              </div>
              <div>
                <h3 className="text-xs font-black tracking-wide uppercase text-amber-100">
                  Heat Stress Behavioral Prediction
                </h3>
                <div className="text-[11px] font-medium text-white/90">
                  Predicting human irritability &amp; cognitive fatigue under heat
                </div>
              </div>
            </div>

            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/20 border border-white/20 text-white">
              {heatImpact.stressCategory}
            </span>
          </div>

          {/* Interactive Heat Preset Switcher */}
          <div className="mt-2.5 pt-2.5 border-t border-white/20">
            <div className="text-[10px] font-bold text-amber-100 mb-1.5 flex items-center justify-between">
              <span>Test Thermal Scenarios:</span>
              <span>Heat Index: {heatImpact.heatIndex}°C</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {heatPresets.map((preset) => {
                const isActive = simulatedTemp === preset.temp;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setSimulatedTemp(preset.temp);
                      setSimulatedHum(preset.hum);
                    }}
                    className={`py-1.5 px-1 rounded-xl text-center text-[10px] font-bold transition-all ${
                      isActive 
                        ? 'bg-white text-orange-700 shadow-sm scale-[1.02]' 
                        : 'bg-white/15 text-white hover:bg-white/25'
                    }`}
                  >
                    <div>{preset.label}</div>
                    <div className="text-[8px] opacity-80">{preset.tag}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Behavioral Output Breakdown */}
          <div className="mt-3 bg-black/20 backdrop-blur-xs rounded-2xl p-3 space-y-2 border border-white/10">
            <div className="text-[11px] font-semibold text-white leading-snug">
              {heatImpact.primaryBehavior}
            </div>

            {/* Behavioral Probability Indicators */}
            <div className="space-y-1.5 pt-1">
              {/* Irritability Risk */}
              <div>
                <div className="flex justify-between text-[10px] font-bold text-amber-100 mb-0.5">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-300" />
                    Irritability &amp; Impatience
                  </span>
                  <span>{heatImpact.irritabilityRisk}% Risk</span>
                </div>
                <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-300 to-rose-400 rounded-full transition-all duration-500" 
                    style={{ width: `${heatImpact.irritabilityRisk}%` }} 
                  />
                </div>
              </div>

              {/* Cognitive Fatigue */}
              <div>
                <div className="flex justify-between text-[10px] font-bold text-amber-100 mb-0.5">
                  <span className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-sky-200" />
                    Cognitive Fatigue &amp; Brain Fog
                  </span>
                  <span>{heatImpact.cognitiveFatigueRisk}% Risk</span>
                </div>
                <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-sky-300 to-indigo-300 rounded-full transition-all duration-500" 
                    style={{ width: `${heatImpact.cognitiveFatigueRisk}%` }} 
                  />
                </div>
              </div>

              {/* Calm Reserve */}
              <div>
                <div className="flex justify-between text-[10px] font-bold text-amber-100 mb-0.5">
                  <span className="flex items-center gap-1">
                    <Brain className="w-3 h-3 text-emerald-300" />
                    Patience &amp; Calm Reserve
                  </span>
                  <span>{heatImpact.calmProbability}%</span>
                </div>
                <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-300 to-teal-200 rounded-full transition-all duration-500" 
                    style={{ width: `${heatImpact.calmProbability}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Physiological & Neuro Mechanisms */}
            <div className="pt-2 border-t border-white/10 text-[9px] text-white/90">
              <div className="font-bold text-amber-200 mb-1">Underlying Neurobiological Drivers:</div>
              <ul className="list-disc pl-3 space-y-0.5 text-white/80">
                {heatImpact.physiologicalDrivers.map((driver, idx) => (
                  <li key={idx}>{driver}</li>
                ))}
              </ul>
            </div>

            {/* Behavioral Mitigation Tip */}
            <div className="pt-1.5 text-[9px] text-amber-100 font-medium">
              💡 <strong>Action Tip:</strong> {heatImpact.mitigationTip}
            </div>
          </div>
        </div>

        {/* Section 1: Mood Percentages Under Specific Weather Conditions */}
        <div className="mt-2">
          <div className="text-xs font-bold text-slate-700 mb-2 px-1 flex items-center justify-between">
            <span>Mood Under Weather Conditions</span>
            <span className="text-[10px] text-slate-400">Sample Sizes</span>
          </div>

          <div className="space-y-2.5">
            {/* Sunny Conditions */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Sunny &amp; Clear Skies</div>
                  <div className="text-[10px] text-slate-400">48 recorded days (31/48 Happy)</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black text-[#F59E0B]">65% Happy</div>
                <div className="text-[10px] text-slate-400">22% Calm · 13% Okay</div>
              </div>
            </div>

            {/* Cloudy Conditions */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                  <Cloud className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Overcast &amp; Cloudy</div>
                  <div className="text-[10px] text-slate-400">38 recorded days (20/38 Calm)</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black text-[#10B981]">52% Calm</div>
                <div className="text-[10px] text-slate-400">28% Okay · 20% Other</div>
              </div>
            </div>

            {/* Rainy Conditions */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center shrink-0">
                  <CloudRain className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Rain &amp; Showers</div>
                  <div className="text-[10px] text-slate-400">40 recorded entries (25/40 entries)</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black text-[#3B82F6]">62.5% Sad / Reflective</div>
                <div className="text-[10px] text-slate-400">25/40 recorded rainy entries</div>
              </div>
            </div>

            {/* High Wind & Storms */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                  <Wind className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">High Gusts &amp; Storms</div>
                  <div className="text-[10px] text-slate-400">22 recorded days</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black text-rose-500">48% Irritated / Restless</div>
                <div className="text-[10px] text-slate-400">32% Calm · 20% Okay</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Statistical Influence Charts (Weather Factors vs Mood) */}
        <div className="mt-4">
          <div className="text-xs font-bold text-slate-700 mb-2 px-1 flex items-center justify-between">
            <span>Statistical Influence Factors</span>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
              R² = 0.74 Correlation
            </span>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-4 space-y-3 shadow-2xs">
            {/* Factor 1: Temperature & Heat */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                  <span>Temperature (Sweet spot 22°C–28°C)</span>
                </span>
                <span className="font-bold text-[#F59E0B]">+38% Happy / Calm</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full w-[78%]" />
              </div>
            </div>

            {/* Factor 2: High Humidity & Heat Mugginess */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-sky-500" />
                  <span>High Humidity (&gt;70% mugginess)</span>
                </span>
                <span className="font-bold text-rose-500">+22% Irritated</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-rose-400 to-red-400 rounded-full w-[45%]" />
              </div>
            </div>

            {/* Factor 3: Rain & Low Light */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                  <span>Rain &amp; Dim Overcast Light</span>
                </span>
                <span className="font-bold text-blue-500">+28% Sad / Introspective</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full w-[58%]" />
              </div>
            </div>

            {/* Factor 4: Fresh Air AQI */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Fresh Clean Air (AQI &lt; 50)</span>
                </span>
                <span className="font-bold text-emerald-500">+34% Calm &amp; Focus</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full w-[70%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Verified User Logs vs Baseline Dataset */}
        <div className="mt-4 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200/80 rounded-3xl p-3.5 shadow-2xs">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold text-indigo-950 font-heading">
              Your Feedback vs Baseline Dataset
            </h4>
          </div>
          <p className="text-[11px] text-indigo-900/80 leading-relaxed">
            These associations distinguish verified user logs (<strong>{feedbackList.length} feedback samples</strong>) from the controlled baseline weather dataset (120 observations).
          </p>
          <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-indigo-200/60 text-[10px]">
            <span className="text-slate-500">ML Model Status:</span>
            <button
              type="button"
              onClick={onOpenPrediction}
              className="font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
            >
              <span>Explore ML Model Architecture</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Modern 5-Tab Bottom Navigation */}
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

        {/* Mood Insights */}
        <button
          type="button"
          onClick={onOpenMoodInsights}
          className="flex flex-col items-center text-slate-400 hover:text-indigo-600 font-medium text-[10px] gap-0.5 focus:outline-none transition-colors"
        >
          <BarChart2 className="w-5 h-5 stroke-[2]" />
          <span>Mood</span>
        </button>

        {/* Log Mood Floating Action Button */}
        <button
          type="button"
          onClick={onOpenLogMood}
          className="-mt-5 w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-indigo-500/25 transition-all transform active:scale-95 focus:outline-none"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Weather Conditions (Active) */}
        <button
          type="button"
          className="flex flex-col items-center text-indigo-600 font-bold text-[10px] gap-0.5 focus:outline-none"
        >
          <CloudSun className="w-5 h-5 stroke-[2.5]" />
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
