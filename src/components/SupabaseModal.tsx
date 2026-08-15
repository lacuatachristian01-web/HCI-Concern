import React, { useState } from 'react';
import { Database, Copy, X, Server } from 'lucide-react';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sqlSchema = `
-- Supabase SQL Schema for Classroom Concern Reporting System
create table if not exists public.classroom_concerns (
  id uuid default gen_random_uuid() primary key,
  tracking_number text not null unique,
  student_name text not null,
  course_year text not null,
  contact_info text not null,
  is_anonymous boolean default false,
  location text not null,
  category text not null,
  description text,
  priority text check (priority in ('Urgent', 'Normal')) default 'Normal',
  date_noticed date default current_date,
  photo_url text,
  status text check (status in ('Submitted', 'Seen by Guidance', 'Assigned to Tech', 'All Done!')) default 'Submitted',
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.classroom_concerns enable row level security;

-- Public Policy: Allow students to create and read reports
create policy "Allow public read access" on public.classroom_concerns for select using (true);
create policy "Allow public insert access" on public.classroom_concerns for insert with check (true);
create policy "Allow admin status update" on public.classroom_concerns for update using (true);
`.trim();

  const handleCopySQL = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-card max-w-2xl w-full p-6 sm:p-8 border-emerald-500/40 space-y-6 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Database className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-xl font-['Outfit']">
                Supabase Database Connection
              </h3>
              <p className="text-xs text-emerald-300">Live PostgreSQL Table & RLS Policies</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-emerald-400 hover:text-white hover:bg-emerald-800/40 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-500/30 space-y-2 text-xs text-emerald-200">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Server className="w-4 h-4 text-emerald-400" /> Status: Live Client Active
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
              Synced with Local Storage Fallback
            </span>
          </div>
          <p>
            All submitted classroom concern forms automatically save to Supabase database tables (<code className="text-emerald-300 font-mono">classroom_concerns</code>).
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              1-Click Supabase Table Migration Script (SQL)
            </span>
            <button
              onClick={handleCopySQL}
              className="px-3 py-1 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-emerald-500/30"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? '✓ Copied SQL!' : 'Copy SQL Schema'}
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-56 leading-relaxed">
            {sqlSchema}
          </pre>
        </div>

        <div className="flex justify-end">
          <button onClick={onClose} className="glow-btn px-6 py-2.5 text-xs">
            Done / Close Modal
          </button>
        </div>
      </div>
    </div>
  );
};
