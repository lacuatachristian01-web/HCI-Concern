import React from 'react';
import {
  Home,
  PlusCircle,
  Search,
  FileText,
  Leaf,
  LogOut,
  User,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: { name: string; course: string; email: string } | null;
  onLogout: () => void;
  collapsed: boolean;
  setCollapsed: (val: boolean | ((prev: boolean) => boolean)) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen
}) => {
  const navItems = [
    { id: 'home', label: 'Home Page', icon: Home },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'report', label: 'Report Concern', icon: PlusCircle, highlight: true },
    { id: 'track', label: 'Track Status', icon: Search },
    { id: 'history', label: 'History Completed', icon: FileText },
    { id: 'help', label: 'Help & Guide', icon: HelpCircle },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  // On mobile the drawer is always full-width, so never apply the icon-only
  // "collapsed" layout there — only respect `collapsed` on desktop (md+).
  const iconOnly = collapsed && !mobileOpen;

  return (
    <>
      {/* Mobile backdrop - only shown when drawer is open on small screens */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 bottom-0 z-50 md:z-auto bg-emerald-950/95 md:bg-emerald-950/40 border-r border-emerald-400/30 backdrop-blur-2xl transition-transform md:transition-[width] duration-300 shadow-2xl md:shadow-none flex flex-col w-72 shrink-0 h-screen md:sticky md:top-0 ${collapsed ? 'md:w-20' : 'md:w-72'
          } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
      >
        {/* Sidebar Header with 3-lines menu button that pushes content (no overlap) */}
        <div className="p-4 border-b border-emerald-500/20 flex items-center justify-between min-h-[72px] bg-emerald-950/30">
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group overflow-hidden select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-300 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-950 group-hover:scale-105 transition-transform backdrop-blur-md">
              <Leaf className="w-6 h-6 text-emerald-950 fill-emerald-950" />
            </div>
            {!iconOnly && (
              <div className="truncate">
                <h1 className="text-base font-black tracking-tight text-white font-['Outfit']">
                  GreenDesk
                </h1>
                <p className="text-[10px] text-emerald-200/90 font-bold truncate">Classroom System</p>
              </div>
            )}
          </div>

          {/* Desktop: collapse/expand toggle */}
          <button
            onClick={() => setCollapsed(prev => !prev)}
            className="hidden md:flex p-2 rounded-xl bg-emerald-900/50 hover:bg-emerald-800/70 text-emerald-200 border border-emerald-500/40 transition-colors cursor-pointer shrink-0"
            title={iconOnly ? "Expand Sidebar Menu" : "Collapse Sidebar Menu"}
          >
            <Menu className="w-5 h-5 text-emerald-300" />
          </button>

          {/* Mobile: close drawer button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-2 rounded-xl bg-emerald-900/50 hover:bg-emerald-800/70 text-emerald-200 border border-emerald-500/40 transition-colors cursor-pointer shrink-0"
            title="Close Menu"
          >
            <X className="w-5 h-5 text-emerald-300" />
          </button>
        </div>

        {/* Navigation Items List with Specific Functions */}
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
          {!iconOnly && (
            <div className="px-3 py-1 text-[10px] font-black text-emerald-300/90 uppercase tracking-widest">
              Task Menu
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            if (item.highlight) {
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full py-3 px-3 rounded-2xl bg-gradient-to-r from-emerald-600/80 to-teal-600/80 backdrop-blur-md text-white font-extrabold shadow-xl flex items-center transition-all cursor-pointer border border-emerald-400/50 ${iconOnly ? 'justify-center' : 'justify-between px-4'
                    }`}
                  title={iconOnly ? item.label : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-emerald-100 shrink-0" />
                    {!iconOnly && <span className="text-xs font-black tracking-wide whitespace-nowrap">{item.label}</span>}
                  </div>
                  {!iconOnly && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/25 text-white font-bold">Quick</span>
                  )}
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full py-3 px-3 rounded-2xl flex items-center transition-all cursor-pointer backdrop-blur-md ${iconOnly ? 'justify-center' : 'justify-between px-4'
                  } ${isActive
                    ? 'bg-emerald-500/40 text-white border border-emerald-400/60 shadow-lg font-black'
                    : 'text-emerald-100/90 hover:bg-emerald-900/40 hover:text-white font-bold'
                  }`}
                title={iconOnly ? item.label : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-emerald-300' : 'text-emerald-400'}`} />
                  {!iconOnly && <span className="text-xs font-extrabold whitespace-nowrap">{item.label}</span>}
                </div>
              </button>
            );
          })}

          {/* Database Status Button */}
        </nav>

        {/* Profile & Logout User Bar */}
        {currentUser && (
          <div className="p-3 border-t border-emerald-500/20 bg-emerald-950/40 backdrop-blur-md">
            <div className={`flex items-center ${iconOnly ? 'justify-center' : 'justify-between'}`}>
              {!iconOnly && (
                <div
                  onClick={() => handleNavClick('profile')}
                  className="flex items-center gap-2.5 truncate cursor-pointer hover:opacity-90"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/40 border border-emerald-400 flex items-center justify-center text-white font-bold text-xs shrink-0">
                    <User className="w-4 h-4 text-emerald-200" />
                  </div>
                  <div className="text-xs truncate">
                    <p className="font-extrabold text-white truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-emerald-300 font-bold truncate">{currentUser.course}</p>
                  </div>
                </div>
              )}
              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 hover:text-white border border-rose-500/40 transition-colors cursor-pointer shrink-0"
                title="Sign Out System"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};