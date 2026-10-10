import React, { useState } from 'react';
import { AuthUser } from '../types';
import { AppStore } from '../services/store';
import { CuteMascot } from './CuteMascot';
import { LushMeadow } from './LushMeadow';
import { GoogleSignInModal } from './GoogleSignInModal';
import { User, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

interface ScreenLoginProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const ScreenLogin: React.FC<ScreenLoginProps> = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanIdentifier = identifier.trim().toLowerCase();

    if (!cleanIdentifier) {
      setErrorMsg('Please enter your email or phone number');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password');
      return;
    }

    if (isSignUp) {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long');
        return;
      }
      // Strict rule: If email was once registered, they are NOT supposed to use the same to register again
      if (AppStore.wasIdentifierEverRegistered(cleanIdentifier)) {
        setErrorMsg(`The email "${cleanIdentifier}" was once registered. You are not allowed to use the same email to register again. Please use Sign In instead.`);
        return;
      }

      AppStore.registerAccount(cleanIdentifier, name.trim(), password);
      const newUser: AuthUser = {
        id: 'usr_' + Date.now(),
        name: name.trim(),
        identifier: cleanIdentifier,
        provider: 'Email',
        createdAt: new Date().toISOString(),
      };
      if (rememberMe) AppStore.setStoredUser(newUser);
      onLoginSuccess(newUser);
    } else {
      // Login mode: STRICT PASSWORD VERIFICATION
      const verification = AppStore.verifyAccountCredentials(cleanIdentifier, password);

      if (!verification.success) {
        setErrorMsg(verification.error || 'Invalid credentials');
        return;
      }

      const verifiedUser = verification.user!;
      const loggedUser: AuthUser = {
        id: 'usr_' + verifiedUser.identifier,
        name: verifiedUser.name || (cleanIdentifier.includes('@') ? cleanIdentifier.split('@')[0] : 'User'),
        identifier: verifiedUser.identifier,
        provider: 'Email',
        createdAt: new Date().toISOString(),
      };
      if (rememberMe) AppStore.setStoredUser(loggedUser);
      onLoginSuccess(loggedUser);
    }
  };

  const handleAppleLogin = () => {
    setErrorMsg('');
    const emailCandidate = `apple.user@icloud.com`;
    const defaultName = 'Apple Explorer';

    AppStore.registerAccount(emailCandidate, defaultName);

    const demoUser: AuthUser = {
      id: `usr_apple_${Date.now()}`,
      name: defaultName,
      identifier: emailCandidate,
      provider: 'Apple',
      createdAt: new Date().toISOString(),
    };
    if (rememberMe) AppStore.setStoredUser(demoUser);
    onLoginSuccess(demoUser);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#E0F2FE] via-[#F0F9FF] to-[#FEF3C7]/40 text-slate-800 px-6 pt-7 pb-0 overflow-y-auto select-none">
      {/* Top Header & Branding */}
      <div className="w-full max-w-sm mx-auto text-center flex flex-col items-center">
        {/* Mascot */}
        <CuteMascot size="md" className="mb-2 animate-float" />

        <h1 className="text-3xl font-extrabold tracking-tight text-[#1E293B] font-heading flex items-center justify-center gap-1.5">
          <span className="text-[#3B82F6]">Weather</span>
          <span className="text-[#8B5CF6]">Mood</span>
        </h1>
        <p className="text-sm font-semibold text-slate-500 mt-0.5">
          Same sky, different feelings.
        </p>
        <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
          Discover how weather influences your mood with AI.
        </p>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="w-full mt-6 space-y-3.5 text-left">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex flex-col gap-1.5">
              <div className="flex items-start gap-2">
                <span className="font-bold text-sm">⚠️</span>
                <span className="leading-snug">{errorMsg}</span>
              </div>
              {errorMsg.includes('switch to Sign Up') && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setErrorMsg('');
                  }}
                  className="self-end text-[11px] font-bold text-indigo-700 underline hover:text-indigo-900"
                >
                  Switch to Sign Up now →
                </button>
              )}
            </div>
          )}

          {isSignUp && (
            <div>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all shadow-xs"
                />
              </div>
            </div>
          )}

          {/* Email or Phone */}
          <div className="relative flex items-center">
            <User className="absolute left-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Email or Phone Number"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all shadow-xs"
            />
          </div>

          {/* Password */}
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-11 py-3 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all shadow-xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1 px-1">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setForgotSent(false);
                setShowForgotModal(true);
              }}
              className="text-indigo-600 hover:text-indigo-700 font-semibold focus:outline-none"
            >
              Forgot Password?
            </button>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all transform active:scale-[0.98] text-sm flex items-center justify-center gap-2"
          >
            <span>{isSignUp ? 'Create Account' : 'Log In'}</span>
          </button>
        </form>

        {/* OR Divider */}
        <div className="w-full max-w-sm flex items-center my-4">
          <div className="flex-1 border-t border-slate-200"></div>
          <span className="px-3 text-xs font-semibold text-slate-400 tracking-wider">OR</span>
          <div className="flex-1 border-t border-slate-200"></div>
        </div>

        {/* Social Buttons */}
        <div className="w-full max-w-sm space-y-2.5">
          {/* Continue with Google button opens credentials modal */}
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            className="w-full py-2.5 px-4 bg-white/95 hover:bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={handleAppleLogin}
            className="w-full py-2.5 px-4 bg-white/95 hover:bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.85-11.96-14.42-6.53-9.96-11.75-21.75-15.66-35.39-3.92-13.64-5.88-26.25-5.88-37.84 0-14.75 3.69-27.18 11.06-37.28 7.38-10.1 16.74-15.22 28.09-15.35 4.8 0 10.16 1.25 16.08 3.75 5.92 2.5 9.77 3.82 11.55 3.97 1.45 0 5.46-1.39 12.03-4.17 6.57-2.77 12.28-3.96 17.13-3.56 12.74.83 23.01 5.67 30.82 14.53-11.16 6.77-16.63 16.29-16.42 28.56.21 9.87 4.09 18.23 11.64 25.07 7.56 6.84 16.32 10.74 26.28 11.7-2.23 7.02-4.8 13.73-7.72 20.14zM119.22 33.15c0-7.23 2.66-14.15 7.97-20.76 5.32-6.61 11.83-10.79 19.55-12.54.53 1.05.8 2.1.8 3.15 0 7.23-2.77 14.24-8.31 21.03-5.54 6.78-12.06 10.84-19.56 12.18-.11-1.05-.45-2.07-.45-3.06z"/>
            </svg>
            <span>Continue with Apple</span>
          </button>
        </div>

        {/* Toggle Sign Up / Sign In */}
        <div className="mt-4 text-xs text-slate-600 pb-2">
          {isSignUp ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setErrorMsg('');
                }}
                className="text-indigo-600 font-bold hover:underline"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setErrorMsg('');
                }}
                className="text-indigo-600 font-bold hover:underline"
              >
                Sign Up
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Google Credentials Modal */}
      {showGoogleModal && (
        <GoogleSignInModal
          onSuccess={(user) => {
            setShowGoogleModal(false);
            if (rememberMe) AppStore.setStoredUser(user);
            onLoginSuccess(user);
          }}
          onClose={() => setShowGoogleModal(false)}
        />
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl text-center">
            {forgotSent ? (
              <div>
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 text-lg">Reset Link Sent!</h3>
                <p className="text-xs text-slate-500 mt-2">
                  We sent password recovery instructions to <strong>{forgotEmail || 'your email'}</strong>.
                </p>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="mt-5 w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Reset Password</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Enter your email or phone number to receive a secure recovery code.
                </p>
                <input
                  type="text"
                  placeholder="name@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setForgotSent(true)}
                    className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                  >
                    Send Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Lush Garden Meadow Illustration */}
      <LushMeadow className="-mx-6 mt-2" />
    </div>
  );
};
