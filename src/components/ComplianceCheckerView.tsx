import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sliders, 
  RotateCw 
} from 'lucide-react';
import { ComplianceRule, VerificationStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { COMPLIANCE_RULES } from '../data/mockData';

export const ComplianceCheckerView: React.FC = () => {
  const [rules, setRules] = useState<ComplianceRule[]>(COMPLIANCE_RULES);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedResult, setSelectedResult] = useState<'ALL' | VerificationStatus>('ALL');

  // Interactive Configurable Thresholds State
  const [sfrThreshold, setSfrThreshold] = useState<number>(15);
  const [minLandUrban, setMinLandUrban] = useState<number>(2.5);
  const [instructionalAreaThreshold, setInstructionalAreaThreshold] = useState<number>(4.0);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const categories = [
    'ALL',
    'Infrastructure & Land',
    'Faculty Cadre',
    'Safety & Clearances',
    'Academic & Accreditation',
  ];

  const filteredRules = useMemo(() => {
    return rules.filter((r) => {
      const matchCat = selectedCategory === 'ALL' || r.category === selectedCategory;
      const matchRes = selectedResult === 'ALL' || r.result === selectedResult;
      return matchCat && matchRes;
    });
  }, [rules, selectedCategory, selectedResult]);

  // Calculations for progress
  const completedChecksCount = rules.filter((r) => r.result !== 'NOT CHECKED').length;
  const passedChecksCount = rules.filter((r) => r.result === 'PASS').length;
  const warningChecksCount = rules.filter((r) => r.result === 'WARNING').length;
  const failedChecksCount = rules.filter((r) => r.result === 'FAILED CHECK').length;
  const progressPercent = Math.round((completedChecksCount / rules.length) * 100);

  const handleAction = (ruleId: string, action: ComplianceRule['reviewerActionTaken']) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, reviewerActionTaken: action } : r))
    );
  };

  const runReCheck = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      // Re-evaluate based on configured thresholds
      setRules((prev) =>
        prev.map((r) => {
          if (r.id === 'rule-04') {
            const val = 14.8;
            return {
              ...r,
              standardValue: `≤ ${sfrThreshold}.0`,
              result: val <= sfrThreshold ? 'PASS' : 'FAILED CHECK',
            };
          }
          if (r.id === 'rule-01') {
            return {
              ...r,
              standardValue: `≥ ${minLandUrban.toFixed(2)}`,
            };
          }
          return r;
        })
      );
      setIsEvaluating(false);
    }, 450);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShieldCheck size={22} className="text-cyan-600 dark:text-cyan-400" />
            <span>AICTE Regulatory Compliance Checker</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated evaluation engine mapped to Approval Process Handbook (APH 2025-26) statutory clauses
          </p>
        </div>

        <button
          onClick={runReCheck}
          disabled={isEvaluating}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs"
        >
          <RotateCw size={14} className={isEvaluating ? 'animate-spin' : ''} />
          <span>Execute Configured Check Rules</span>
        </button>
      </div>

      {/* Progress & Summary Bar */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#0d162f]/80 border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-900 dark:text-white">Configured Rules Audit Progress:</span>
              <span className="text-xs font-mono text-cyan-700 dark:text-cyan-400 font-bold">
                {completedChecksCount} of {rules.length} Completed ({progressPercent}%)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Target institution: <span className="text-slate-800 dark:text-slate-200 font-medium">Apex Institute of Technology & Sciences</span>
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 size={13} />
              <span>{passedChecksCount} Passed</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-300">
              <AlertTriangle size={13} />
              <span>{warningChecksCount} Warning</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-400">
              <XCircle size={13} />
              <span>{failedChecksCount} Failed</span>
            </div>
          </div>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden flex">
          <div
            className="bg-emerald-500 transition-all duration-300"
            style={{ width: `${(passedChecksCount / rules.length) * 100}%` }}
            title={`${passedChecksCount} Passed`}
          />
          <div
            className="bg-amber-500 transition-all duration-300"
            style={{ width: `${(warningChecksCount / rules.length) * 100}%` }}
            title={`${warningChecksCount} Warnings`}
          />
          <div
            className="bg-rose-500 transition-all duration-300"
            style={{ width: `${(failedChecksCount / rules.length) * 100}%` }}
            title={`${failedChecksCount} Failed Checks`}
          />
        </div>
      </div>

      {/* Interactive Regulatory Parameter Configuration Panel */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#091124] border border-slate-200 dark:border-blue-900/40 space-y-3 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800/60">
          <div className="flex items-center gap-2">
            <Sliders size={15} className="text-cyan-600 dark:text-cyan-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Regulatory Parameter Configurator (AICTE APH 2025-26)
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
            Live Threshold Calibration
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* SFR Slider */}
          <div className="p-3 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2 shadow-xs">
            <div className="flex justify-between font-mono">
              <span className="text-slate-700 dark:text-slate-300">Student-Faculty Ratio (SFR):</span>
              <span className="text-cyan-700 dark:text-cyan-400 font-bold">1:{sfrThreshold}</span>
            </div>
            <input
              type="range"
              min="10"
              max="25"
              step="1"
              value={sfrThreshold}
              onChange={(e) => setSfrThreshold(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-600 dark:accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              <span>Strict (1:10)</span>
              <span>APH Norm (1:15)</span>
              <span>Relaxed (1:20)</span>
            </div>
          </div>

          {/* Land Threshold */}
          <div className="p-3 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2 shadow-xs">
            <div className="flex justify-between font-mono">
              <span className="text-slate-700 dark:text-slate-300">Min Urban Land:</span>
              <span className="text-cyan-700 dark:text-cyan-400 font-bold">{minLandUrban.toFixed(2)} Acres</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="5.0"
              step="0.25"
              value={minLandUrban}
              onChange={(e) => setMinLandUrban(parseFloat(e.target.value))}
              className="w-full accent-cyan-600 dark:accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              <span>Mega (1.5 Ac)</span>
              <span>Metro (2.5 Ac)</span>
              <span>Suburban (5.0 Ac)</span>
            </div>
          </div>

          {/* Carpet Area */}
          <div className="p-3 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2 shadow-xs">
            <div className="flex justify-between font-mono">
              <span className="text-slate-700 dark:text-slate-300">Instructional Carpet Area:</span>
              <span className="text-cyan-700 dark:text-cyan-400 font-bold">{instructionalAreaThreshold.toFixed(1)} sq.m/student</span>
            </div>
            <input
              type="range"
              min="3.0"
              max="6.0"
              step="0.5"
              value={instructionalAreaThreshold}
              onChange={(e) => setInstructionalAreaThreshold(parseFloat(e.target.value))}
              className="w-full accent-cyan-600 dark:accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              <span>3.0 sq.m</span>
              <span>Mandatory 4.0</span>
              <span>6.0 sq.m</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono mr-1">Filter Domain:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-50 dark:bg-blue-600/30 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-cyan-500/50 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {cat === 'ALL' ? 'All Regulatory Clauses' : cat}
          </button>
        ))}
      </div>

      {/* Rules List Cards */}
      <div className="space-y-3">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0d162f]/80 border border-slate-200 dark:border-slate-800/80 hover:border-blue-300 dark:hover:border-slate-700 transition-colors shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/60">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{rule.name}</h3>
                  <span className="text-[10px] font-mono text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-200 dark:border-cyan-800/50">
                    {rule.clauseRef}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    · {rule.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                  {rule.requirement}
                </p>
              </div>

              <div className="shrink-0 self-start">
                <StatusBadge status={rule.result} size="md" />
              </div>
            </div>

            {/* Extracted Values Side-by-Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 border-b border-slate-100 dark:border-slate-800/60 text-xs">
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 font-mono">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase">Statutory AICTE Standard</span>
                <span className="text-slate-900 dark:text-white font-bold text-sm">{rule.standardValue} {rule.unit || ''}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 font-mono">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase">Institution Measured Value</span>
                <span className={`text-sm font-bold ${
                  rule.result === 'FAILED CHECK' 
                    ? 'text-rose-600 dark:text-rose-400' 
                    : rule.result === 'WARNING' 
                    ? 'text-amber-600 dark:text-amber-300' 
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}>
                  {rule.calculatedValue} {rule.unit || ''}
                </span>
              </div>
            </div>

            {/* Evidence & Reviewer Actions */}
            <div className="pt-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="text-slate-600 dark:text-slate-300 text-[11px] flex-1">
                <span className="text-cyan-700 dark:text-cyan-400 font-semibold font-mono mr-1">Document Evidence:</span>
                <span>{rule.evidence}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {rule.reviewerActionTaken && rule.reviewerActionTaken !== 'PENDING' ? (
                  <span className="font-mono text-[10px] text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 px-2 py-1 rounded border border-cyan-200 dark:border-cyan-800/50">
                    Action: {rule.reviewerActionTaken}
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => handleAction(rule.id, 'CLARIFICATION_REQUESTED')}
                      className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      Request Clarification
                    </button>
                    <button
                      onClick={() => handleAction(rule.id, 'NOTICE_ISSUED')}
                      className="px-2.5 py-1 rounded bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-300 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      Issue Defect Notice
                    </button>
                    <button
                      onClick={() => handleAction(rule.id, 'APPROVED_EXCEPTION')}
                      className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      Approve Override
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
