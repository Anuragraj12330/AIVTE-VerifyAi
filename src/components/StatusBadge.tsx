import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { VerificationStatus } from '../types';

interface StatusBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  let colorClasses = '';
  let IconComponent = CheckCircle2;
  let label = status;

  switch (status) {
    case 'PASS':
      colorClasses = 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50';
      IconComponent = CheckCircle2;
      label = 'PASS';
      break;
    case 'WARNING':
      colorClasses = 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50';
      IconComponent = AlertTriangle;
      label = 'WARNING';
      break;
    case 'FAILED CHECK':
      colorClasses = 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50';
      IconComponent = XCircle;
      label = 'FAILED CHECK';
      break;
    case 'NOT CHECKED':
    default:
      colorClasses = 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60';
      IconComponent = Clock;
      label = 'NOT CHECKED';
      break;
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }[size];

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md tracking-wide whitespace-nowrap select-none font-mono ${sizeClasses} ${colorClasses} ${className}`}
    >
      {showIcon && <IconComponent size={iconSizes} className="shrink-0" />}
      <span>{label}</span>
    </span>
  );
};
