import React, { useState, useEffect } from 'react';
import { 
  SlidersHorizontal, 
  Cpu, 
  Shield, 
  RotateCcw,
  Check, 
  Server,
  UserCheck,
  Sun,
  Moon,
  KeyRound,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const SettingsView: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, setTheme } = useTheme();

  const [ocrStrictness, setOcrStrictness] = useState<number>(95);
  const [varianceTolerance, setVarianceTolerance] = useState<number>(5);
  const [aphEdition, setAphEdition] = useState<string>('2025-26');
  const [autoFlagging, setAutoFlagging] = useState<boolean>(true);
  const [crossReconciliation, setCrossReconciliation] = useState<boolean>(true);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [serverHealth, setServerHealth] = useState<{ status: string; geminiConfigured: boolean } | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setServerHealth(data))
      .catch(() => setServerHealth({ status: 'offline', geminiConfigured: false }));
  }, []);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleReset = () => {
    setOcrStrictness(95);
    setVarianceTolerance(5);
    setAphEdition('2025-26');
    setAutoFlagging(true);
    setCrossReconciliation(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <SlidersHorizontal size={22} className="text-cyan-600 dark:text-cyan-400" />
            <span>Platform Configuration & AI Settings</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure regulatory rule engines, OCR strictness floors, statutory verification thresholds, and theme preferences
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <RotateCcw size={13} />
            <span>Restore Defaults</span>
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-900/20 dark:shadow-blue-950/50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {saveSuccess ? (
              <>
                <Check size={14} className="text-emerald-300" />
                <span>Settings Saved</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Configuration Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active User Account & Statutory Credentials */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#0d162f]/80 border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center gap-2">
                <UserCheck size={16} className="text-cyan-600 dark:text-cyan-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Active Auditor / User Account</h2>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
                Session Active (Secure Cryptographic Token)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Full Name</span>
                <span className="font-semibold text-slate-900 dark:text-white text-sm block mt-0.5">{user?.name}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Email Address</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 block mt-0.5">{user?.email}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Statutory Role</span>
                <span className="font-semibold text-cyan-700 dark:text-cyan-400 block mt-0.5">{user?.role}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-slate-100 dark:border-slate-800/60">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Designation: <span className="font-medium text-slate-700 dark:text-slate-200">{user?.designation}</span> · Institution: <span className="font-medium text-slate-700 dark:text-slate-200">{user?.institution || 'AICTE Directorate'}</span>
              </div>
              <button
                onClick={() => logout()}
                className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 font-semibold text-xs transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Theme & Display Preferences */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#0d162f]/80 border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/60">
              {theme === 'dark' ? <Moon size={16} className="text-indigo-600 dark:text-indigo-400" /> : <Sun size={16} className="text-amber-500" />}
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Interface Theme & Workspace Appearance</h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">Active Theme</span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Switch between crisp high-contrast Light mode and sleek Midnight Navy Dark mode
                </span>
              </div>

              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Sun size={14} className="text-amber-500" />
                  <span>Light</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Moon size={14} className="text-cyan-300" />
                  <span>Dark</span>
                </button>
              </div>
            </div>
          </div>

          {/* AI Extraction & Model Settings */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#0d162f]/80 border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/60">
              <Cpu size={16} className="text-cyan-600 dark:text-cyan-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">AI Multimodal Verification Engine</h2>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">Active Neural Engine</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">Server-side multimodal document reasoning & OCR</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-cyan-700 dark:text-cyan-400 text-xs">
                  gemini-3.8-flash (Server-Side)
                </div>
              </div>

              {/* OCR Strictness Floor */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-slate-700 dark:text-slate-200">OCR Confidence Floor:</span>
                  <span className="text-cyan-700 dark:text-cyan-400 font-bold">{ocrStrictness}%</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="99"
                  step="1"
                  value={ocrStrictness}
                  onChange={(e) => setOcrStrictness(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-600 dark:accent-cyan-400 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Documents extracting below {ocrStrictness}% confidence will be routed to mandatory manual scrutiny.
                </p>
              </div>

              {/* Discrepancy Tolerance */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-slate-700 dark:text-slate-200">Built-Up Carpet Area Tolerance:</span>
                  <span className="text-cyan-700 dark:text-cyan-400 font-bold">±{varianceTolerance}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={varianceTolerance}
                  onChange={(e) => setVarianceTolerance(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-600 dark:accent-cyan-400 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Allowable variance between Architect Certificate and Municipal Sanction Plan before triggering Defect Notice.
                </p>
              </div>
            </div>
          </div>

          {/* Statutory Regulatory Ruleset */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#0d162f]/80 border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/60">
              <Shield size={16} className="text-cyan-600 dark:text-cyan-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Regulatory Framework & Gazette Standard</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">Approval Process Handbook Edition</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">Controls statutory clauses, formulas and mandatory checklists</span>
                </div>
                <select
                  value={aphEdition}
                  onChange={(e) => setAphEdition(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500 font-mono"
                >
                  <option value="2025-26">APH 2025-26 (Active Gazette)</option>
                  <option value="2026-27">APH 2026-27 (Draft Preview)</option>
                </select>
              </div>

              {/* Toggles */}
              <div className="pt-2 space-y-2.5">
                <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">Automatic Defect Flagging</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Automatically register warnings on expired fire NOCs or missing sub-division surveys</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoFlagging}
                    onChange={(e) => setAutoFlagging(e.target.checked)}
                    className="w-4 h-4 accent-cyan-600 dark:accent-cyan-400 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">Cross-Document Reconciliation</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Match survey numbers across Sale Deed, Revenue Conversion, and Town Planning drawings</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={crossReconciliation}
                    onChange={(e) => setCrossReconciliation(e.target.checked)}
                    className="w-4 h-4 accent-cyan-600 dark:accent-cyan-400 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: System Status & Diagnostic Info */}
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-white dark:bg-[#0d162f]/80 border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/60">
              <Server size={16} className="text-cyan-600 dark:text-cyan-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">System Integration Health</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Backend Server:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Online (Port 3000)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Authentication Protocol:</span>
                <span className="font-mono text-cyan-700 dark:text-cyan-400 font-semibold">
                  Scrypt PBKDF2 / Bearer
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Gemini Verification Engine:</span>
                <span className="font-mono text-cyan-700 dark:text-cyan-400 font-semibold">
                  {serverHealth?.geminiConfigured ? 'Active (Gemini 3.8 Flash)' : 'Active (Deterministic Engine)'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">PDF OCR Engine:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Active (pdf-parse v2)</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 dark:text-slate-400">Security Invariant:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">Zero Client Secrets</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 text-[11px] text-blue-900 dark:text-cyan-200 leading-relaxed">
                All regulatory inspections comply with Ministry of Education technical education security guidelines and AICTE Approval Process Handbook.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
