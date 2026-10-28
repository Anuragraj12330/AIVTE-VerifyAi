import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  SlidersHorizontal,
  FileCheck2,
  AlertTriangle,
  CheckCircle,
  X,
  Sun,
  Moon,
  LogOut,
  ShieldCheck,
  User,
  ChevronDown
} from 'lucide-react';
import { REVIEWER_AVATAR } from '../data/mockData';
import { NavigationTab } from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  currentTab: NavigationTab;
  onOpenMobile: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavigateTab: (tab: NavigationTab) => void;
  onQuickVerify?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobile,
  searchQuery,
  onSearchChange,
  onNavigateTab,
  onQuickVerify,
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    {
      id: 'notif-1',
      title: 'Architect Area Variance Flagged',
      desc: 'Apex Institute of Technology declared +2,650 sq.m above municipal sanction plan.',
      time: '12m ago',
      unread: true,
      type: 'warning'
    },
    {
      id: 'notif-2',
      title: 'Fire NOC Term Expired',
      desc: 'National Polytechnic College NOC lapsed on 14-Aug-2026. Renewal challan attached.',
      time: '1h ago',
      unread: true,
      type: 'warning'
    },
    {
      id: 'notif-3',
      title: 'Accreditation Tier-1 Verified',
      desc: 'Vanguard Institute PGDM Program successfully verified against NBA database.',
      time: '3h ago',
      unread: false,
      type: 'pass'
    }
  ];

  const getPageTitle = (tab: NavigationTab) => {
    switch (tab) {
      case 'overview':
        return 'Executive Overview';
      case 'applications':
        return 'Institutional Applications';
      case 'document-verification':
        return 'Document Verification Workspace';
      case 'compliance-checker':
        return 'Regulatory Compliance Checker';
      case 'verification-reports':
        return 'Official Verification Reports';
      case 'activity-logs':
        return 'Audit & Verification Activity Logs';
      case 'settings':
        return 'Platform & AI Settings';
      default:
        return 'Regulatory Console';
    }
  };

  const handleLogoutClick = async () => {
    setShowProfileMenu(false);
    await logout();
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-[#080e21]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 py-3 transition-colors duration-200">
      <div className="flex items-center justify-between gap-4">
        {/* Left Section: Mobile Menu & Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobile}
            className="lg:hidden p-2 -ml-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
            aria-label="Open mobile navigation"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span className="truncate">AICTE Regulatory Portal</span>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-medium truncate">{getPageTitle(currentTab)}</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate hidden sm:block">
              {getPageTitle(currentTab)}
            </h2>
          </div>
        </div>

        {/* Center/Right Section: Search, Theme, Notifications, Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Search Bar */}
          <div className="relative hidden md:block w-48 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search institutions or Ref #..."
              className="w-full pl-9 pr-8 py-1.5 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Quick Start Verification Button */}
          <button
            onClick={() => {
              if (onQuickVerify) onQuickVerify();
              else onNavigateTab('document-verification');
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-700 dark:text-cyan-200 bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 hover:border-cyan-300 dark:hover:border-cyan-700 transition-colors cursor-pointer"
          >
            <FileCheck2 size={14} className="text-cyan-600 dark:text-cyan-400" />
            <span>Verify Document</span>
          </button>

          {/* LIGHT / DARK MODE TOGGLE */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800/80 transition-all cursor-pointer flex items-center justify-center"
          >
            {theme === 'dark' ? (
              <Sun size={17} className="text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon size={17} className="text-indigo-600 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800/80 transition-colors cursor-pointer"
              aria-label="View notifications"
            >
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]" />
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 shadow-2xl p-4 text-xs z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-semibold text-slate-900 dark:text-white">Regulatory Notifications</span>
                  <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400">2 Actionable</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-72 overflow-y-auto mt-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-2.5 first:pt-1 last:pb-1">
                      <div className="flex items-start gap-2.5">
                        {n.type === 'warning' ? (
                          <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{n.title}</p>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 line-clamp-2">{n.desc}</p>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-center">
                  <button 
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigateTab('activity-logs');
                    }}
                    className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 text-[11px] font-medium cursor-pointer"
                  >
                    View Complete Audit Trail →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-colors cursor-pointer"
              aria-label="User profile"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-500/40 bg-slate-200 dark:bg-slate-800">
                <img 
                  src={user?.avatar || REVIEWER_AVATAR} 
                  alt={user?.name || 'User Profile'} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <ChevronDown size={13} className="text-slate-500 hidden sm:block" />
            </button>

            {/* Profile Popover */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 shadow-2xl p-3.5 text-xs z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-cyan-500/40 bg-slate-200 dark:bg-slate-800 shrink-0">
                      <img 
                        src={user?.avatar || REVIEWER_AVATAR} 
                        alt={user?.name || 'User Profile'} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 dark:text-white truncate">
                        {user?.name || 'Dr. Sunita Mehra'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user?.email || 'officer@aicte-india.org'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-200 dark:border-cyan-800/40">
                      {user?.role || 'Regulatory Director'}
                    </span>
                    <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <ShieldCheck size={12} />
                      <span>Verified Signatory</span>
                    </span>
                  </div>
                </div>

                <div className="py-2 space-y-1">
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigateTab('settings');
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>Platform & Inspection Preferences</span>
                    <SlidersHorizontal size={13} />
                  </button>
                </div>

                {/* Working Logout Action */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-between transition-colors cursor-pointer font-medium"
                  >
                    <span>Sign Out of AICTE VerifyAI</span>
                    <LogOut size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="mt-2.5 md:hidden">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search applications..."
            className="w-full pl-9 pr-8 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-cyan-500"
          />
        </div>
      </div>
    </header>
  );
};
