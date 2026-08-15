import React from 'react';
import { 
  User, 
  Target, 
  HelpCircle, 
  Smartphone, 
  Sparkles, 
  Award
} from 'lucide-react';

export const PersonaUCDPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      <div className="glass-card p-6 sm:p-10 border-emerald-500/30">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
          <Award className="w-4 h-4 text-emerald-400" /> Laboratory Activity - User Centered Design (UCD)
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit']">
          Target User Persona & UCD Analysis
        </h2>
        <p className="text-emerald-200/80 text-sm mt-2">
          Directly generated from interview records conducted on July 30, 2026 for HCI Laboratory Activity.
        </p>
      </div>

      <div className="glass-card p-6 sm:p-10 border-emerald-500/40 space-y-6 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-b border-emerald-500/20 pb-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-1 shrink-0 shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" 
              alt="Charles Patani Persona"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Interviewed Student Persona
            </span>
            <h3 className="text-3xl font-extrabold text-white font-['Outfit']">CHARLES PATANI</h3>
            <p className="text-emerald-300 text-sm font-semibold">23 Years Old • 4th Year BSIT – WMAD 4C</p>
            <p className="text-emerald-200/70 text-xs mt-1">Interview Date: July 30, 2026</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="bg-emerald-950/60 p-5 rounded-2xl border border-emerald-500/20 space-y-2">
            <h4 className="font-bold text-emerald-300 uppercase text-xs tracking-wider flex items-center gap-2">
              <User className="w-4 h-4" /> Background
            </h4>
            <p className="text-emerald-100/90 leading-relaxed text-xs">
              He is a college student from Information Technology Department who faces frequent classroom issues (broken PCs, dysfunctional ACs, faulty outlets, broken armchairs). He has never reported issues before due to tedious paper forms.
            </p>
          </div>

          <div className="bg-emerald-950/60 p-5 rounded-2xl border border-emerald-500/20 space-y-2">
            <h4 className="font-bold text-emerald-300 uppercase text-xs tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4" /> Goals & Core Needs
            </h4>
            <ul className="text-emerald-100/90 text-xs space-y-1 list-disc list-inside">
              <li>Get classroom problems fixed quickly so learning isn't disrupted.</li>
              <li>Report issues in <strong>under 2 minutes</strong> on a mobile phone.</li>
              <li>Autofill personal information to avoid retyping every time.</li>
              <li>Real-time status updates and assurance of action.</li>
            </ul>
          </div>

          <div className="bg-emerald-950/60 p-5 rounded-2xl border border-emerald-500/20 space-y-2">
            <h4 className="font-bold text-amber-300 uppercase text-xs tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4" /> User Difficulties & Concerns
            </h4>
            <ul className="text-emerald-100/90 text-xs space-y-1 list-disc list-inside">
              <li>Current paper-based process requires too many forms and signatures.</li>
              <li>Fear of blame: "Will the professor/dean think I broke it?"</li>
              <li>Wasted effort: "Will admin just ignore photo submissions?"</li>
              <li>Privacy: "Who sees my phone number & personal details?"</li>
            </ul>
          </div>

          <div className="bg-emerald-950/60 p-5 rounded-2xl border border-emerald-500/20 space-y-2">
            <h4 className="font-bold text-teal-300 uppercase text-xs tracking-wider flex items-center gap-2">
              <Smartphone className="w-4 h-4" /> Tech Preferences & Features
            </h4>
            <ul className="text-emerald-100/90 text-xs space-y-1 list-disc list-inside">
              <li>Mobile-optimized responsive design.</li>
              <li>Photo/video upload instead of writing long descriptions.</li>
              <li>Location dropdown list (e.g. ITE 301) to prevent typos.</li>
              <li>Quick priority buttons: "Urgent" vs "Normal".</li>
              <li>Anonymous reporting toggle for guilt-free reporting.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 border-emerald-500/30 space-y-3">
        <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" /> Part 4: Defined Problem Statement
        </h3>
        <blockquote className="p-4 rounded-xl bg-emerald-950/80 border-l-4 border-emerald-400 text-emerald-100 text-sm italic">
          "Our target user needs a way to report classroom problems (broken chairs, fans, PCs, outlets, and ACs) because the current process is unclear, requires too many requirements, and the user has never reported anything before – so they need a fast, mobile-friendly, and guilt-free system that gives them confidence that their concern will be seen and fixed."
        </blockquote>
      </div>
    </div>
  );
};
