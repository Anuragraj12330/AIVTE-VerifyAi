import React from 'react';
import { 
  X, 
  Building2, 
  ChevronRight, 
  FileText
} from 'lucide-react';
import { Application, DocumentItem } from '../types';
import { StatusBadge } from './StatusBadge';

interface ApplicationDetailModalProps {
  application: Application | null;
  onClose: () => void;
  onVerifyDocument: (doc: DocumentItem) => void;
  onOpenCompliance: () => void;
  onOpenReport: () => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  onClose,
  onVerifyDocument,
  onOpenCompliance,
  onOpenReport,
}) => {
  if (!application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#0c142c] border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-10 text-slate-900 dark:text-slate-200 my-8 max-h-[90vh] flex flex-col transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#091024]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700/50 flex items-center justify-center text-blue-700 dark:text-cyan-400 shrink-0">
              <Building2 size={20} />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                {application.institutionName}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                <span>{application.applicationRef}</span>
                <span>·</span>
                <span>{application.location}</span>
                <span>·</span>
                <span className="text-blue-700 dark:text-cyan-300">{application.institutionType}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <StatusBadge status={application.overallStatus} size="md" />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 font-mono">
              <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase block">Risk Index</span>
              <span className={`text-lg font-bold ${
                application.riskScore > 65 ? 'text-rose-600 dark:text-rose-400' : application.riskScore > 35 ? 'text-amber-600 dark:text-amber-300' : 'text-emerald-600 dark:text-emerald-400'
              }`}>
                {application.riskScore}%
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 font-mono">
              <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase block">Compliance Score</span>
              <span className="text-lg font-bold text-blue-700 dark:text-cyan-400">
                {application.complianceScore}%
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 font-mono">
              <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase block">Documents Filed</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {application.documentsSubmittedCount} / {application.totalRequiredDocs}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 font-mono">
              <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase block">Assigned Auditor</span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate block mt-1">
                {application.assignedAuditor}
              </span>
            </div>
          </div>

          {/* Reviewer Clinical Notes */}
          {application.reviewerNotes && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-slate-900/80 border border-amber-200 dark:border-slate-800 text-xs space-y-1">
              <span className="font-semibold text-amber-800 dark:text-amber-300 font-mono block text-[11px] uppercase tracking-wider">
                Auditor Assessment Notes:
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {application.reviewerNotes}
              </p>
            </div>
          )}

          {/* Submitted Documents & Audit State */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white text-xs uppercase font-mono tracking-wider">
                Submitted Documents & Verification Status ({application.documents.length})
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Click to inspect in workspace</span>
            </div>

            <div className="space-y-2.5">
              {application.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-cyan-500/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <FileText size={15} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
                      <span className="font-semibold text-slate-900 dark:text-white truncate">{doc.name}</span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">({doc.fileSize})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-slate-700 dark:text-slate-300">{doc.category}</span>
                      <span>·</span>
                      <span className="font-mono">ID: {doc.extractedData.documentIdentifier}</span>
                      <span>·</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono">OCR: {doc.confidenceScore}%</span>
                    </div>

                    {/* Any findings snippet */}
                    {doc.findings.length > 0 && (
                      <div className="mt-2 text-[11px] text-amber-700 dark:text-amber-300/90 leading-relaxed font-mono">
                        {doc.findings[0].clause}: {doc.findings[0].title}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                    <StatusBadge status={doc.status} size="sm" />
                    <button
                      onClick={() => {
                        onVerifyDocument(doc);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-600/30 hover:bg-blue-100 dark:hover:bg-blue-600/50 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-cyan-500/40 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>Inspect</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#091024] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
            Submission Timestamp: {application.submissionDate}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onOpenReport();
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-transparent transition-colors cursor-pointer shadow-xs"
            >
              Generate Official Report
            </button>
            <button
              onClick={() => {
                onOpenCompliance();
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors cursor-pointer shadow-xs"
            >
              Evaluate Compliance Rules
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
