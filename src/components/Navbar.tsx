import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Home, 
  PlusCircle, 
  Search, 
  FileText, 
  UserCheck, 
  Leaf, 
  Database,
  LogOut,
  User
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openSupabaseModal: () => void;
  currentUser: { name: string; course: string; email: string } | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  openSupabaseModal,
  currentUser,
  onLogout 
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navButtons = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'report', label: '📱 Report Issue', icon: PlusCircle, highlight: true },
    { id: 'track', label: '🛠 Track Report', icon: Search },
    { id: 'history', label: '📋 History', icon: FileText },
    { id: 'persona', label: '👤 User Info', icon: UserCheck },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-emerald-950/90 border-b border-emerald-400/30 px-6 lg:px-12 py-3.5 flex items-center justify-between shadow-2xl">
        {/* Left Side: Clean 3-lines menu + Brand */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open Navigation Menu"
            className="p-2.5 rounded-2xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-500/40 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400 flex items-center gap-2 group cursor-pointer"
          >
            <Menu className="w-6 h-6 text-emerald-300 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-extrabold hidden sm:inline text-emerald-200 uppercase tracking-wider">Menu</span>
          </button>

          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-300 flex items-center justify-center shadow-lg shadow-emerald-950 group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6 text-emerald-950 fill-emerald-950" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white font-['Outfit'] group-hover:text-emerald-300 transition-colors flex items-center gap-2">
                GreenDesk <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold uppercase tracking-wider">Student Portal</span>
              </h1>
              <p className="text-xs text-emerald-300/80 font-medium">Classroom Concern System</p>
            </div>
          </div>
        </div>

        {/* Center / Right Nav Quick Access */}
        <div className="hidden lg:flex items-center gap-3">
          {navButtons.map((btn) => {
            const Icon = btn.icon;
            const isActive = activeTab === btn.id;
            if (btn.highlight) {
              return (
                <button
                  key={btn.id}
                  onClick={() => setActiveTab(btn.id)}
                  className="glow-btn text-xs px-5 py-2.5 font-extrabold uppercase tracking-wide flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Icon className="w-4 h-4" /> {btn.label}
                </button>
              );
            }
            return (
              <button
                key={btn.id}
                onClick={() => setActiveTab(btn.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive 
                    ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/60 shadow-inner' 
                    : 'text-emerald-100/80 hover:bg-emerald-900/60 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 text-emerald-400" /> {btn.label}
              </button>
            );
          })}

          <button
            onClick={openSupabaseModal}
            className="px-3.5 py-2.5 rounded-xl text-xs font-extrabold bg-teal-950/90 text-teal-300 border border-teal-500/40 hover:bg-teal-900 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Database className="w-4 h-4 text-teal-400 animate-pulse" /> DB Status
          </button>

          {/* User Profile & Logout */}
          {currentUser && (
            <div className="ml-2 pl-3 border-l border-emerald-500/30 flex items-center gap-3">
              <div className="text-right text-xs">
                <p className="font-extrabold text-white leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-emerald-300/80">{currentUser.course}</p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-500/40 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Drawer Overlay */}
      {drawerOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 transition-opacity"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* 3-Lines Side Drawer Navigation */}
      <aside className={`fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-emerald-950/98 border-r border-emerald-400/30 shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${
        drawerOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-5 border-b border-emerald-500/20 flex items-center justify-between bg-emerald-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-400 flex items-center justify-center shadow-md">
              <Leaf className="w-6 h-6 text-emerald-950" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base font-['Outfit']">System Menu</h2>
              <p className="text-xs text-emerald-300">Classroom Concern Portal</p>
            </div>
          </div>
          <button 
            onClick={() => setDrawerOpen(false)}
            className="p-2 text-emerald-300 hover:text-white hover:bg-emerald-800/60 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2.5 overflow-y-auto">
          <div className="px-3 py-1.5 text-[11px] font-extrabold text-emerald-400/80 uppercase tracking-widest">
            Select a Feature
          </div>

          <button
            onClick={() => { setActiveTab('home'); setDrawerOpen(false); }}
            className={`w-full text-left px-4 py-3.5 rounded-2xl flex items-center gap-3 transition-all text-sm font-extrabold cursor-pointer ${
              activeTab === 'home'
                ? 'bg-emerald-500/30 text-white border border-emerald-400/50 shadow-lg'
                : 'text-emerald-100 hover:bg-emerald-900/60'
            }`}
          >
            <Home className="w-5 h-5 text-emerald-300" />
            <span>🏠 Home Page</span>
          </button>

          <button
            onClick={() => { setActiveTab('report'); setDrawerOpen(false); }}
            className="w-full text-left px-4 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold shadow-lg flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <PlusCircle className="w-5 h-5 text-emerald-200 group-hover:rotate-90 transition-transform" />
              <span>📱 Report a Problem Now</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">Fast</span>
          </button>

          <button
            onClick={() => { setActiveTab('track'); setDrawerOpen(false); }}
            className={`w-full text-left px-4 py-3.5 rounded-2xl flex items-center gap-3 transition-all text-sm font-extrabold cursor-pointer ${
              activeTab === 'track'
                ? 'bg-emerald-500/30 text-white border border-emerald-400/50 shadow-lg'
                : 'text-emerald-100 hover:bg-emerald-900/60'
            }`}
          >
            <Search className="w-5 h-5 text-emerald-300" />
            <span>🛠 Track My Report Status</span>
          </button>

          <button
            onClick={() => { setActiveTab('history'); setDrawerOpen(false); }}
            className={`w-full text-left px-4 py-3.5 rounded-2xl flex items-center gap-3 transition-all text-sm font-extrabold cursor-pointer ${
              activeTab === 'history'
                ? 'bg-emerald-500/30 text-white border border-emerald-400/50 shadow-lg'
                : 'text-emerald-100 hover:bg-emerald-900/60'
            }`}
          >
            <FileText className="w-5 h-5 text-emerald-300" />
            <span>📋 My Past Reports</span>
          </button>

          <button
            onClick={() => { setActiveTab('persona'); setDrawerOpen(false); }}
            className={`w-full text-left px-4 py-3.5 rounded-2xl flex items-center gap-3 transition-all text-sm font-extrabold cursor-pointer ${
              activeTab === 'persona'
                ? 'bg-emerald-500/30 text-white border border-emerald-400/50 shadow-lg'
                : 'text-emerald-100 hover:bg-emerald-900/60'
            }`}
          >
            <UserCheck className="w-5 h-5 text-emerald-300" />
            <span>👤 User Persona & UCD Specs</span>
          </button>

          <div className="pt-4 border-t border-emerald-500/20">
            <button
              onClick={() => { openSupabaseModal(); setDrawerOpen(false); }}
              className="w-full text-left px-4 py-3 rounded-2xl bg-teal-950/80 border border-teal-500/40 text-teal-200 text-xs font-extrabold flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-teal-400" />
                <span>Supabase Live DB Status</span>
              </div>
            </button>
          </div>
        </nav>

        {currentUser && (
          <div className="p-4 border-t border-emerald-500/20 bg-emerald-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/30 border border-emerald-400 flex items-center justify-center text-white font-bold text-xs">
                <User className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="text-xs">
                <p className="font-extrabold text-white">{currentUser.name}</p>
                <p className="text-[10px] text-emerald-300/80">{currentUser.course}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="px-2.5 py-1.5 rounded-xl bg-rose-950 text-rose-300 text-xs font-bold border border-rose-500/40"
            >
              Sign Out
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
