import React from 'react';
import { 
  PlusCircle, 
  ExternalLink, 
  Shield 
} from 'lucide-react';
import { getStoredConcerns } from '../supabaseClient';

interface PastReportsProps {
  onSelectTrack: (trackingNum: string) => void;
  onNewReport: () => void;
}

export const PastReportsPage: React.FC<PastReportsProps> = ({ onSelectTrack, onNewReport }) => {
  const concerns = getStoredConcerns();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="glass-card p-6 sm:p-8 border-emerald-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
            📋 Document Feature
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            📋 My Past Reports
          </h2>
          <p className="text-emerald-200/80 text-sm">
            View all reported classroom concerns stored in the system database.
          </p>
        </div>

        <button onClick={onNewReport} className="glow-btn px-5 py-3 text-sm font-bold shrink-0">
          <PlusCircle className="w-4 h-4" /> Report New Concern
        </button>
      </div>

      <div className="space-y-4">
        {concerns.map((report) => (
          <div 
            key={report.id || report.tracking_number}
            className="glass-card p-6 border-emerald-500/30 hover:border-emerald-400/60 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-emerald-500/20 pb-4">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-white text-base bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-500/30">
                  {report.tracking_number}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  report.priority === 'Urgent' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {report.priority === 'Urgent' ? '⚠️ Urgent' : '📌 Normal'}
                </span>
                {report.is_anonymous && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Anonymous
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-900/60 text-teal-300 border border-teal-500/40">
                  {report.status}
                </span>
                <button
                  onClick={() => onSelectTrack(report.tracking_number)}
                  className="p-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 hover:text-white transition-colors"
                  title="Open Status Tracker"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-xs text-emerald-300/60 block">Category</span>
                <span className="font-bold text-white">{report.category}</span>
              </div>
              <div>
                <span className="text-xs text-emerald-300/60 block">Location</span>
                <span className="font-bold text-white">{report.location}</span>
              </div>
              <div>
                <span className="text-xs text-emerald-300/60 block">Reporter</span>
                <span className="font-bold text-emerald-200">{report.student_name}</span>
              </div>
            </div>

            <p className="text-xs text-emerald-100/90 bg-emerald-950/60 p-3 rounded-xl border border-emerald-500/10">
              "{report.description}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
