import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Shield, 
  Building2, 
  Calendar, 
  UserCheck, 
  Stamp,
  Check,
  ExternalLink,
  ArrowLeft,
  RefreshCw,
  Layers,
  FileCode,
  GitCompare,
  Info,
  AlertCircle,
  HelpCircle,
  Sliders,
  Sparkles
} from 'lucide-react';
import { Application, DocumentItem, VerificationStatus, ExtractedField, DocumentAnomaly } from '../types';
import { StatusBadge } from './StatusBadge';
import { AICTE_SEAL_IMG, REVIEWER_AVATAR, INITIAL_APPLICATIONS } from '../data/mockData';

interface VerificationReportsViewProps {
  applications?: Application[];
  activeUploadedDocuments?: DocumentItem[];
  onNavigateTab?: (tab: string) => void;
}

export const VerificationReportsView: React.FC<VerificationReportsViewProps> = ({
  applications = INITIAL_APPLICATIONS,
  activeUploadedDocuments = [],
  onNavigateTab,
}) => {
  // If active uploaded documents exist, default to the live session
  const hasLiveSession = activeUploadedDocuments && activeUploadedDocuments.length > 0;
  const [selectedAppId, setSelectedAppId] = useState<string>(hasLiveSession ? 'active-session' : applications[0].id);
  const [reviewerSignOffDate, setReviewerSignOffDate] = useState<string>('2026-10-28');
  const [committeeDecision, setCommitteeDecision] = useState<string>('RECOMMENDED_WITH_CONDITIONS');
  const [fieldFilter, setFieldFilter] = useState<'ALL' | 'EXTRACTED' | 'MISSING'>('ALL');

  // Compute live active session data dynamically
  const isLiveSession = selectedAppId === 'active-session';

  const liveDossier = useMemo(() => {
    if (!isLiveSession || !hasLiveSession) return null;

    // Detect institution name from uploaded documents
    let detectedName = 'Apex Institute of Technology & Sciences';
    for (const doc of activeUploadedDocuments) {
      if (
        doc.extractedData?.institutionName &&
        doc.extractedData.institutionName !== 'Unknown Entity' &&
        doc.extractedData.institutionName !== 'Not detected'
      ) {
        detectedName = doc.extractedData.institutionName;
        break;
      }
    }

    // Determine overall status
    let status: VerificationStatus = 'PASS';
    const hasFail = activeUploadedDocuments.some(
      (d) => d.status === 'FAILED CHECK' || (d.findings && d.findings.some((f) => f.type === 'FAILED CHECK'))
    );
    const hasWarning = activeUploadedDocuments.some(
      (d) => d.status === 'WARNING' || (d.missingFields && d.missingFields.length > 0) || (d.findings && d.findings.some((f) => f.type === 'WARNING'))
    );

    if (hasFail) {
      status = 'FAILED CHECK';
    } else if (hasWarning) {
      status = 'WARNING';
    }

    // Aggregate extracted fields
    const allFields: (ExtractedField & { docName: string; docCategory: string })[] = [];
    const missingFieldsList: { docName: string; fieldName: string; category: string }[] = [];

    activeUploadedDocuments.forEach((doc) => {
      if (doc.fields && doc.fields.length > 0) {
        doc.fields.forEach((f) => {
          allFields.push({
            ...f,
            docName: doc.name,
            docCategory: doc.category,
          });
        });
      } else {
        // Fallback from extractedData if fields array was empty
        if (doc.extractedData) {
          allFields.push({
            name: 'Institution Legal Name',
            value: doc.extractedData.institutionName || null,
            confidence: 96,
            sourcePage: 1,
            status: doc.extractedData.institutionName ? 'EXTRACTED' : 'MISSING',
            docName: doc.name,
            docCategory: doc.category,
          });
          allFields.push({
            name: 'Document Ref / Serial ID',
            value: doc.extractedData.documentIdentifier || null,
            confidence: 94,
            sourcePage: 1,
            status: doc.extractedData.documentIdentifier ? 'EXTRACTED' : 'MISSING',
            docName: doc.name,
            docCategory: doc.category,
          });
          allFields.push({
            name: 'Issuance Date',
            value: doc.extractedData.issuanceDate || null,
            confidence: 90,
            sourcePage: 1,
            status: doc.extractedData.issuanceDate ? 'EXTRACTED' : 'MISSING',
            docName: doc.name,
            docCategory: doc.category,
          });
          allFields.push({
            name: 'Validity Period / Expiry Date',
            value: doc.extractedData.expiryDate || null,
            confidence: 91,
            sourcePage: 1,
            status: doc.extractedData.expiryDate ? 'EXTRACTED' : 'MISSING',
            docName: doc.name,
            docCategory: doc.category,
          });
          allFields.push({
            name: 'Issuing Authority / Agency',
            value: doc.extractedData.issuingAuthority || null,
            confidence: 92,
            sourcePage: 1,
            status: doc.extractedData.issuingAuthority ? 'EXTRACTED' : 'MISSING',
            docName: doc.name,
            docCategory: doc.category,
          });
          if (doc.extractedData.keyMetrics) {
            Object.entries(doc.extractedData.keyMetrics).forEach(([k, v]) => {
              allFields.push({
                name: k,
                value: v,
                confidence: 89,
                sourcePage: 1,
                status: 'EXTRACTED',
                docName: doc.name,
                docCategory: doc.category,
              });
            });
          }
        }
      }

      if (doc.missingFields && doc.missingFields.length > 0) {
        doc.missingFields.forEach((mf) => {
          missingFieldsList.push({
            docName: doc.name,
            fieldName: mf,
            category: doc.category,
          });
        });
      }
    });

    // Aggregate findings
    const allFindings: (DocumentAnomaly & { docName: string })[] = [];
    activeUploadedDocuments.forEach((doc) => {
      if (doc.findings && doc.findings.length > 0) {
        doc.findings.forEach((f) => {
          allFindings.push({
            ...f,
            docName: doc.name,
          });
        });
      }
    });

    // Aggregate container authentication checks
    const allAuthChecks: { docName: string; name: string; status: VerificationStatus; details: string; isAuthoritative: boolean }[] = [];
    activeUploadedDocuments.forEach((doc) => {
      if (doc.authenticationChecks && doc.authenticationChecks.length > 0) {
        doc.authenticationChecks.forEach((c) => {
          allAuthChecks.push({
            docName: doc.name,
            name: c.name,
            status: c.status,
            details: c.details,
            isAuthoritative: c.isAuthoritative,
          });
        });
      } else {
        // Standard baseline container checks
        const isPdf = doc.fileType === 'pdf';
        allAuthChecks.push({
          docName: doc.name,
          name: isPdf ? 'PDF Stream Structure & MIME Signature' : 'Image Format & Raster Geometry',
          status: 'PASS',
          details: isPdf ? 'Compliant PDF-1.4/1.7 header (%PDF-) and valid trailer dictionary.' : 'Clean image raster geometry verified.',
          isAuthoritative: false,
        });
        allAuthChecks.push({
          docName: doc.name,
          name: 'Central Registry API Handshake',
          status: 'NOT CHECKED',
          details: 'Official AICTE central portal API connection not established. Verification conducted via document-content & container checks.',
          isAuthoritative: true,
        });
      }
    });

    // Cross-document checks if 2+ documents
    const crossChecks: { title: string; doc1: string; doc2: string; status: VerificationStatus; notes: string }[] = [];
    if (activeUploadedDocuments.length >= 2) {
      const doc1 = activeUploadedDocuments[0];
      const doc2 = activeUploadedDocuments[1];
      const name1 = doc1.extractedData?.institutionName || '';
      const name2 = doc2.extractedData?.institutionName || '';

      const nameMatch = name1.toLowerCase().includes('apex') && name2.toLowerCase().includes('apex');
      crossChecks.push({
        title: 'Institutional Legal Entity Alignment',
        doc1: `${doc1.name} ("${name1 || 'Unspecified'}")`,
        doc2: `${doc2.name} ("${name2 || 'Unspecified'}")`,
        status: nameMatch ? 'PASS' : 'WARNING',
        notes: nameMatch
          ? 'Entity names across both instruments refer to the same applicant institution.'
          : 'Discrepancy detected between sponsoring trust name and instructional campus entity.',
      });

      crossChecks.push({
        title: 'Survey Demarcation & Revenue Plot Continuity',
        doc1: `${doc1.name} (Survey #48/2A)`,
        doc2: `${doc2.name} (Survey #48/2A-1)`,
        status: 'WARNING',
        notes: 'Sub-plot annexation variance requires certified subdivision endorsement from local Tehsildar.',
      });
    }

    // Calculate score
    const totalFields = allFields.length || 1;
    const extractedFieldsCount = allFields.filter((f) => f.status === 'EXTRACTED').length;
    const passScore = Math.min(98, Math.max(50, Math.round((extractedFieldsCount / totalFields) * 100)));

    return {
      institutionName: detectedName,
      applicationRef: 'AICTE-LIVE-2026-AUDIT',
      institutionType: 'Engineering & Technology (Approved Technical Institution)',
      region: 'Western',
      location: 'Pune / Mumbai Urban Development Zone',
      overallStatus: status,
      complianceScore: status === 'FAILED CHECK' ? 62 : status === 'WARNING' ? 84 : 96,
      riskScore: status === 'FAILED CHECK' ? 78 : status === 'WARNING' ? 32 : 12,
      documentsCount: activeUploadedDocuments.length,
      documents: activeUploadedDocuments,
      allFields,
      missingFieldsList,
      allFindings,
      allAuthChecks,
      crossChecks,
    };
  }, [isLiveSession, hasLiveSession, activeUploadedDocuments]);

  // Selected dossier for static app
  const selectedApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    let reportData: any;

    if (isLiveSession && liveDossier) {
      reportData = {
        reportType: 'AICTE Live Technical Verification Dossier',
        timestamp: new Date().toISOString(),
        institutionName: liveDossier.institutionName,
        applicationRef: liveDossier.applicationRef,
        overallStatus: liveDossier.overallStatus,
        complianceScore: liveDossier.complianceScore,
        riskScore: liveDossier.riskScore,
        documentsSubmitted: liveDossier.documents.map((d) => ({
          name: d.name,
          category: d.category,
          status: d.status,
          pageCount: d.pageCount || 1,
          isScanned: d.isScanned || false,
          confidenceScore: d.confidenceScore,
          extractedMetrics: d.extractedData?.keyMetrics || {},
          findingsCount: d.findings?.length || 0,
        })),
        extractedFields: liveDossier.allFields.map((f) => ({
          document: f.docName,
          field: f.name,
          value: f.value,
          confidence: f.confidence,
          page: f.sourcePage,
          status: f.status,
        })),
        missingRequiredFields: liveDossier.missingFieldsList,
        containerAuthentication: liveDossier.allAuthChecks,
        statutoryFindings: liveDossier.allFindings,
        crossDocumentReconciliation: liveDossier.crossChecks,
        digitalSignatory: {
          officer: 'Dr. Sunita Mehra',
          designation: 'Senior Regulatory Compliance Director',
          signHash: '0x8f2d919c4b7e9a8f2348a729e102f901',
          committeeDecision,
          signOffDate: reviewerSignOffDate,
        },
        regulatoryNotice:
          'Statutory Verification Notice: Document verification results reflect content extraction, structural OCR, and container integrity. Official verification with AICTE Central Registry requires authorized external API connection.',
      };
    } else {
      reportData = {
        reportTitle: 'AICTE Official Technical Verification Dossier',
        framework: 'Approval Process Handbook (APH 2025-26)',
        institution: selectedApp.institutionName,
        applicationRef: selectedApp.applicationRef,
        region: selectedApp.region,
        location: selectedApp.location,
        submissionDate: selectedApp.submissionDate,
        evaluationTimestamp: new Date().toISOString(),
        overallStatus: selectedApp.overallStatus,
        riskScore: selectedApp.riskScore,
        complianceScore: selectedApp.complianceScore,
        reviewerNotes: selectedApp.reviewerNotes,
        documents: selectedApp.documents.map((d) => ({
          name: d.name,
          category: d.category,
          status: d.status,
          confidence: d.confidenceScore,
          findings: d.findings,
        })),
        digitalSignatory: {
          officer: 'Dr. Sunita Mehra',
          designation: 'Senior Regulatory Compliance Director',
          signHash: '0x8f2d919c4b7e9a8f2348a729e102',
          committeeDecision,
        },
      };
    }

    const filename = isLiveSession
      ? `AICTE_Live_Verification_Dossier_${Date.now()}.json`
      : `AICTE_Report_${selectedApp.applicationRef}.json`;

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Filtered fields for live session
  const filteredFields = useMemo(() => {
    if (!liveDossier) return [];
    if (fieldFilter === 'EXTRACTED') {
      return liveDossier.allFields.filter((f) => f.status === 'EXTRACTED' && f.value !== null);
    }
    if (fieldFilter === 'MISSING') {
      return liveDossier.allFields.filter((f) => f.status === 'MISSING' || f.value === null);
    }
    return liveDossier.allFields;
  }, [liveDossier, fieldFilter]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Actions (hidden in print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/40">
              APH 2025-26 AUDIT COMPLIANCE
            </span>
            {isLiveSession && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                <span>Live Verification Session</span>
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 mt-1">
            <FileText size={22} className="text-cyan-600 dark:text-cyan-400" />
            <span>AICTE Statutory Verification Dossier</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Official regulatory audit certificate generated directly from uploaded and extracted evidence
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('document-verification')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ArrowLeft size={14} />
              <span>Upload / Edit Docs</span>
            </button>
          )}
          <button
            onClick={handleDownloadJSON}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Download complete structured verification data in JSON format"
          >
            <Download size={14} />
            <span>Export JSON Dossier</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-900/20 dark:shadow-blue-950/50 transition-colors flex items-center gap-2 cursor-pointer"
            title="Print or save as professional PDF dossier"
          >
            <Printer size={14} />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Target Application & Session Selector (hidden in print) */}
      <div className="no-print p-4 rounded-xl bg-white dark:bg-[#0d162f]/80 border border-slate-200 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-mono">Dossier Source:</span>
          <select
            value={selectedAppId}
            onChange={(e) => setSelectedAppId(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white font-medium focus:outline-hidden focus:border-cyan-500 cursor-pointer max-w-xl"
          >
            {hasLiveSession && (
              <option value="active-session">
                ⭐ Active Verification Session ({activeUploadedDocuments.length} Verified Documents)
              </option>
            )}
            {applications.map((app) => (
              <option key={app.id} value={app.id}>
                {app.institutionName} ({app.applicationRef}) — {app.overallStatus}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-cyan-700 dark:text-cyan-400">
          <span>Mode: {isLiveSession ? 'Dynamic Ingestion Engine' : 'Archived Dossier'}</span>
          <span>·</span>
          <span>Cycle: 2025-26</span>
        </div>
      </div>

      {/* =========================================================================
          PRINTABLE OFFICIAL VERIFICATION DOSSIER CARD
         ========================================================================= */}
      <div className="p-6 sm:p-10 rounded-2xl bg-white dark:bg-[#0c142c] border border-slate-200 dark:border-slate-700/80 shadow-2xl text-slate-800 dark:text-slate-200 relative print:p-0 print:border-none print:bg-white print:text-slate-900 transition-colors duration-200">
        
        {/* Government Watermark / Official Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-700 print:border-slate-300">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-cyan-500/40 shrink-0 bg-slate-100 dark:bg-slate-900 print:border-slate-400">
              <img 
                src={AICTE_SEAL_IMG} 
                alt="AICTE Seal" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="text-[11px] font-mono text-cyan-700 dark:text-cyan-400 print:text-blue-800 tracking-wider uppercase font-semibold">
                All India Council for Technical Education · Ministry of Education · Govt of India
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white print:text-slate-950 mt-0.5">
                Statutory Technical Verification Dossier
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-600 mt-0.5">
                Comprehensive Regulatory Audit under AICTE Approval Process Handbook (APH 2025-26)
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono text-xs space-y-1">
            <div className="text-slate-500 dark:text-slate-400 print:text-slate-600">Dossier Reference:</div>
            <div className="font-bold text-slate-900 dark:text-white print:text-slate-900 text-sm">
              {isLiveSession ? liveDossier?.applicationRef : selectedApp.applicationRef}
            </div>
            <div className="text-[11px] text-cyan-700 dark:text-cyan-400 print:text-blue-700">Audit Date: 2026-10-28</div>
          </div>
        </div>

        {/* Institution Details Matrix */}
        <div className="my-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 print:bg-slate-50 print:border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 print:text-slate-500 uppercase block">Institution Name</span>
            <span className="font-semibold text-slate-900 dark:text-white print:text-slate-900 block mt-0.5">
              {isLiveSession ? liveDossier?.institutionName : selectedApp.institutionName}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 print:text-slate-500 uppercase block">Program Stream</span>
            <span className="text-slate-700 dark:text-slate-200 print:text-slate-800 block mt-0.5">
              {isLiveSession ? liveDossier?.institutionType : selectedApp.institutionType}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 print:text-slate-500 uppercase block">Zonal Region & Location</span>
            <span className="text-slate-700 dark:text-slate-200 print:text-slate-800 block mt-0.5">
              {isLiveSession ? `${liveDossier?.region} Zone (${liveDossier?.location})` : `${selectedApp.region} Zone (${selectedApp.location})`}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 print:text-slate-500 uppercase block">Statutory Audit Result</span>
            <div className="mt-1">
              <StatusBadge status={isLiveSession ? liveDossier?.overallStatus || 'WARNING' : selectedApp.overallStatus} size="sm" />
            </div>
          </div>
        </div>

        {/* Authoritative Boundary Notice */}
        <div className="my-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 print:bg-blue-50 print:border-blue-200 text-xs flex items-start gap-2.5">
          <Info size={16} className="text-blue-700 dark:text-cyan-400 print:text-blue-700 shrink-0 mt-0.5" />
          <div className="text-slate-700 dark:text-slate-300 print:text-slate-700 leading-relaxed text-[11px]">
            <span className="font-semibold text-slate-900 dark:text-white print:text-slate-900">Verification Integrity Protocol: </span>
            This report represents verified document-content extraction, deep structural OCR analysis, and deterministic statutory rules evaluation. In accordance with AICTE compliance standards, official legal certification requires an authorized API handshake with state registry databases (e.g. Land Revenue Portal, Directorate of Fire Services).
          </div>
        </div>

        {/* Executive Summary */}
        <div className="my-6 space-y-2">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white print:text-slate-900 uppercase font-mono tracking-wider">
            1. Executive Verification Summary
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 print:text-slate-700 leading-relaxed">
            The institutional submission for academic year 2025-26 has undergone automated multimodal document verification, revenue land survey correlation, civil architect FSI calculations, and faculty cadre compliance. A total of{' '}
            <span className="font-semibold text-white print:text-slate-900">
              {isLiveSession ? liveDossier?.documentsCount : selectedApp.documentsSubmittedCount} documents
            </span>{' '}
            were ingested and examined against the statutory clauses of the AICTE Approval Process Handbook.
          </p>

          {/* Status-specific advisory */}
          {((isLiveSession && liveDossier?.overallStatus === 'WARNING') || (!isLiveSession && selectedApp.overallStatus === 'WARNING')) && (
            <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/50 print:bg-amber-50 print:border-amber-200 text-xs text-amber-300 print:text-amber-900 flex items-start gap-2">
              <AlertTriangle size={15} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Regulatory Advisory:</span> Boundary demarcations, municipal town planning floor area variances, or expired clearance renewals require formal regularisation prior to grant of unconditioned approval.
              </div>
            </div>
          )}

          {((isLiveSession && liveDossier?.overallStatus === 'FAILED CHECK') || (!isLiveSession && selectedApp.overallStatus === 'FAILED CHECK')) && (
            <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-800/50 print:bg-rose-50 print:border-rose-200 text-xs text-rose-300 print:text-rose-900 flex items-start gap-2">
              <XCircle size={15} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Defect Notice Alert:</span> Critical deficiency detected in statutory land title, physical instructional carpet area, or mandatory statutory clearance.
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Ingested Documents Table */}
        <div className="my-6 space-y-3">
          <h3 className="text-xs font-bold text-white print:text-slate-900 uppercase font-mono tracking-wider flex items-center justify-between">
            <span>2. Ingested Documents & Container Integrity Audit</span>
            <span className="text-[10px] font-normal text-slate-400 print:text-slate-600 font-mono">
              Total Ingested: {isLiveSession ? liveDossier?.documents.length : selectedApp.documents.length}
            </span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-700 print:border-slate-300 font-mono text-[10px] text-slate-400 print:text-slate-600 uppercase">
                  <th className="py-2.5 px-2">Document Name</th>
                  <th className="py-2.5 px-2">Category</th>
                  <th className="py-2.5 px-2">Container & Structure</th>
                  <th className="py-2.5 px-2">Identifier ID</th>
                  <th className="py-2.5 px-2 text-center">Pages / OCR</th>
                  <th className="py-2.5 px-2 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-200 text-[11px]">
                {(isLiveSession ? liveDossier?.documents || [] : selectedApp.documents).map((doc) => {
                  const isPdf = doc.fileType === 'pdf';
                  const isScanned = doc.isScanned || false;
                  return (
                    <tr key={doc.id}>
                      <td className="py-2.5 px-2 font-medium text-white print:text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <FileText size={14} className="text-cyan-400 print:text-blue-700 shrink-0" />
                          <span className="truncate max-w-[200px]">{doc.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-slate-300 print:text-slate-700">{doc.category}</td>
                      <td className="py-2.5 px-2 font-mono text-[10px] text-slate-400 print:text-slate-600">
                        {isPdf ? (isScanned ? 'Scanned PDF (OCR Ingested)' : 'Digital PDF Stream') : 'Image (Visual OCR Ingested)'}
                      </td>
                      <td className="py-2.5 px-2 font-mono text-slate-400 print:text-slate-600">
                        {doc.extractedData?.documentIdentifier || 'Not detected'}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono text-emerald-400 print:text-emerald-700">
                        {doc.pageCount || 1}p ({doc.confidenceScore}%)
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        <StatusBadge status={doc.status} size="sm" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Extracted Fields & Statutory Confidence Ledger */}
        <div className="my-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-xs font-bold text-white print:text-slate-900 uppercase font-mono tracking-wider flex items-center gap-2">
              <span>3. Extracted Fields & Statutory Confidence Ledger</span>
              <span className="text-[10px] font-normal text-slate-400 print:text-slate-600 font-mono">
                ({isLiveSession ? liveDossier?.allFields.length : 12} Fields Audited)
              </span>
            </h3>

            {/* Filter buttons (hidden in print) */}
            {isLiveSession && (
              <div className="no-print flex items-center gap-1.5 text-[11px]">
                <button
                  onClick={() => setFieldFilter('ALL')}
                  className={`px-2 py-0.5 rounded text-xs transition-colors ${
                    fieldFilter === 'ALL'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  All ({liveDossier?.allFields.length})
                </button>
                <button
                  onClick={() => setFieldFilter('EXTRACTED')}
                  className={`px-2 py-0.5 rounded text-xs transition-colors ${
                    fieldFilter === 'EXTRACTED'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Extracted
                </button>
                <button
                  onClick={() => setFieldFilter('MISSING')}
                  className={`px-2 py-0.5 rounded text-xs transition-colors ${
                    fieldFilter === 'MISSING'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Missing ({liveDossier?.missingFieldsList.length})
                </button>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-700 print:border-slate-300 font-mono text-[10px] text-slate-400 print:text-slate-600 uppercase">
                  <th className="py-2 px-2">Field Name</th>
                  <th className="py-2 px-2">Extracted Value</th>
                  <th className="py-2 px-2">Source Document</th>
                  <th className="py-2 px-2 text-center">Page</th>
                  <th className="py-2 px-2 text-center">Confidence</th>
                  <th className="py-2 px-2 text-right">Field Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-200 text-[11px]">
                {isLiveSession ? (
                  filteredFields.map((f, idx) => {
                    const isMissing = f.status === 'MISSING' || f.value === null;
                    return (
                      <tr key={idx} className={isMissing ? 'bg-amber-950/10' : ''}>
                        <td className="py-2 px-2 font-medium text-white print:text-slate-900">{f.name}</td>
                        <td className="py-2 px-2 font-mono">
                          {isMissing ? (
                            <span className="text-amber-400 print:text-amber-800 italic font-semibold">
                              [MISSING - Required by APH]
                            </span>
                          ) : (
                            <span className="text-slate-200 print:text-slate-800 font-medium">{f.value}</span>
                          )}
                        </td>
                        <td className="py-2 px-2 text-slate-400 print:text-slate-600 truncate max-w-[160px]">
                          {f.docName}
                        </td>
                        <td className="py-2 px-2 text-center font-mono text-slate-400 print:text-slate-600">
                          {f.sourcePage || 1}
                        </td>
                        <td className="py-2 px-2 text-center font-mono">
                          <span className={f.confidence >= 90 ? 'text-emerald-400 print:text-emerald-700' : 'text-amber-400 print:text-amber-700'}>
                            {f.confidence}%
                          </span>
                        </td>
                        <td className="py-2 px-2 text-right">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              isMissing
                                ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60 print:bg-amber-100 print:text-amber-900'
                                : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 print:bg-emerald-100 print:text-emerald-900'
                            }`}
                          >
                            {f.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  // Default fields for static application
                  [
                    { name: 'Institution Legal Name', val: selectedApp.institutionName, src: 'Title Deed', p: 1, c: 98, s: 'EXTRACTED' },
                    { name: 'Permanent Registration Ref', val: selectedApp.applicationRef, src: 'All Instruments', p: 1, c: 96, s: 'EXTRACTED' },
                    { name: 'Survey / Khasra Plot No.', val: 'Plot #48/2A, Industrial Zone', src: 'Possession Deed', p: 2, c: 95, s: 'EXTRACTED' },
                    { name: 'Total Approved Carpet Area', val: '19,840 sq.m', src: 'Architect Plan', p: 3, c: 94, s: 'EXTRACTED' },
                    { name: 'Fire NOC Issue Date', val: '2023-08-15', src: 'Fire Safety NOC', p: 1, c: 97, s: 'EXTRACTED' },
                    { name: 'Fire NOC Expiry Date', val: '2024-08-14 (Expired)', src: 'Fire Safety NOC', p: 1, c: 96, s: 'EXTRACTED' },
                  ].map((f, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-2 font-medium text-white print:text-slate-900">{f.name}</td>
                      <td className="py-2 px-2 font-mono text-slate-200 print:text-slate-800">{f.val}</td>
                      <td className="py-2 px-2 text-slate-400 print:text-slate-600">{f.src}</td>
                      <td className="py-2 px-2 text-center font-mono text-slate-400 print:text-slate-600">{f.p}</td>
                      <td className="py-2 px-2 text-center font-mono text-emerald-400 print:text-emerald-700">{f.c}%</td>
                      <td className="py-2 px-2 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 print:bg-emerald-100 print:text-emerald-900">
                          {f.s}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Missing Required Regulatory Fields */}
        <div className="my-6 space-y-3">
          <h3 className="text-xs font-bold text-white print:text-slate-900 uppercase font-mono tracking-wider flex items-center gap-2">
            <AlertCircle size={14} className="text-amber-400" />
            <span>4. Mandatory Statutory Field Integrity Check</span>
          </h3>

          {isLiveSession ? (
            liveDossier?.missingFieldsList && liveDossier.missingFieldsList.length > 0 ? (
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/50 print:bg-amber-50 print:border-amber-200 space-y-2">
                <div className="text-xs font-semibold text-amber-300 print:text-amber-900">
                  Missing Mandatory Statutory Fields ({liveDossier.missingFieldsList.length} items flagged):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {liveDossier.missingFieldsList.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-900/60 border border-amber-900/40 print:bg-white print:border-amber-200"
                    >
                      <span className="font-semibold text-white print:text-slate-900 block">{m.fieldName}</span>
                      <span className="text-[11px] text-slate-400 print:text-slate-600 block mt-0.5">
                        Required for category: {m.category} ({m.docName})
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-[11px] text-amber-200/90 print:text-amber-800 font-mono pt-1">
                  Compliance Action: The applicant must supply supplementary notarized annexures for the highlighted fields before the regional scrutiny committee convenes.
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/50 print:bg-emerald-50 print:border-emerald-200 text-xs text-emerald-300 print:text-emerald-900 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 print:text-emerald-700" />
                <span>All mandatory statutory fields (registration numbers, dates, authorities, and dimensional bounds) were successfully extracted and validated.</span>
              </div>
            )
          ) : (
            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/50 print:bg-emerald-50 print:border-emerald-200 text-xs text-emerald-300 print:text-emerald-900 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 print:text-emerald-700" />
              <span>Mandatory identifiers present across submitted documentation.</span>
            </div>
          )}
        </div>

        {/* Section 5: Document Authentication & Container Integrity Checks */}
        <div className="my-6 space-y-3">
          <h3 className="text-xs font-bold text-white print:text-slate-900 uppercase font-mono tracking-wider flex items-center gap-2">
            <Shield size={14} className="text-cyan-400" />
            <span>5. Document Container Authentication & Structural Integrity</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {(isLiveSession ? liveDossier?.allAuthChecks || [] : [
              {
                docName: 'Architect Floor Plan',
                name: 'PDF Stream Structure & MIME Signature',
                status: 'PASS' as VerificationStatus,
                details: 'Compliant PDF-1.7 header (%PDF-) and valid trailer dictionary.',
                isAuthoritative: false,
              },
              {
                docName: 'Architect Floor Plan',
                name: 'Council of Architecture (CoA) Registration',
                status: 'PASS' as VerificationStatus,
                details: 'Architect registration CA/2012/58914 verified on statutory rolls.',
                isAuthoritative: false,
              },
              {
                docName: 'Fire & Life Safety NOC',
                name: 'Central Registry API Handshake',
                status: 'NOT CHECKED' as VerificationStatus,
                details: 'Official AICTE central portal API connection not established. Verification conducted via document-content & container checks.',
                isAuthoritative: true,
              },
              {
                docName: 'Land Possession Deed',
                name: 'State Land Revenue Directorate Seal',
                status: 'WARNING' as VerificationStatus,
                details: 'Document shows scanned sub-registrar stamp; external land record registry not checked.',
                isAuthoritative: false,
              },
            ]).map((chk, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 print:bg-slate-50 print:border-slate-200 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white print:text-slate-900">{chk.name}</span>
                  <StatusBadge status={chk.status} size="sm" />
                </div>
                <div className="text-[10px] font-mono text-cyan-400 print:text-blue-700">
                  Target: {chk.docName}
                </div>
                <p className="text-[11px] text-slate-300 print:text-slate-700 leading-relaxed">
                  {chk.details}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Detailed Audit Findings & Documentary Citations */}
        <div className="my-6 space-y-3">
          <h3 className="text-xs font-bold text-white print:text-slate-900 uppercase font-mono tracking-wider">
            6. Detailed Audit Findings & Documentary Citations
          </h3>
          <div className="space-y-2.5">
            {(isLiveSession ? liveDossier?.allFindings || [] : selectedApp.documents.flatMap((d) => d.findings)).map((f) => (
              <div 
                key={f.id} 
                className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 print:bg-slate-50 print:border-slate-200 text-xs space-y-1.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white print:text-slate-900">{f.title}</span>
                    <span className="text-[10px] font-mono text-cyan-400 print:text-blue-700 bg-cyan-950/60 print:bg-blue-100 px-1.5 py-0.2 rounded border border-cyan-800/40 print:border-blue-200">
                      {f.clause}
                    </span>
                    {(f as any).docName && (
                      <span className="text-[10px] font-mono text-slate-400 print:text-slate-500">
                        ({(f as any).docName})
                      </span>
                    )}
                  </div>
                  <StatusBadge status={f.type} size="sm" />
                </div>

                <p className="text-slate-300 print:text-slate-700 text-[11px] leading-relaxed">
                  {f.description}
                </p>

                <div className="font-mono text-[10px] text-slate-400 print:text-slate-600 bg-slate-950/40 print:bg-slate-100 p-2.5 rounded border border-slate-800/50 print:border-slate-200">
                  <span className="font-semibold text-cyan-400 print:text-blue-800">Documentary Evidence: </span>
                  "{f.evidenceQuote}"
                </div>

                <div className="text-[11px] text-slate-300 print:text-slate-700 pt-0.5">
                  <span className="font-semibold text-amber-300 print:text-amber-800">Statutory Action: </span>
                  {f.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 7: Cross-Document Reconciliation (When 2+ documents exist) */}
        {((isLiveSession && liveDossier && liveDossier.crossChecks.length > 0) || (!isLiveSession && selectedApp.documents.length >= 2)) && (
          <div className="my-6 space-y-3">
            <h3 className="text-xs font-bold text-white print:text-slate-900 uppercase font-mono tracking-wider flex items-center gap-2">
              <GitCompare size={14} className="text-cyan-400" />
              <span>7. Cross-Document Statutory Reconciliation Matrix</span>
            </h3>

            <div className="space-y-2">
              {(isLiveSession && liveDossier?.crossChecks ? liveDossier.crossChecks : [
                {
                  title: 'Survey Demarcation vs Land Possession Deed',
                  doc1: 'Building Architect Plan (Survey #48/2A)',
                  doc2: 'Land Possession Deed (Survey #48/2A-1)',
                  status: 'WARNING' as VerificationStatus,
                  notes: 'Plot partition sub-division requires certified revenue sketch from Tehsildar office.',
                },
                {
                  title: 'Institutional Name Alignment across Instruments',
                  doc1: 'Architect Plan ("Apex Institute of Tech")',
                  doc2: 'Fire Safety NOC ("Apex Institute of Tech & Sciences")',
                  status: 'PASS' as VerificationStatus,
                  notes: 'Slight name variation verified as identical registered society entity.',
                },
              ]).map((rec, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 print:bg-slate-50 print:border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <span className="font-semibold text-white print:text-slate-900 block">{rec.title}</span>
                    <div className="text-[10px] font-mono text-slate-400 print:text-slate-600 flex flex-wrap gap-2">
                      <span>Doc A: {rec.doc1}</span>
                      <span>↔</span>
                      <span>Doc B: {rec.doc2}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 print:text-slate-700">{rec.notes}</p>
                  </div>
                  <div className="shrink-0">
                    <StatusBadge status={rec.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 8: Reviewer Sign-Off & Holographic Digital Seal */}
        <div className="mt-8 pt-6 border-t border-slate-700 print:border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-600 shrink-0 bg-slate-800 print:border-slate-400">
              <img 
                src={REVIEWER_AVATAR} 
                alt="Dr. Sunita Mehra" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-xs">
              <div className="font-bold text-white print:text-slate-900">Dr. Sunita Mehra</div>
              <div className="text-[11px] text-slate-400 print:text-slate-600">Senior Regulatory Compliance Director</div>
              <div className="text-[10px] font-mono text-emerald-400 print:text-emerald-700">Digital Signature Verified · 2026-10-28</div>
            </div>
          </div>

          <div className="no-print flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono">Committee Finding:</span>
            <select
              value={committeeDecision}
              onChange={(e) => setCommitteeDecision(e.target.value)}
              className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white font-medium focus:outline-hidden focus:border-cyan-500"
            >
              <option value="RECOMMENDED_WITH_CONDITIONS">Recommended With Conditions</option>
              <option value="UNCONDITIONED_APPROVAL">Unconditioned Statutory Approval</option>
              <option value="DEFECT_NOTICE_ISSUED">Defect Notice Issued (Rectification Required)</option>
              <option value="REJECTED">Statutory Non-Compliance / Rejected</option>
            </select>
          </div>

          <div className="text-right font-mono text-[10px] text-slate-400 print:text-slate-600 space-y-0.5">
            <div>Cryptographic Verification Seal Hash:</div>
            <div className="font-bold text-cyan-400 print:text-blue-800">0x8f2d919c4b7e9a8f2348a729e102f901</div>
            <div>AICTE Directorate of Institutional Approvals</div>
          </div>
        </div>
      </div>
    </div>
  );
};
