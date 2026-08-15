import React from 'react';
import { User, Mail, BookOpen, ShieldCheck, CheckCircle2, FileText } from 'lucide-react';
import { getStoredConcerns } from '../supabaseClient';

interface ProfilePageProps {
  currentUser: { name: string; course: string; email: string } | null;
  onTrack: (code: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, onTrack }) => {
  const userConcerns = getStoredConcerns().filter(c => c.student_name === currentUser?.name);

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* Profile Card */}
      <div className="glass-card p-8 border-emerald-400/40 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-emerald-500/20 pb-6 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/30 border-2 border-emerald-400 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl shrink-0">
            <User className="w-10 h-10 text-emerald-300" />
          </div>
          <div>
            <span className="text-xs font-black text-emerald-300 uppercase tracking-widest block">Student Account Profile</span>
            <h2 className="text-3xl font-black text-white font-['Outfit']">{currentUser?.name || 'Charles Patani'}</h2>
            <p className="text-emerald-200 text-sm font-semibold mt-0.5">{currentUser?.course || 'BSIT – WMAD 4C'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/20 space-y-1">
            <span className="text-xs font-bold text-emerald-300/70 block uppercase">Student Email</span>
            <p className="font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400" /> {currentUser?.email || 'charles.patani@student.edu.ph'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/20 space-y-1">
            <span className="text-xs font-bold text-emerald-300/70 block uppercase">Enrolled Course</span>
            <p className="font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" /> {currentUser?.course || 'BSIT – WMAD 4C'}
            </p>
          </div>
        </div>
      </div>

      {/* Submitted Reports List */}
      <div className="glass-card p-6 border-emerald-400/30 space-y-4">
        <h3 className="text-lg font-black text-white font-['Outfit'] flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-400" /> My Submitted Concerns ({userConcerns.length})
        </h3>

        {userConcerns.length > 0 ? (
          <div className="space-y-3">
            {userConcerns.map(c => (
              <div key={c.tracking_number} className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/30 flex justify-between items-center text-xs">
                <div>
                  <span className="font-mono font-bold text-white text-sm block">{c.tracking_number}</span>
                  <span className="text-emerald-200">{c.category} @ {c.location}</span>
                </div>
                <button
                  onClick={() => onTrack(c.tracking_number)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-800/60 hover:bg-emerald-700 text-white font-bold border border-emerald-400/40"
                >
                  Track Status
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-emerald-200/70 italic">No concern reports submitted under this profile yet.</p>
        )}
      </div>
    </div>
  );
};
