import React, { useState, useMemo } from 'react';
import { 
  Clock3, 
  Search, 
  Download, 
  Copy, 
  Check 
} from 'lucide-react';
import { ActivityLog } from '../types';
import { StatusBadge } from './StatusBadge';
import { ACTIVITY_LOGS } from '../data/mockData';

export const ActivityLogsView: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>(ACTIVITY_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventType, setSelectedEventType] = useState<string>('ALL');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const eventTypes = [
    'ALL',
    'AI Extraction',
    'Manual Override',
    'Defect Notice',
    'Document Upload',
    'Rule Configuration',
  ];

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchSearch =
        log.targetApplication.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.hash.toLowerCase().includes(searchQuery.toLowerCase());

      const matchType = selectedEventType === 'ALL' || log.eventType === selectedEventType;

      return matchSearch && matchType;
    });
  }, [logs, searchQuery, selectedEventType]);

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleExportLogs = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Timestamp,Event Type,User,Action,Target Application,Status,Cryptographic Hash,Details',
        ...filteredLogs.map(
          (l) =>
            `"${l.timestamp}","${l.eventType}","${l.user}","${l.action}","${l.targetApplication}","${l.status}","${l.hash}","${l.details.replace(/"/g, '""')}"`
        ),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AICTE_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Clock3 size={22} className="text-cyan-600 dark:text-cyan-400" />
            <span>Immutable Regulatory Activity & Audit Trail</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tamper-evident chronological log of automated OCR extraction runs, reviewer overrides, and defect notices
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Download size={14} />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#0d162f]/80 border border-slate-200 dark:border-slate-800/80 space-y-3 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit trail by institution, user, details or hash..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-cyan-500"
            />
          </div>

          <div>
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
            >
              {eventTypes.map((t) => (
                <option key={t} value={t}>
                  {t === 'ALL' ? 'All Event Categories' : t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table / List */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0d162f]/80 border border-slate-200 dark:border-slate-800/80 shadow-xs">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-xs">
            No audit log entries match the search criteria.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => {
              const isAI = log.eventType === 'AI Extraction';
              const isNotice = log.eventType === 'Defect Notice';
              const isOverride = log.eventType === 'Manual Override';

              return (
                <div
                  key={log.id}
                  className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/90 hover:border-blue-300 dark:hover:border-slate-700 transition-colors text-xs space-y-2.5 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400 font-semibold">
                        {log.timestamp}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">·</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{log.action}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          isAI
                            ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-cyan-300'
                            : isNotice
                            ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300'
                            : isOverride
                            ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300'
                            : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {log.eventType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={log.status} size="sm" />
                    </div>
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                    {log.details}
                  </p>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 dark:text-slate-300">Originator:</span>
                      <span className="text-slate-900 dark:text-white font-medium">{log.user}</span>
                      <span className="text-slate-300 dark:text-slate-600">|</span>
                      <span className="text-blue-700 dark:text-cyan-400 font-semibold">{log.targetApplication}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 dark:text-slate-300">Hash:</span>
                      <span className="text-slate-600 dark:text-slate-300 font-mono text-[10px]">{log.hash}</span>
                      <button
                        onClick={() => copyHash(log.hash)}
                        className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1 cursor-pointer"
                        title="Copy cryptographic signature hash"
                      >
                        {copiedHash === log.hash ? (
                          <Check size={12} className="text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
