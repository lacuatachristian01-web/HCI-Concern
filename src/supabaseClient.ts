import { createClient } from '@supabase/supabase-js';

// Your Supabase project credentials.
// Set these in a .env file at the project root:
//   VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
//   VITE_SUPABASE_ANON_KEY=YOUR-ANON-PUBLIC-KEY
// (See SUPABASE_SETUP_GUIDE.md for step-by-step instructions.)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emNvbXBhbnkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY3MDAwMDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ.mockkey';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface ConcernReport {
  id?: string;
  tracking_number: string;
  student_name: string;
  course_year: string;
  contact_info: string;
  is_anonymous: boolean;
  location: string;
  category: string;
  description: string;
  priority: 'Urgent' | 'Normal';
  date_noticed: string;
  photo_url?: string;
  status: 'Submitted' | 'Seen by Guidance' | 'Assigned to Tech' | 'All Done!';
  admin_notes?: string;
  created_at?: string;
}

export interface AppUser {
  id: string;
  name: string;
  course: string;
  email: string;
}

/* -------------------------------------------------------------------------- */
/*  AUTHENTICATION HELPERS (real Supabase Auth — no more hardcoded demo user) */
/* -------------------------------------------------------------------------- */

/** Create a brand-new student account. */
export const signUpWithEmail = async (
  email: string,
  password: string,
  fullName: string,
  courseYear: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        course_year: courseYear,
      },
    },
  });
  return { data, error };
};

/** Sign in an existing student account. */
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

/** Sign the current user out. */
export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

/** Get the current session (used on app load / page refresh). */
export const getCurrentSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

/** Convert a raw Supabase auth user object into the shape the UI uses. */
export const mapSupabaseUser = (user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}): AppUser => ({
  id: user.id,
  name: (user.user_metadata?.full_name as string) || user.email?.split('@')[0] || 'Student',
  course: (user.user_metadata?.course_year as string) || 'Not set',
  email: user.email || '',
});

/* -------------------------------------------------------------------------- */
/*  DEMO DATA (used only until you point the report list at your own table)   */
/* -------------------------------------------------------------------------- */

export const INITIAL_CONCERNS: ConcernReport[] = [
  {
    id: '1',
    tracking_number: 'CR-89241',
    student_name: 'Charles Patani',
    course_year: 'BSIT – WMAD 4C',
    contact_info: 'charles.patani@student.edu.ph',
    is_anonymous: false,
    location: 'ITE Lab 301',
    category: 'Broken PC',
    description: 'PC #14 display monitor flickers and power cable has a loose connection.',
    priority: 'Urgent',
    date_noticed: '2026-08-15',
    photo_url: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80',
    status: 'Assigned to Tech',
    admin_notes: 'Tech team dispatched to inspect GPU & power cables.',
    created_at: '2026-08-15T08:30:00Z'
  },
  {
    id: '2',
    tracking_number: 'CR-55412',
    student_name: 'Anonymous Student',
    course_year: 'BSIT 3B',
    contact_info: 'N/A (Anonymous)',
    is_anonymous: true,
    location: 'Room GS 203',
    category: 'Aircon / Fan',
    description: 'Ceiling fan #2 is making a loud rattling sound and swinging dangerously.',
    priority: 'Urgent',
    date_noticed: '2026-08-14',
    photo_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    status: 'Seen by Guidance',
    admin_notes: 'Referred to Campus Physical Plant & Maintenance office.',
    created_at: '2026-08-14T14:15:00Z'
  },
  {
    id: '3',
    tracking_number: 'CR-10293',
    student_name: 'Maria Santos',
    course_year: 'BSCS 2A',
    contact_info: 'maria.santos@student.edu.ph',
    is_anonymous: false,
    location: 'Lecture Room 105',
    category: 'Broken Armchair',
    description: 'Armrest on chair row 3 seat 5 is detached.',
    priority: 'Normal',
    date_noticed: '2026-08-12',
    status: 'All Done!',
    admin_notes: 'Replaced with spare armchair from storage.',
    created_at: '2026-08-12T09:00:00Z'
  }
];

// Helper functions for fallback local storage sync when Supabase live server is not yet connected
const LOCAL_STORAGE_KEY = 'ucd_classroom_concerns_v1';

export const getStoredConcerns = (): ConcernReport[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_CONCERNS));
    return INITIAL_CONCERNS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_CONCERNS;
  }
};

export const saveStoredConcern = (report: ConcernReport): ConcernReport => {
  const concerns = getStoredConcerns();
  concerns.unshift(report);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(concerns));
  return report;
};

export const updateStoredConcernStatus = (id: string, status: ConcernReport['status'], notes?: string): ConcernReport[] => {
  const concerns = getStoredConcerns();
  const updated = concerns.map(c => c.id === id ? { ...c, status, admin_notes: notes ?? c.admin_notes } : c);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};
