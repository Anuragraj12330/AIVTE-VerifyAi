import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  FileCheck2, 
  ShieldCheck, 
  FileText, 
  Clock3, 
  SlidersHorizontal,
  ChevronRight,
  Shield,
  X,
  Sparkles,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { AICTE_SEAL_IMG, REVIEWER_AVATAR } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export type NavigationTab = 
  | 'overview' 
  | 'applications' 
  | 'document-verification' 
  | 'compliance-checker' 
  | 'verification-reports' 
  | 'activity-logs' 
  | 'settings';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onQuickVerify?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
  onQuickVerify,
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'applications', label: 'Applications', icon: Building2 },
    { id: 'document-verification', label: 'Document Verification', icon: FileCheck2 },
    { id: 'compliance-checker', label: 'Compliance Checker', icon: ShieldCheck },
    { id: 'verification-reports', label: 'Verification Reports', icon: FileText },
    { id: 'activity-logs', label: 'Activity Logs', icon: Clock3 },
    { id: 'settings', label: 'Settings', icon: SlidersHorizontal },
  ] as const;

  const handleNavClick = (tabId: NavigationTab) => {
    onSelectTab(tabId);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#0b1329] border-r border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 transition-colors duration-200">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-cyan-500/40 shadow-xs dark:shadow-[0_0_15px_rgba(6,182,212,0.15)] bg-slate-100 dark:bg-slate-900">
            <img 
              src={AICTE_SEAL_IMG} 
              alt="AICTE VerifyAI" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-cyan-900/10 dark:bg-cyan-900/30 pointer-events-none">
              <Shield className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
              <span>AICTE VerifyAI</span>
              <span className="text-[10px] font-mono text-cyan-700 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-800/60 bg-cyan-50 dark:bg-cyan-950/60 px-1 py-0.2 rounded">APH</span>
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Regulatory Verification Suite</p>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer"
          aria-label="Close navigation menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Primary Action Button */}
      <div className="px-4 py-3">
        <button
          onClick={() => {
            if (onQuickVerify) onQuickVerify();
            else handleNavClick('document-verification');
          }}
          className="w-full py-2.5 px-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-900/20 dark:shadow-blue-950/50 flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer group active:scale-[0.98]"
        >
          <Sparkles size={14} className="text-cyan-200 transition-transform group-hover:rotate-12" />
          <span className="tracking-wide">Start Verification</span>
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-3 pb-1.5 pt-2 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
          Regulatory Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-600/20 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-cyan-500/30 font-semibold shadow-xs dark:shadow-[0_0_12px_rgba(6,182,212,0.1)]'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  size={16}
                  className={`shrink-0 ${
                    isActive ? 'text-blue-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-cyan-400 shadow-[0_0_6px_#06b6d4] shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* System Status Banner */}
      <div className="mx-3 my-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400">Rules Engine</span>
          <span className="font-mono text-cyan-700 dark:text-cyan-400 font-semibold">APH 2025-26</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400">OCR & Cross-Check</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">Active</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400">Security Mode</span>
          <span className="font-mono text-slate-700 dark:text-slate-300">Level 4 Cert</span>
        </div>
      </div>

      {/* Auditor Profile Footer & Logout */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#090f20]">
        <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700 shrink-0 bg-slate-200 dark:bg-slate-800">
              <img 
                src={user?.avatar || REVIEWER_AVATAR} 
                alt={user?.name || 'User'} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-slate-900" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {user?.name || 'Dr. Sunita Mehra'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {user?.designation || 'Regulatory Director'}
              </p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity" 
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
