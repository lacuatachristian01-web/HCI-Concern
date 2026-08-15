import React from 'react';
import { 
  CheckCircle2, 
  Search, 
  Copy, 
  Home
} from 'lucide-react';
import type { ConcernReport } from '../supabaseClient';

interface ConfirmationPageProps {
  report: ConcernReport;
  onTrackNow: (trackingNum: string) => void;
  onBackHome: () => void;
}

export const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ 
  report, 
  onTrackNow, 
  onBackHome 
}) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(report.tracking_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="glass-card p-8 sm:p-12 border-emerald-500/40 text-center space-y-6 relative overflow-hidden shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-300 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/80 animate-bounce">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>

        <div className="space-y-2">
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            Screen 3: Confirmation Page
          </div>
          <h2 className="text-3xl font-extrabold text-white font-['Outfit']">
            Report Submitted Successfully!
          </h2>
          <p className="text-emerald-200/80 text-sm max-w-md mx-auto">
            Your classroom concern has been safely recorded in the database queue and routed to the Guidance Office.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 space-y-3">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
            Your Official Tracking Number
          </span>
          
          <div className="flex items-center justify-center gap-3">
            <span className="font-mono text-3xl font-extrabold text-white tracking-widest bg-emerald-900/60 px-4 py-2 rounded-xl border border-emerald-500/40">
              {report.tracking_number}
            </span>
            <button
              onClick={copyToClipboard}
              className="p-3 rounded-xl bg-emerald-800/60 hover:bg-emerald-700/80 text-emerald-200 hover:text-white transition-colors border border-emerald-500/30"
              title="Copy tracking code"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
          {copied && <p className="text-xs font-semibold text-emerald-300">✓ Copied to clipboard!</p>}
        </div>

        <div className="text-left p-5 rounded-2xl bg-emerald-900/30 border border-emerald-500/20 space-y-2 text-sm">
          <div className="flex justify-between border-b border-emerald-500/10 pb-1.5">
            <span className="text-emerald-200/60">Location:</span>
            <span className="font-semibold text-white">{report.location}</span>
          </div>
          <div className="flex justify-between border-b border-emerald-500/10 pb-1.5">
            <span className="text-emerald-200/60">Category:</span>
            <span className="font-semibold text-white">{report.category}</span>
          </div>
          <div className="flex justify-between border-b border-emerald-500/10 pb-1.5">
            <span className="text-emerald-200/60">Priority Level:</span>
            <span className={`font-bold px-2 py-0.5 rounded text-xs ${
              report.priority === 'Urgent' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {report.priority === 'Urgent' ? '⚠️ Urgent' : '📌 Normal'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-emerald-200/60">Current Status:</span>
            <span className="font-bold text-yellow-300">🟡 Submitted (Waiting for Action)</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => onTrackNow(report.tracking_number)}
            className="glow-btn flex-1 py-3 text-sm font-bold"
          >
            <Search className="w-4 h-4" /> 🛠 Track My Report Status
          </button>
          <button
            onClick={onBackHome}
            className="px-6 py-3 rounded-xl font-semibold text-emerald-200 bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-500/30 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Back to Home Page
          </button>
        </div>
      </div>
    </div>
  );
};
