import React, { useState } from 'react';
import { 
  Search, 
  AlertCircle, 
  Sparkles
} from 'lucide-react';
import { getStoredConcerns, updateStoredConcernStatus } from '../supabaseClient';
import type { ConcernReport } from '../supabaseClient';

interface TrackStatusPageProps {
  initialTrackingCode?: string;
  onNewReport: () => void;
}

export const TrackStatusPage: React.FC<TrackStatusPageProps> = ({ 
  initialTrackingCode = '', 
  onNewReport 
}) => {
  const [searchCode, setSearchCode] = useState(initialTrackingCode || 'CR-89241');
  const [concerns, setConcerns] = useState<ConcernReport[]>(getStoredConcerns());
  const [selectedReport, setSelectedReport] = useState<ConcernReport | null>(
    getStoredConcerns().find(c => c.tracking_number.toLowerCase() === (initialTrackingCode || 'CR-89241').toLowerCase()) || getStoredConcerns()[0] || null
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = concerns.find(c => c.tracking_number.trim().toLowerCase() === searchCode.trim().toLowerCase());
    setSelectedReport(found || null);
  };

  const handleSimulateStatusAdvance = (id: string, currentStatus: ConcernReport['status']) => {
    let nextStatus: ConcernReport['status'] = 'Submitted';
    if (currentStatus === 'Submitted') nextStatus = 'Seen by Guidance';
    else if (currentStatus === 'Seen by Guidance') nextStatus = 'Assigned to Tech';
    else if (currentStatus === 'Assigned to Tech') nextStatus = 'All Done!';
    
    const updatedList = updateStoredConcernStatus(id, nextStatus, `Updated by Admin/Tech on ${new Date().toLocaleTimeString()}`);
    setConcerns(updatedList);
    setSelectedReport(updatedList.find(c => c.id === id) || null);
  };

  const STEPS = [
    { label: 'Submitted', color: '🟡 Yellow', desc: 'Waiting for Action' },
    { label: 'Seen by Guidance', color: '🔵 Blue', desc: 'Reviewed by Guidance Office' },
    { label: 'Assigned to Tech', color: '🟣 Purple', desc: 'Technician Dispatched' },
    { label: 'All Done!', color: '🟢 Green', desc: 'Problem Fixed & Closed' }
  ];

  const getStepIndex = (status: ConcernReport['status']) => {
    switch (status) {
      case 'Submitted': return 0;
      case 'Seen by Guidance': return 1;
      case 'Assigned to Tech': return 2;
      case 'All Done!': return 3;
      default: return 0;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      <div className="glass-card p-6 sm:p-8 border-emerald-500/30">
        <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
          Screen 4: Report Status Page
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] mb-2">
          🛠 Track My Report Status
        </h2>
        <p className="text-emerald-200/80 text-sm mb-6">
          Enter your 5-digit tracking code below to check live repair progress.
        </p>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-emerald-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. CR-89241 or CR-55412"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-white font-mono text-base font-bold placeholder-emerald-500 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            />
          </div>
          <button type="submit" className="glow-btn px-6 py-3.5 text-sm font-bold">
            Search Ticket
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-emerald-300/80">
          <span>Try sample tickets:</span>
          {concerns.slice(0, 3).map(c => (
            <button
              key={c.tracking_number}
              onClick={() => { setSearchCode(c.tracking_number); setSelectedReport(c); }}
              className="px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/30 font-mono"
            >
              {c.tracking_number} ({c.category})
            </button>
          ))}
        </div>
      </div>

      {selectedReport ? (
        <div className="glass-card p-6 sm:p-10 border-emerald-500/40 space-y-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-emerald-500/20 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xl font-extrabold text-white bg-emerald-900/80 px-3 py-1 rounded-lg border border-emerald-500/30">
                  {selectedReport.tracking_number}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedReport.priority === 'Urgent' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {selectedReport.priority === 'Urgent' ? '⚠️ Urgent Priority' : '📌 Normal Priority'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-2 flex items-center gap-2">
                {selectedReport.category} @ {selectedReport.location}
              </h3>
              <p className="text-xs text-emerald-300/70 mt-0.5">
                Reported on: {selectedReport.date_noticed} by {selectedReport.student_name} ({selectedReport.course_year})
              </p>
            </div>

            <button
              onClick={() => handleSimulateStatusAdvance(selectedReport.id!, selectedReport.status)}
              className="px-4 py-2 rounded-xl bg-teal-900/60 hover:bg-teal-800/80 border border-teal-500/40 text-teal-200 text-xs font-bold transition-all flex items-center gap-2"
              title="Simulate Guidance / Tech team updating ticket status"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-300 animate-spin" /> Advance Ticket Status (Demo)
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-widest">
              Real-Time Status Bar Tracker
            </h4>

            <div className="relative">
              <div className="hidden sm:block absolute top-1/2 left-8 right-8 h-1 bg-emerald-950 -translate-y-1/2 z-0" />
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
                {STEPS.map((step, idx) => {
                  const currentIdx = getStepIndex(selectedReport.status);
                  const isDone = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div 
                      key={step.label}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        isCurrent
                          ? 'bg-gradient-to-b from-emerald-800/80 to-emerald-950 border-emerald-400 text-white ring-2 ring-emerald-400/50 shadow-xl'
                          : isDone
                          ? 'bg-emerald-900/50 border-emerald-500/40 text-emerald-200'
                          : 'bg-emerald-950/30 border-emerald-500/10 text-emerald-500/50 opacity-60'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-xs ${
                        isCurrent 
                          ? 'bg-emerald-400 text-emerald-950 animate-bounce' 
                          : isDone 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-emerald-950 text-emerald-600 border border-emerald-800'
                      }`}>
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <div className="font-bold text-sm text-white">{step.label}</div>
                      <div className="text-[11px] text-emerald-200/70 mt-1">{step.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-emerald-950/60 p-6 rounded-2xl border border-emerald-500/20">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-widest">
                Issue Description & Details
              </h4>
              <p className="text-white text-sm leading-relaxed bg-emerald-900/40 p-4 rounded-xl border border-emerald-500/20">
                "{selectedReport.description}"
              </p>
              
              {selectedReport.admin_notes && (
                <div className="p-3 rounded-xl bg-teal-950/60 border border-teal-500/30 text-xs text-teal-200 space-y-1">
                  <span className="font-bold text-teal-300">Office / Tech Note:</span>
                  <p>{selectedReport.admin_notes}</p>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-3">
                Uploaded Photo Proof
              </h4>
              {selectedReport.photo_url ? (
                <img 
                  src={selectedReport.photo_url} 
                  alt="Uploaded classroom issue"
                  className="w-full max-h-52 object-cover rounded-xl border border-emerald-500/30 shadow-md"
                />
              ) : (
                <div className="h-40 rounded-xl bg-emerald-900/30 border border-dashed border-emerald-500/30 flex flex-col items-center justify-center text-xs text-emerald-300/60">
                  <AlertCircle className="w-6 h-6 mb-1" />
                  No photo attached with this report
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card p-12 text-center border-rose-500/30 space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h3 className="text-xl font-bold text-white">Tracking Code Not Found</h3>
          <p className="text-emerald-200/70 text-sm max-w-md mx-auto">
            We couldn't find a report matching "{searchCode}". Please double check your code or submit a new concern.
          </p>
          <button onClick={onNewReport} className="glow-btn px-6 py-3 text-sm">
            Create New Report Now
          </button>
        </div>
      )}
    </div>
  );
};
