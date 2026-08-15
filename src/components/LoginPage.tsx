import React, { useState } from 'react';
import { Leaf, Lock, Mail, ArrowRight, ArrowLeft, User as UserIcon, BookOpen, Eye, EyeOff, AlertCircle, UserPlus } from 'lucide-react';
import { signInWithEmail, signUpWithEmail, mapSupabaseUser } from '../supabaseClient';
import type { AppUser } from '../supabaseClient';

interface LoginPageProps {
  onLoginSuccess: (studentData: AppUser) => void;
}

type Mode = 'signin' | 'signup';

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<Mode>('signin');

  const [fullName, setFullName] = useState('');
  const [courseYear, setCourseYear] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const resetMessages = () => {
    setErrorMsg('');
    setInfoMsg('');
  };

  const goToSignUp = () => {
    setMode('signup');
    resetMessages();
  };

  const goToSignIn = () => {
    setMode('signin');
    resetMessages();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!fullName.trim() || !courseYear.trim()) {
          setErrorMsg('Please fill in your full name and course/year.');
          setLoading(false);
          return;
        }

        const { data, error } = await signUpWithEmail(email, password, fullName, courseYear);
        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }

        if (data.user && !data.session) {
          setInfoMsg('Account created! Check your email to confirm your address, then sign in below.');
          setMode('signin');
          setLoading(false);
          return;
        }

        if (data.user) {
          onLoginSuccess(mapSupabaseUser(data.user));
        }
      } else {
        const { data, error } = await signInWithEmail(email, password);
        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }
        if (data.user) {
          onLoginSuccess(mapSupabaseUser(data.user));
        }
      }
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 sm:p-12 relative">
      <div className="glass-card max-w-md w-full p-8 sm:p-10 border-emerald-400/40 shadow-2xl space-y-7 relative my-auto">

        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-300 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950 border border-emerald-300/40">
            <Leaf className="w-8 h-8 text-emerald-950 fill-emerald-950" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] tracking-tight">
              GreenDesk Portal
            </h1>
            <p className="text-emerald-200 text-sm font-semibold mt-1">
              Classroom Concern Reporting System
            </p>
          </div>
        </div>

        {mode === 'signup' && (
          <button
            type="button"
            onClick={goToSignIn}
            className="flex items-center gap-1.5 text-sm font-bold text-emerald-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </button>
        )}

        <div>
          <h2 className="text-xl font-extrabold text-white font-['Outfit']">
            {mode === 'signup' ? 'Create Your Account' : 'Sign In'}
          </h2>
          <p className="text-emerald-200/90 text-sm mt-0.5">
            {mode === 'signup'
              ? 'Takes less than a minute — used to auto-fill your reports.'
              : 'Welcome back! Enter your details to continue.'}
          </p>
        </div>

        {(errorMsg || infoMsg) && (
          <div
            className={`flex items-start gap-2.5 p-3.5 rounded-xl text-sm font-semibold border ${errorMsg
                ? 'bg-rose-950/70 border-rose-500/50 text-rose-100'
                : 'bg-teal-950/70 border-teal-500/50 text-teal-100'
              }`}
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{errorMsg || infoMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'signup' && (
            <>
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-white">
                  Full Name
                </label>
                <div className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl bg-emerald-950 border border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-emerald-400">
                  <UserIcon className="w-5 h-5 text-emerald-400 shrink-0" />
                  <input
                    type="text"
                    required
                    placeholder="Juan Dela Cruz"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-transparent text-white text-base font-semibold placeholder-emerald-500/70 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-white">
                  Course & Year
                </label>
                <div className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl bg-emerald-950 border border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-emerald-400">
                  <BookOpen className="w-5 h-5 text-emerald-400 shrink-0" />
                  <input
                    type="text"
                    required
                    placeholder="BSIT – WMAD 4C"
                    value={courseYear}
                    onChange={(e) => setCourseYear(e.target.value)}
                    className="w-full bg-transparent text-white text-base font-semibold placeholder-emerald-500/70 focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-white">
              Student Email
            </label>
            <div className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl bg-emerald-950 border border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-emerald-400">
              <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
              <input
                type="email"
                required
                placeholder="you@student.edu.ph"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-white text-base font-semibold placeholder-emerald-500/70 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-white">
              Password
            </label>
            <div className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl bg-emerald-950 border border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-emerald-400">
              <Lock className="w-5 h-5 text-emerald-400 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-white text-base font-semibold placeholder-emerald-500/70 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="text-emerald-400 hover:text-white shrink-0 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full glow-btn py-4 text-base font-black uppercase tracking-wide shadow-2xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {mode === 'signup' ? 'Creating Account...' : 'Signing In...'}
              </>
            ) : (
              <>
                <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {mode === 'signin' && (
          <div className="pt-1 border-t border-emerald-500/25">
            <button
              type="button"
              onClick={goToSignUp}
              className="w-full mt-4 py-3.5 rounded-xl font-bold text-emerald-100 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-emerald-300" />
              New here? Create an Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};