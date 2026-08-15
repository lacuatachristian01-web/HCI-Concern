import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { HomePage } from './components/HomePage';
import { ReportingForm } from './components/ReportingForm';
import { ConfirmationPage } from './components/ConfirmationPage';
import { TrackStatusPage } from './components/TrackStatusPage';
import { PastReportsPage } from './components/PastReportsPage';
import { PersonaUCDPage } from './components/PersonaUCDPage';
import { ProfilePage } from './components/ProfilePage';
import { SupabaseModal } from './components/SupabaseModal';
import { LoginPage } from './components/LoginPage';
import { supabase, signOutUser, mapSupabaseUser } from './supabaseClient';
import type { ConcernReport, AppUser } from './supabaseClient';

export function App() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<string>('home');
  const [lastSubmittedReport, setLastSubmittedReport] = useState<ConcernReport | null>(null);
  const [trackCode, setTrackCode] = useState<string>('');
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // On load, restore any existing Supabase session, and keep listening for
  // sign-in / sign-out events (e.g. from another tab, or token refresh).
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setCurrentUser(mapSupabaseUser(data.session.user));
      }
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(mapSupabaseUser(session.user));
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLoginSuccess = (userData: AppUser) => {
    setCurrentUser(userData);
    setActiveTab('home');
  };

  const handleLogout = async () => {
    await signOutUser();
    setCurrentUser(null);
    setActiveTab('login');
  };

  const handleFormSubmitSuccess = (report: ConcernReport) => {
    setLastSubmittedReport(report);
    setActiveTab('confirmation');
  };

  const handleTrackNow = (trackingNum: string) => {
    setTrackCode(trackingNum);
    setActiveTab('track');
  };

  // Avoid a flash of the login screen while we're still checking for an
  // existing Supabase session.
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-['Plus_Jakarta_Sans'] w-full">
        <span className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user is logged out, present clean Login/Sign Up screen
  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col font-['Plus_Jakarta_Sans'] w-full">
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-['Plus_Jakarta_Sans'] w-full">
      {/* Edge-to-edge persistent Desktop Left Sidebar / Mobile Drawer */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Full-Width Desktop Workspace Area */}
      <div className="flex-1 flex flex-col w-full min-w-0">
        {/* Mobile-only top bar with hamburger to open the sidebar drawer */}
        <div className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-emerald-950/90 backdrop-blur-xl border-b border-emerald-400/30">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open Menu"
            className="p-2 rounded-xl bg-emerald-900/70 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/40 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-black text-white font-['Outfit'] text-sm">GreenDesk</span>
        </div>

        <main
          className="flex-1 w-full flex flex-col items-center px-4 sm:px-8 pb-8"
          style={{ paddingTop: '80px' }}
        >
          <div className="w-full">
            {activeTab === 'home' && (
              <HomePage
                currentUser={currentUser}
                onStartReport={() => setActiveTab('report')}
                onTrackReport={() => setActiveTab('track')}
                onViewHistory={() => setActiveTab('history')}
                onViewProfile={() => setActiveTab('profile')}
                onViewHelp={() => setActiveTab('help')}
              />
            )}

            {activeTab === 'report' && (
              <ReportingForm
                currentUser={currentUser}
                onSuccessSubmit={handleFormSubmitSuccess}
              />
            )}

            {activeTab === 'confirmation' && lastSubmittedReport && (
              <ConfirmationPage
                report={lastSubmittedReport}
                onTrackNow={handleTrackNow}
                onBackHome={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'track' && (
              <TrackStatusPage
                initialTrackingCode={trackCode}
                onNewReport={() => setActiveTab('report')}
              />
            )}

            {activeTab === 'history' && (
              <PastReportsPage
                onSelectTrack={handleTrackNow}
                onNewReport={() => setActiveTab('report')}
              />
            )}

            {activeTab === 'persona' && (
              <PersonaUCDPage />
            )}

            {activeTab === 'profile' && (
              <ProfilePage
                currentUser={currentUser}
                onTrack={handleTrackNow}
              />
            )}

            {activeTab === 'help' && (
              <div className="max-w-2xl mx-auto glass-card p-8 space-y-3 border-emerald-500/30">
                <h2 className="text-2xl font-extrabold text-white font-['Outfit']">Help & Guide</h2>
                <p className="text-emerald-200/80 text-sm">
                  Use "Report Concern" to submit a new classroom issue, "Track Status" to check
                  progress with your tracking number, and "History" to browse past reports.
                </p>
              </div>
            )}
          </div>
        </main>

        <footer className="border-t border-emerald-500/20 bg-emerald-950/90 py-5 px-8 text-xs text-emerald-300/80 w-full">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© 2026 Student-Friendly Classroom Concern Reporting System • Powered by Supabase PostgreSQL & React</p>
            <div className="flex gap-4">
              <button onClick={() => setIsSupabaseModalOpen(true)} className="hover:text-emerald-200 underline cursor-pointer">
                Supabase Status
              </button>
              <button onClick={() => setActiveTab('persona')} className="hover:text-emerald-200 underline cursor-pointer">
                User Persona & UCD Notes
              </button>
            </div>
          </div>
        </footer>
      </div>

      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
    </div>
  );
}

export default App;
