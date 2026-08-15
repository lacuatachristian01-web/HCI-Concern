import React, { useState } from 'react';
import { Leaf, Lock, Mail, ArrowRight, ArrowLeft, User as UserIcon, BookOpen, Eye, EyeOff, AlertCircle } from 'lucide-react';
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
          setInfoMsg('Account created. Check your email to confirm your address, then sign in below.');
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
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative">
      <div className="w-full max-w-[420px]">

        {/* Brand mark — small and left-aligned, not a huge centered badge */}
        <div className="flex items-center gap-2.5 mb-8 px-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-400 flex items-center justify-center shrink-0">
            <Leaf className="w-5 h-5 text-emerald-950" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight font-['Outfit']">GreenDesk</p>
            <p className="text-white/40 text-[11px] leading-tight">Classroom Concern Portal</p>
          </div>
        </div>

        <div
          className="rounded-2xl p-8 sm:p-9"
          style={{
            background: 'rgba(6, 20, 14, 0.32)',
            backdropFilter: 'blur(22px) saturate(150%)',
            WebkitBackdropFilter: 'blur(22px) saturate(150%)',
            border: '1px solid rgba(255, 255, 255, 0.10)',
            boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          {mode === 'signup' && (
            <button
              type="button"
              onClick={goToSignIn}
              className="flex items-center gap-1.5 text-[13px] font-medium text-white/50 hover:text-white/90 transition-colors cursor-pointer mb-5 -mt-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          )}

          <div className="mb-7">
            <h1 className="text-[26px] font-bold text-white font-['Outfit'] tracking-tight">
              {mode === 'signup' ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-white/45 text-[14px] mt-1.5 leading-relaxed">
              {mode === 'signup'
                ? 'Set up your student profile to start reporting classroom issues.'
                : 'Sign in to report and track classroom concerns.'}
            </p>
          </div>

          {(errorMsg || infoMsg) && (
            <div
              className={`flex items-start gap-2.5 px-3.5 py-3 rounded-xl text-[13px] leading-snug mb-6 ${errorMsg
                  ? 'bg-rose-500/10 text-rose-200 border border-rose-500/20'
                  : 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/20'
                }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 opacity-80" />
              <span>{errorMsg || infoMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <Field
                  label="Full name"
                  icon={<UserIcon className="w-[18px] h-[18px]" />}
                  type="text"
                  required
                  placeholder="Juan Dela Cruz"
                  value={fullName}
                  onChange={setFullName}
                />
                <Field
                  label="Course & year"
                  icon={<BookOpen className="w-[18px] h-[18px]" />}
                  type="text"
                  required
                  placeholder="BSIT – WMAD 4C"
                  value={courseYear}
                  onChange={setCourseYear}
                />
              </>
            )}

            <Field
              label="Email"
              icon={<Mail className="w-[18px] h-[18px]" />}
              type="email"
              required
              placeholder="you@student.edu.ph"
              value={email}
              onChange={setEmail}
            />

            <Field
              label="Password"
              icon={<Lock className="w-[18px] h-[18px]" />}
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
              value={password}
              onChange={setPassword}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="text-white/35 hover:text-white/70 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              }
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl font-semibold text-[15px] text-emerald-950 bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-400 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-emerald-950/40 border-t-emerald-950 rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'signup' ? 'Create account' : 'Sign in'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {mode === 'signin' && (
            <p className="text-center text-[13px] text-white/40 mt-6">
              New to GreenDesk?{' '}
              <button
                type="button"
                onClick={goToSignUp}
                className="text-emerald-300 hover:text-emerald-200 font-medium cursor-pointer"
              >
                Create an account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------------- */
/*  Shared field component — keeps every input's spacing/contrast in sync  */
/* ---------------------------------------------------------------------- */

interface FieldProps {
  label: string;
  icon: React.ReactNode;
  type: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  trailing?: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({
  label,
  icon,
  type,
  value,
  onChange,
  placeholder,
  required,
  minLength,
  trailing,
}) => (
  <div>
    <label className="block text-[12.5px] font-medium text-white/55 mb-1.5">
      {label}
    </label>
    <div
      className="flex items-center gap-2.5 w-full px-3.5 rounded-xl transition-colors"
      style={{
        background: 'rgba(3, 15, 10, 0.55)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
      }}
    >
      <span className="text-white/35 shrink-0 flex items-center">{icon}</span>
      <input
        type={type}
        required={required}
        minLength={minLength}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-white text-[14.5px] font-medium placeholder-white/25 focus:outline-none py-3"
      />
      {trailing && <span className="shrink-0 flex items-center">{trailing}</span>}
    </div>
  </div>
);