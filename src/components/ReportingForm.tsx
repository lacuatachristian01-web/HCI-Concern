import React, { useState } from 'react';
import { 
  PlusCircle, 
  Upload, 
  MapPin, 
  Shield, 
  User, 
  Calendar, 
  Flame,
  CheckCircle2
} from 'lucide-react';
import { supabase, saveStoredConcern } from '../supabaseClient';
import type { ConcernReport } from '../supabaseClient';
import confetti from 'canvas-confetti';

interface ReportingFormProps {
  currentUser: { name: string; course: string; email: string } | null;
  onSuccessSubmit: (report: ConcernReport) => void;
}

export const ReportingForm: React.FC<ReportingFormProps> = ({ currentUser, onSuccessSubmit }) => {
  const [studentName, setStudentName] = useState(currentUser?.name || '');
  const [courseYear, setCourseYear] = useState(currentUser?.course || '');
  const [contactInfo, setContactInfo] = useState(currentUser?.email || '');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [location, setLocation] = useState('ITE Lab 301');
  const [customLocation, setCustomLocation] = useState('');
  const [category, setCategory] = useState('Broken PC');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Urgent' | 'Normal'>('Urgent');
  const [dateNoticed, setDateNoticed] = useState(new Date().toISOString().split('T')[0]);
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const LOCATIONS = [
    'ITE Lab 301',
    'ITE Lab 302 (Multimedia)',
    'Room GS 203',
    'Lecture Room 105',
    'Engineering Building 401',
    'Science Lab 102',
    'Other / Manual Location'
  ];

  const CATEGORIES = [
    { name: 'Broken PC', icon: '💻', desc: 'Monitors, power supply, mouse, keyboard' },
    { name: 'Aircon / Fan', icon: '❄️', desc: 'Leaking AC, rattling fan, no cooling' },
    { name: 'Faulty Outlets', icon: '🔌', desc: 'Sparking, no power, broken switch' },
    { name: 'Broken Armchair', icon: '🪑', desc: 'Detached writing table, wobbly legs' },
    { name: 'Roof / Cleanliness', icon: '🌧️', desc: 'Water leak, trash, dirty floor' }
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const trackingNum = `CR-${Math.floor(10000 + Math.random() * 90000)}`;
    const finalLocation = location === 'Other / Manual Location' ? customLocation : location;

    const newReport: ConcernReport = {
      tracking_number: trackingNum,
      student_name: isAnonymous ? 'Anonymous Student' : studentName,
      course_year: isAnonymous ? 'Hidden (Anonymous)' : courseYear,
      contact_info: isAnonymous ? 'N/A' : contactInfo,
      is_anonymous: isAnonymous,
      location: finalLocation || 'General Classroom',
      category: category,
      description: description || 'No text description provided. Image attached.',
      priority: priority,
      date_noticed: dateNoticed,
      photo_url: photoPreview || photoUrl || undefined,
      status: 'Submitted',
      admin_notes: 'Report received by system queue.',
      created_at: new Date().toISOString()
    };

    try {
      const { error } = await supabase.from('classroom_concerns').insert([newReport]);
      if (error) {
        console.warn('Supabase DB notice: using synchronized local storage fallback.', error.message);
      }
    } catch (err) {
      console.warn('Supabase offline or table pending, saving locally.');
    }

    saveStoredConcern(newReport);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#059669', '#fef08a']
    });

    setSubmitting(false);
    onSuccessSubmit(newReport);
  };

  return (
    <div className="w-full px-4 sm:px-8 py-6">
      <div className="glass-card p-6 sm:p-10 border-emerald-400/35 shadow-2xl relative overflow-hidden space-y-8">
        <div className="border-b border-emerald-500/25 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/25 text-emerald-200 text-xs font-extrabold mb-3 border border-emerald-400/40">
            <PlusCircle className="w-4 h-4 text-emerald-300" /> Easy 2-Minute Form
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
            📱 Report a Classroom Problem
          </h2>
          <p className="text-emerald-200/90 text-sm mt-1">
            Follow the simple steps below. Your student information is automatically saved!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          <div className="p-5 rounded-2xl bg-emerald-950/70 border border-emerald-500/30 space-y-4 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
              <span className="text-xs font-black text-emerald-300 tracking-wider uppercase flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-400" /> Step 1: Student Information
              </span>
              
              <label className="flex items-center gap-2 cursor-pointer bg-emerald-900/70 hover:bg-emerald-800 px-3.5 py-1.5 rounded-xl border border-emerald-500/40 text-xs transition-colors self-start sm:self-auto">
                <input 
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-emerald-400 bg-emerald-950 border-emerald-600 w-4 h-4"
                />
                <Shield className="w-4 h-4 text-amber-300" />
                <span className="font-extrabold text-emerald-200">Hide My Name (Anonymous)</span>
              </label>
            </div>

            {!isAnonymous ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1">Student Name</label>
                  <input 
                    type="text" 
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-900/60 border border-emerald-500/40 text-white text-sm font-semibold focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1">Course & Year</label>
                  <input 
                    type="text" 
                    value={courseYear}
                    onChange={(e) => setCourseYear(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-900/60 border border-emerald-500/40 text-white text-sm font-semibold focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1">Contact Details</label>
                  <input 
                    type="text" 
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-900/60 border border-emerald-500/40 text-white text-sm font-semibold focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-xs text-amber-200 flex items-center gap-2 font-medium">
                <Shield className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Anonymous Mode Enabled: Your identity will be kept completely private.</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black text-emerald-300 tracking-wider uppercase block">
              Step 2: Room Location & Date
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" /> Select Room / Lab
                </label>
                <select 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-white text-sm font-bold focus:ring-2 focus:ring-emerald-400 focus:outline-none cursor-pointer"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} className="bg-emerald-950 text-white font-medium">
                      {loc}
                    </option>
                  ))}
                </select>

                {location === 'Other / Manual Location' && (
                  <input 
                    type="text"
                    placeholder="Type room number or building name..."
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    className="mt-2 w-full px-3.5 py-2 rounded-xl bg-emerald-900/60 border border-emerald-500/40 text-white text-sm"
                    required
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-400" /> Date Problem First Noticed
                </label>
                <input 
                  type="date"
                  value={dateNoticed}
                  onChange={(e) => setDateNoticed(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-white text-sm font-bold focus:ring-2 focus:ring-emerald-400 focus:outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-black text-emerald-300 tracking-wider uppercase block">
              Step 3: Select Concern Category
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.name;
                return (
                  <button
                    type="button"
                    key={cat.name}
                    onClick={() => setCategory(cat.name)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-br from-emerald-600 to-teal-700 border-emerald-300 text-white shadow-xl ring-2 ring-emerald-400'
                        : 'bg-emerald-950/60 border-emerald-500/30 text-emerald-200 hover:bg-emerald-900/60'
                    }`}
                  >
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <div className="font-extrabold text-sm text-white">{cat.name}</div>
                    <div className="text-[11px] text-emerald-200/80 truncate mt-0.5">{cat.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-black text-emerald-300 tracking-wider uppercase block">
              Step 4: Priority Level (Select One)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPriority('Urgent')}
                className={`p-4 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                  priority === 'Urgent'
                    ? 'bg-gradient-to-r from-red-950 to-rose-900 border-rose-400 text-white ring-2 ring-rose-500 shadow-xl'
                    : 'bg-emerald-950/60 border-emerald-500/30 text-emerald-200 hover:bg-emerald-900/50'
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="p-2.5 rounded-xl bg-rose-500/30 text-rose-300">
                    <Flame className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-white">⚠️ Urgent</h4>
                    <p className="text-xs text-rose-200/90 font-medium">Needs action today (e.g. hazardous cable)</p>
                  </div>
                </div>
                {priority === 'Urgent' && <CheckCircle2 className="w-6 h-6 text-rose-400 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => setPriority('Normal')}
                className={`p-4 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                  priority === 'Normal'
                    ? 'bg-gradient-to-r from-emerald-800 to-teal-900 border-emerald-400 text-white ring-2 ring-emerald-400 shadow-xl'
                    : 'bg-emerald-950/60 border-emerald-500/30 text-emerald-200 hover:bg-emerald-900/50'
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="p-2.5 rounded-xl bg-emerald-500/30 text-emerald-300">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-white">📌 Normal</h4>
                    <p className="text-xs text-emerald-200/90 font-medium">Fix when possible (e.g. wobbly desk)</p>
                  </div>
                </div>
                {priority === 'Normal' && <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-black text-emerald-300 tracking-wider uppercase block">
              Step 5: Photo Snap & Short Description
            </span>

            <div>
              <textarea
                rows={3}
                placeholder="Write a brief explanation of what is broken (optional if photo attached)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-white text-sm font-medium focus:ring-2 focus:ring-emerald-400 focus:outline-none placeholder-emerald-400/60"
              />
            </div>

            <div>
              <div className="border-2 border-dashed border-emerald-500/40 hover:border-emerald-400 rounded-2xl p-5 text-center bg-emerald-950/60 transition-colors">
                {photoPreview ? (
                  <div className="space-y-3">
                    <img 
                      src={photoPreview} 
                      alt="Uploaded problem snap" 
                      className="max-h-52 mx-auto rounded-xl border border-emerald-500/50 shadow-lg object-cover" 
                    />
                    <button 
                      type="button" 
                      onClick={() => { setPhotoPreview(null); setPhotoUrl(''); }}
                      className="text-xs font-bold text-rose-300 hover:text-white underline cursor-pointer"
                    >
                      Remove Photo & Take New Snap
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer space-y-2 block">
                    <Upload className="w-9 h-9 text-emerald-400 mx-auto animate-bounce" />
                    <div className="text-sm font-bold text-white">Click here to attach or snap a photo</div>
                    <div className="text-xs text-emerald-300/80">Easier than typing long text! Accepts JPG, PNG, WEBP</div>
                    <input 
                      type="file" 
                      accept="image/* text/*" 
                      onChange={handlePhotoUpload} 
                      className="hidden" 
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full glow-btn py-4 text-base sm:text-lg font-black tracking-wide uppercase shadow-2xl flex items-center justify-center gap-3 cursor-pointer"
            >
              {submitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving to Supabase Database...
                </>
              ) : (
                <>
                  <span>📱 Submit Concern Report Now</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
