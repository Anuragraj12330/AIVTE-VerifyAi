import React, { useState } from 'react';
import { 
  Building2, 
  FileCheck2, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight, 
  TrendingUp, 
  ChevronRight, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Application, AIInsight } from '../types';
import { StatusBadge } from './StatusBadge';
import { NavigationTab } from './Sidebar';

interface OverviewViewProps {
  applications: Application[];
  insights: AIInsight[];
  onSelectApplication: (app: Application) => void;
  onNavigateTab: (tab: NavigationTab) => void;
  onStartVerification: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  applications,
  insights,
  onSelectApplication,
  onNavigateTab,
  onStartVerification,
}) => {
  const [activityTimeframe, setActivityTimeframe] = useState<'30d' | '90d' | '1yr'>('30d');
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number | null>(null);

  // Statistics
  const totalAppsCount = 1428;
  const docsAnalyzedCount = 18940;
  const casesRequiringReviewCount = 34;
  const verifiedCount = 1286;

  // Monthly verification trend data
  const monthlyActivity = [
    { month: 'May 26', verified: 120, warning: 14, failed: 4, total: 138 },
    { month: 'Jun 26', verified: 185, warning: 22, failed: 6, total: 213 },
    { month: 'Jul 26', verified: 260, warning: 31, failed: 8, total: 299 },
    { month: 'Aug 26', verified: 310, warning: 42, failed: 12, total: 364 },
    { month: 'Sep 26', verified: 245, warning: 28, failed: 7, total: 280 },
    { month: 'Oct 26', verified: 166, warning: 18, failed: 5, total: 189 },
  ];

  const maxTotal = Math.max(...monthlyActivity.map((m) => m.total));

  return (
    <div className="space-y-6 pb-12">
      {/* Contextual Greeting & Hero Strip */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 dark:from-[#0d1738] dark:via-[#0f1d47] dark:to-[#0b142f] border border-blue-900/40 p-5 sm:p-7 overflow-hidden shadow-xl text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
              <span>AICTE Approval Process Handbook (APH 2025-26)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Institutional Regulatory Verification Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Automated document cross-verification, physical infrastructure area audit, and faculty cadre validation for technical colleges and universities.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
            <button
              onClick={onStartVerification}
              className="py-2.5 px-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-blue-950/60 flex items-center gap-2 transition-all cursor-pointer group active:scale-[0.98]"
            >
              <Sparkles size={15} className="text-cyan-200 group-hover:rotate-12 transition-transform" />
              <span>Start Verification</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Applications */}
        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0d162f]/80 border border-slate-200 dark:border-slate-800/80 hover:border-blue-400 dark:hover:border-blue-700/50 transition-colors shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Total Applications</span>
            <Building2 size={16} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {totalAppsCount.toLocaleString()}
            </span>
            <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 flex items-center">
              +12.4% <ArrowUpRight size={12} />
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            Active 2025-26 cycle submissions
          </div>
        </div>

        {/* Documents Analyzed */}
        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0d162f]/80 border border-slate-200 dark:border-slate-800/80 hover:border-cyan-400 dark:hover:border-cyan-700/50 transition-colors shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Documents Analyzed</span>
            <FileCheck2 size={16} className="text-cyan-600 dark:text-cyan-400" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {docsAnalyzedCount.toLocaleString()}
            </span>
            <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 flex items-center">
              98.4% OCR
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            Lease deeds, blueprints & fire NOCs
          </div>
        </div>

        {/* Cases Requiring Review */}
        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0d162f]/80 border border-amber-200 dark:border-amber-900/40 hover:border-amber-400 dark:hover:border-amber-700/60 transition-colors shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Cases Requiring Review</span>
            <AlertCircle size={16} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-600 dark:text-amber-300 tabular-nums">
              {casesRequiringReviewCount}
            </span>
            <span className="text-[11px] font-mono text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-800/40">
              3 Critical
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            Carpet area & expired NOC flags
          </div>
        </div>

        {/* Verified Applications */}
        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0d162f]/80 border border-emerald-200 dark:border-emerald-900/40 hover:border-emerald-400 dark:hover:border-emerald-700/60 transition-colors shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Verified Applications</span>
            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-300 tabular-nums">
              {verifiedCount.toLocaleString()}
            </span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
              90.1% Rate
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            Recommended for final approval
          </div>
        </div>
      </div>

      {/* Main Grid: Activity Visualization & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Activity Visualization (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white dark:bg-[#0d162f]/80 border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/60">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={16} className="text-cyan-600 dark:text-cyan-400" />
                <span>Verification Activity & Status Trends</span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Monthly breakdown of verified, flagged, and review cases
              </p>
            </div>

            {/* Timeframe Filter Tabs */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
              {(['30d', '90d', '1yr'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setActivityTimeframe(tf)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                    activityTimeframe === tf
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tf === '30d' ? '30 Days' : tf === '90d' ? '90 Days' : 'Full Cycle'}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-6">
            <div className="flex items-end justify-between gap-2 sm:gap-4 h-48 px-2 sm:px-4">
              {monthlyActivity.map((item, idx) => {
                const heightPct = Math.round((item.total / maxTotal) * 100);
                const isHovered = selectedMonthIndex === idx;
                return (
                  <div
                    key={item.month}
                    onMouseEnter={() => setSelectedMonthIndex(idx)}
                    onMouseLeave={() => setSelectedMonthIndex(null)}
                    className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    {/* Tooltip on hover */}
                    <div
                      className={`text-[10px] font-mono text-slate-900 dark:text-cyan-300 bg-white dark:bg-slate-900 border border-slate-300 dark:border-cyan-800/60 shadow-md px-1.5 py-0.5 rounded transition-opacity duration-150 ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {item.verified} Pass / {item.warning} Warn
                    </div>

                    {/* Stacked Bar */}
                    <div className="w-full max-w-[42px] bg-slate-100 dark:bg-slate-900/60 rounded-t-md overflow-hidden flex flex-col justify-end transition-all group-hover:scale-105"
                         style={{ height: `${heightPct}%` }}>
                      {/* Warning part */}
                      <div 
                        className="w-full bg-amber-500/80" 
                        style={{ height: `${(item.warning / item.total) * 100}%` }}
                        title={`${item.warning} Warnings`}
                      />
                      {/* Verified part */}
                      <div 
                        className="w-full bg-emerald-500/80" 
                        style={{ height: `${(item.verified / item.total) * 100}%` }}
                        title={`${item.verified} Passed`}
                      />
                    </div>

                    {/* Month Label */}
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-cyan-300">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-emerald-500/80" />
                <span>Verified Clean (LoA Recommended)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-amber-500/80" />
                <span>Regulatory Variance / Review</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Verification Insights Panel */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#0d162f]/80 border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-cyan-600 dark:text-cyan-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">AI Verification Insights</h2>
              </div>
              <span className="text-[10px] font-mono text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-200 dark:border-cyan-800/60">
                Active Scan
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 hover:border-blue-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                      {insight.title}
                    </span>
                    {insight.severity === 'critical' ? (
                      <span className="shrink-0 text-[10px] font-mono text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-200 dark:border-rose-800/50">
                        CRITICAL
                      </span>
                    ) : (
                      <span className="shrink-0 text-[10px] font-mono text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-200 dark:border-amber-800/50">
                        WARNING
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-blue-700 dark:text-cyan-300 mt-1 font-medium truncate">
                    {insight.institution}
                  </p>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {insight.summary}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-300">
                    <span>{insight.clause}</span>
                    <button
                      onClick={() => onNavigateTab('document-verification')}
                      className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <span>Inspect Evidence</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-center">
            <button
              onClick={() => onNavigateTab('compliance-checker')}
              className="text-xs font-medium text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View All 8 Configured Regulatory Rules</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Applications Section */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#0d162f]/80 border border-slate-200 dark:border-slate-800/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/60">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 size={16} className="text-blue-600 dark:text-blue-400" />
              <span>Recent Institutional Submissions</span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Review real dossiers evaluated under current regulatory norms
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('applications')}
            className="text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 self-start sm:self-auto flex items-center gap-1 cursor-pointer"
          >
            <span>View All Applications</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Responsive Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">
                <th className="py-2.5 px-3">Institution Name</th>
                <th className="py-2.5 px-3">Application Ref</th>
                <th className="py-2.5 px-3 text-center">Documents</th>
                <th className="py-2.5 px-3">Verification Status</th>
                <th className="py-2.5 px-3 font-mono">Last Updated</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {applications.slice(0, 5).map((app) => (
                <tr 
                  key={app.id} 
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">
                      {app.institutionName}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <span>{app.location}</span>
                      <span>·</span>
                      <span>{app.institutionType}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">
                    {app.applicationRef}
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">
                      {app.documentsSubmittedCount} / {app.totalRequiredDocs}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={app.overallStatus} size="sm" />
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                    {app.lastUpdated}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onSelectApplication(app)}
                      className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-600/30 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-cyan-300 border border-slate-200 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-cyan-600/50 transition-all font-medium text-xs cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <ChevronRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
