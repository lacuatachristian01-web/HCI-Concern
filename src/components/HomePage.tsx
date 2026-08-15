import React from 'react';
import {
  Leaf,
  Sparkles,
  ShieldCheck,
  Clock,
  PlusCircle,
  Search,
  FileText,
  User
} from 'lucide-react';
import { getStoredConcerns } from '../supabaseClient';

interface HomePageProps {
  currentUser: { name: string; course: string; email: string } | null;
  onStartReport: () => void;
  onTrackReport: () => void;
  onViewHistory: () => void;
  onViewProfile: () => void;
  onViewHelp: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  currentUser,
  onStartReport,
  onTrackReport,
  onViewHistory,
  onViewProfile,
  onViewHelp
}) => {
  const concerns = getStoredConcerns();
  const openCount = concerns.filter(c => c.status !== 'All Done!').length;
  const resolvedCount = concerns.filter(c => c.status === 'All Done!').length;
  const firstName = currentUser?.name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-10 py-6 w-full">
      {/* Clean Home Page: Logo + System Name + Short Description */}
      <div className="glass-card p-8 sm:p-14 text-center border-emerald-400/40 shadow-2xl relative space-y-7">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-300 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-950 border-2 border-emerald-300/50">
          <Leaf className="w-14 h-14 sm:w-16 sm:h-16 text-emerald-950 fill-emerald-950" />
        </div>

        <div className="space-y-3">
          <p className="text-emerald-300 text-sm sm:text-base font-bold">
            Welcome back, {firstName} 👋
          </p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white font-['Outfit'] tracking-tight">
            GreenDesk Portal
          </h1>
          <p className="text-emerald-300 text-base sm:text-lg font-extrabold uppercase tracking-widest">
            Student-Friendly Classroom Concern Reporting System
          </p>
        </div>

        <p className="text-emerald-100 text-lg sm:text-2xl leading-relaxed max-w-3xl mx-auto font-medium">
          A fast, simple, and guilt-free platform designed for students to report classroom issues (broken chairs, faulty fans/ACs, malfunctioning PCs, exposed outlets) in <strong className="text-emerald-300 underline font-bold">under 2 minutes</strong> directly to Guidance and Tech support.
        </p>

        {/* Quick actions — now actually wired up */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button onClick={onStartReport} className="glow-btn px-6 py-3 text-sm font-bold">
            <PlusCircle className="w-4 h-4" /> Report a Concern
          </button>
          <button
            onClick={onTrackReport}
            className="px-6 py-3 rounded-xl font-bold text-emerald-200 bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-500/30 flex items-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4" /> Track a Report
          </button>
          <button
            onClick={onViewHistory}
            className="px-6 py-3 rounded-xl font-bold text-emerald-200 bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-500/30 flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" /> View History
          </button>
          <button
            onClick={onViewProfile}
            className="px-6 py-3 rounded-xl font-bold text-emerald-200 bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-500/30 flex items-center gap-2 cursor-pointer"
          >
            <User className="w-4 h-4" /> My Profile
          </button>
        </div>
      </div>

      {/* System Highlights + live stats pulled from stored concerns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-card p-7 text-center space-y-3 border-emerald-400/30">
          <ShieldCheck className="w-10 h-10 text-emerald-300 mx-auto" />
          <h3 className="text-lg font-extrabold text-white">Guilt-Free & Anonymous</h3>
          <p className="text-sm text-emerald-200/90 leading-relaxed">Option to report issues anonymously without fear of blame.</p>
        </div>

        <div className="glass-card p-7 text-center space-y-3 border-emerald-400/30">
          <Clock className="w-10 h-10 text-emerald-300 mx-auto" />
          <h3 className="text-lg font-extrabold text-white">Real-Time Progress</h3>
          <p className="text-sm text-emerald-200/90 leading-relaxed">
            {openCount} report{openCount === 1 ? '' : 's'} currently in progress, {resolvedCount} resolved.
          </p>
        </div>

        <div className="glass-card p-7 text-center space-y-3 border-emerald-400/30">
          <Sparkles className="w-10 h-10 text-teal-300 mx-auto" />
          <h3 className="text-lg font-extrabold text-white">Supabase PostgreSQL</h3>
          <p className="text-sm text-emerald-200/90 leading-relaxed">All concern reports are stored safely in cloud database queues.</p>
        </div>
      </div>

      <div className="text-center">
        <button onClick={onViewHelp} className="text-xs text-emerald-300/80 underline hover:text-emerald-200 cursor-pointer">
          Need help using GreenDesk?
        </button>
      </div>
    </div>
  );
};
