import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User as UserIcon, BookOpen } from 'lucide-react';
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
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const resetMessages = () => {
    setErrorMsg('');
    setInfoMsg('');
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
          setInfoMsg('Account created. Check your email to confirm your address, then sign in.');
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
    <div
      className="min-h-screen w-full flex items-center justify-center p-3 sm:p-6"
      style={{
        backgroundImage: 'url(/night-city-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Full-frame border, like a picture frame around the whole scene */}
      <div className="w-full h-[calc(100vh-24px)] sm:h-[calc(100vh-48px)] rounded-3xl border border-white/25 overflow-hidden relative flex items-center justify-center">
        {/* Darken the frame edges slightly so the card pops */}
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />

        {/* Glass card */}
        <div
          className="relative w-full max-w-sm mx-4 rounded-3xl p-8 sm:p-9"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(18px) saturate(140%)',
            WebkitBackdropFilter: 'blur(18px) saturate(140%)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6)',
          }}
        >
          <h1 className="text-center text-[26px] font-bold text-white font-['Outfit'] mb-7">
            {mode === 'signup' ? 'Register' : 'Login'}
          </h1>

          {(errorMsg || infoMsg) && (
            <div
              className={`px-3.5 py-2.5 rounded-lg text-[13px] leading-snug mb-5 text-center ${errorMsg ? 'text-rose-200' : 'text-emerald-200'
                }`}
              style={{ background: 'rgba(0,0,0,0.25)' }}
            >
              {errorMsg || infoMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <>
                <UnderlineField
                  icon={<UserIcon className="w-[18px] h-[18px]" />}
                  placeholder="Full name"
                  type="text"
                  required
                  value={fullName}
                  onChange={setFullName}
                />
                <UnderlineField
                  icon={<BookOpen className="w-[18px] h-[18px]" />}
                  placeholder="Course & year"
                  type="text"
                  required
                  value={courseYear}
                  onChange={setCourseYear}
                />
              </>
            )}

            <UnderlineField
              icon={<Mail className="w-[18px] h-[18px]" />}
              placeholder="Email"
              type="email"
              required
              value={email}
              onChange={setEmail}
            />

            <UnderlineField
              icon={<Lock className="w-[18px] h-[18px]" />}
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={password}
              onChange={setPassword}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="text-white/60 hover:text-white cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              }
            />

            {mode === 'signin' && (
              <div className="flex items-center justify-between text-[13px] text-white/70 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 accent-emerald-400 cursor-pointer"
                  />
                  Remember me
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-[15px] text-emerald-950 bg-white hover:bg-emerald-50 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="w-4 h-4 border-2 border-emerald-900/30 border-t-emerald-900 rounded-full animate-spin" />
                </span>
              ) : mode === 'signup' ? (
                'Register'
              ) : (
                'Login'
              )}
            </button>
          </form>

          <p className="text-center text-[13px] text-white/70 mt-6">
            {mode === 'signin' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); resetMessages(); }}
                  className="text-white font-semibold cursor-pointer"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signin'); resetMessages(); }}
                  className="text-white font-semibold cursor-pointer"
                >
                  Login
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------------- */
/*  Underline-style field — icon + input on a single bottom border line   */
/* ---------------------------------------------------------------------- */

interface UnderlineFieldProps {
  icon: React.ReactNode;
  type: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  trailing?: React.ReactNode;
}

const UnderlineField: React.FC<UnderlineFieldProps> = ({
  icon,
  type,
  value,
  onChange,
  placeholder,
  required,
  minLength,
  trailing,
}) => (
  <div
    className="flex items-center gap-3 w-full pb-2.5"
    style={{ borderBottom: '1px solid rgba(255,255,255,0.35)' }}
  >
    <span className="text-white/70 shrink-0 flex items-center">{icon}</span>
    <input
      type={type}
      required={required}
      minLength={minLength}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent text-white text-[15px] font-medium placeholder-white/60 focus:outline-none"
    />
    {trailing && <span className="shrink-0 flex items-center">{trailing}</span>}
  </div>
);