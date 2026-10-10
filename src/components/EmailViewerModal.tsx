import React from 'react';
import { SentEmailRecord } from '../types';
import { MoodEmoji } from './MoodEmoji';
import { CuteMascot } from './CuteMascot';
import { X, Mail, CheckCircle2, Send, Clock, MapPin, Sparkles } from 'lucide-react';

interface EmailViewerModalProps {
  email: SentEmailRecord;
  onClose: () => void;
  onResend?: () => void;
}

export const EmailViewerModal: React.FC<EmailViewerModalProps> = ({
  email,
  onClose,
  onResend,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Email App Header Bar */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold font-heading">Delivered Email Snapshot</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Email Meta Info */}
        <div className="p-4 bg-slate-50 border-b border-slate-200/80 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">To:</span>
            <span className="font-semibold text-slate-800">{email.recipientName} &lt;{email.recipientEmail}&gt;</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Subject:</span>
            <span className="font-bold text-slate-900">{email.subject}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Sent At:</span>
            <span className="text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{email.sentAt}</span>
              <span className="text-emerald-600 font-bold ml-1">· Delivered ✓</span>
            </span>
          </div>
        </div>

        {/* Styled Email Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs leading-relaxed bg-white flex-1">
          {/* Email Branding */}
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <CuteMascot size="sm" className="w-8 h-7" />
            <div>
              <span className="font-bold text-slate-800 font-heading text-sm">WeatherMood Daily Digest</span>
              <p className="text-[10px] text-slate-400">Personalized Ambient Emotional Forecast</p>
            </div>
          </div>

          <p className="text-slate-700">
            Hi <strong>{email.recipientName}</strong>,
          </p>
          <p className="text-slate-600">
            You just logged into WeatherMood. Here is your automated atmospheric snapshot and weather-based mood estimate:
          </p>

          {/* Weather Snapshot Box */}
          <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-800 text-sm">
                {email.weatherSummary.temp}°C — {email.weatherSummary.condition}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                📍 {email.weatherSummary.city}, {email.weatherSummary.state}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Humidity {email.weatherSummary.humidity}% · Wind {email.weatherSummary.windSpeed} km/h · AQI {email.weatherSummary.aqi}
              </div>
            </div>
          </div>

          {/* Predicted Mood Box */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-3">
            <MoodEmoji mood={email.predictedMood} size="md" />
            <div>
              <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider block">Estimated Emotion</span>
              <span className="text-base font-black text-slate-900 font-heading">
                Happy — {email.moodProbability}% Probability
              </span>
              <p className="text-[11px] text-slate-600 mt-1">
                {email.explanation}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
            <span>This forecast is automatically derived from live environmental variables and adjusts dynamically as you use the website.</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Sent via WeatherMood Mailer</span>
          <div className="flex gap-2">
            {onResend && (
              <button
                onClick={onResend}
                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Send className="w-3 h-3 text-indigo-600" />
                <span>Resend</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
