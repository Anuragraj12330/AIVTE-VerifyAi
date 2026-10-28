import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  FileCheck2, 
  MapPin, 
  ArrowUpDown
} from 'lucide-react';
import { Application, VerificationStatus, InstitutionType } from '../types';
import { StatusBadge } from './StatusBadge';

interface ApplicationsViewProps {
  applications: Application[];
  onSelectApplication: (app: Application) => void;
  onQuickVerifyApplication: (app: Application) => void;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  applications,
  onSelectApplication,
  onQuickVerifyApplication,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | VerificationStatus>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | string>('ALL');
  const [sortBy, setSortBy] = useState<'risk' | 'date' | 'name'>('risk');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        const matchesSearch = 
          app.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.applicationRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.location.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || app.overallStatus === statusFilter;
        const matchesType = typeFilter === 'ALL' || app.institutionType === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === 'risk') {
          return sortOrder === 'desc' ? b.riskScore - a.riskScore : a.riskScore - b.riskScore;
        } else if (sortBy === 'date') {
          return sortOrder === 'desc' 
            ? new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
            : new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime();
        } else {
          return sortOrder === 'desc' 
            ? b.institutionName.localeCompare(a.institutionName)
            : a.institutionName.localeCompare(b.institutionName);
        }
      });
  }, [applications, searchTerm, statusFilter, typeFilter, sortBy, sortOrder]);

  const handleExportCSV = () => {
    const headers = ['Application Ref', 'Institution Name', 'Type', 'Location', 'Status', 'Risk Score', 'Compliance Score', 'Last Updated'];
    const rows = filteredApplications.map((app) => [
      app.applicationRef,
      `"${app.institutionName}"`,
      `"${app.institutionType}"`,
      `"${app.location}"`,
      app.overallStatus,
      app.riskScore,
      app.complianceScore,
      `"${app.lastUpdated}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AICTE_Applications_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusCounts = useMemo(() => {
    return {
      ALL: applications.length,
      PASS: applications.filter(a => a.overallStatus === 'PASS').length,
      WARNING: applications.filter(a => a.overallStatus === 'WARNING').length,
      'FAILED CHECK': applications.filter(a => a.overallStatus === 'FAILED CHECK').length,
      'NOT CHECKED': applications.filter(a => a.overallStatus === 'NOT CHECKED').length,
    };
  }, [applications]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Building2 size={22} className="text-cyan-600 dark:text-cyan-400" />
            <span>Institutional Approval Dossiers</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Registered technical institutes, universities, and polytechnics submitting approval renewal for 2025-26
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Download size={14} />
            <span>Export Registry CSV</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#0d162f]/80 border border-slate-200 dark:border-slate-800/80 space-y-3 shadow-xs">
        {/* Search & Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, ref #, or city..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-cyan-500"
            />
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
            >
              <option value="ALL">All Disciplines & Streams</option>
              <option value="Engineering & Technology">Engineering & Technology</option>
              <option value="Management (MBA/PGDM)">Management (MBA/PGDM)</option>
              <option value="Polytechnic & Diploma">Polytechnic & Diploma</option>
              <option value="Applied Sciences & Pharmacy">Applied Sciences & Pharmacy</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
            >
              <option value="risk">Risk Index (Severe first)</option>
              <option value="date">Submission Date</option>
              <option value="name">Institution Name</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              title="Toggle Sort Order"
            >
              <ArrowUpDown size={14} />
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
          <span className="text-xs text-slate-600 dark:text-slate-300 mr-2 font-mono">Status:</span>
          {(['ALL', 'PASS', 'WARNING', 'FAILED CHECK', 'NOT CHECKED'] as const).map((status) => {
            const count = statusCounts[status];
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-600/30 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-cyan-500/50 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>{status === 'ALL' ? 'All Dossiers' : status}</span>
                <span className="text-[10px] font-mono opacity-80">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Applications Table */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0d162f]/80 border border-slate-200 dark:border-slate-800/80 shadow-xs">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <Building2 size={32} className="mx-auto mb-2 text-slate-400 dark:text-slate-600" />
            <p className="text-sm font-medium">No institutional records match the selected criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                setTypeFilter('ALL');
              }}
              className="mt-3 px-3 py-1.5 text-xs text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 bg-slate-100 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">
                  <th className="py-2.5 px-3">Institution & Ref</th>
                  <th className="py-2.5 px-3">Discipline & Location</th>
                  <th className="py-2.5 px-3 text-center">Docs</th>
                  <th className="py-2.5 px-3">Verification Status</th>
                  <th className="py-2.5 px-3">Risk Assessment</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">
                        {app.institutionName}
                      </div>
                      <div className="text-[11px] font-mono text-cyan-700 dark:text-cyan-400 mt-0.5">
                        {app.applicationRef}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="text-slate-700 dark:text-slate-200">{app.institutionType}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={11} className="text-slate-400 dark:text-slate-500" />
                        <span>{app.location}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center font-mono">
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">{app.documentsSubmittedCount}</span>
                      <span className="text-slate-500 dark:text-slate-400">/{app.totalRequiredDocs}</span>
                    </td>

                    <td className="py-3 px-3">
                      <StatusBadge status={app.overallStatus} size="sm" />
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              app.riskScore > 65 
                                ? 'bg-rose-500' 
                                : app.riskScore > 35 
                                ? 'bg-amber-500' 
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${app.riskScore}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-slate-700 dark:text-slate-300 tabular-nums">
                          {app.riskScore}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onQuickVerifyApplication(app)}
                          className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800/60 font-medium text-xs cursor-pointer inline-flex items-center gap-1 transition-colors"
                          title="Run Document Verification Workspace"
                        >
                          <FileCheck2 size={12} />
                          <span className="hidden sm:inline">Verify</span>
                        </button>
                        <button
                          onClick={() => onSelectApplication(app)}
                          className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs cursor-pointer inline-flex items-center gap-1 transition-colors border border-slate-200 dark:border-transparent"
                        >
                          <span>Dossier</span>
                          <ChevronRight size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
