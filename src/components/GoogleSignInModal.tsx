import React, { useState } from 'react';
import { AuthUser } from '../types';
import { AppStore } from '../services/store';
import { X, Lock, Mail, User, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';

interface GoogleSignInModalProps {
  onSuccess: (user: AuthUser) => void;
  onClose: () => void;
  defaultEmail?: string;
}

export const GoogleSignInModal: React.FC<GoogleSignInModalProps> = ({
  onSuccess,
  onClose,
  defaultEmail = '',
}) => {
  const [googleEmail, setGoogleEmail] = useState('');
  const [googlePassword, setGooglePassword] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = googleEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg('Please enter your Google Email address.');
      return;
    }

    if (!cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address (e.g., yourname@gmail.com).');
      return;
    }

    if (!googlePassword) {
      setErrorMsg('Please enter your Google account password.');
      return;
    }

    if (googlePassword.length < 4) {
      setErrorMsg('Google password must be at least 4 characters.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Register or retrieve user in AppStore with password
      AppStore.registerAccount(cleanEmail, googleName.trim() || 'Google User', googlePassword);

      const authenticatedUser: AuthUser = {
        id: 'usr_g_' + Date.now(),
        name: googleName.trim() || cleanEmail.split('@')[0],
        identifier: cleanEmail,
        provider: 'Google',
        createdAt: new Date().toISOString(),
      };

      setIsLoading(false);
      onSuccess(authenticatedUser);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl relative border border-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Google Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
            <svg className="w-9 h-9" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 font-heading">
            Sign in with Google
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            to continue to <strong className="text-indigo-600">WeatherMood</strong>
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-1.5">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {/* Display Name */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Full Name</label>
            <div className="relative flex items-center">
              <User className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={googleName}
                onChange={(e) => setGoogleName(e.target.value)}
                placeholder="Google Account Name"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Google Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
              <input
                type="email"
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                placeholder="username@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Google Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={googlePassword}
                onChange={(e) => setGooglePassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Note on Weather Email dispatch */}
          <div className="pt-1 text-[11px] text-slate-500 flex items-start gap-1.5 leading-snug">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>A daily weather-based mood report will be sent to this email upon logging in.</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Authenticating with Google...</span>
            ) : (
              <>
                <span>Sign In with Google</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
