export type VerificationStatus = 'PASS' | 'WARNING' | 'FAILED CHECK' | 'NOT CHECKED';

export type InstitutionType = 
  | 'Engineering & Technology' 
  | 'Management (MBA/PGDM)' 
  | 'Polytechnic & Diploma' 
  | 'Architecture & Planning' 
  | 'Applied Sciences & Pharmacy';

export interface ExtractedField {
  name: string;
  value: string | null;
  confidence: number;
  sourcePage?: number | string;
  status: 'EXTRACTED' | 'MISSING' | 'UNCERTAIN';
  evidenceQuote?: string;
}

export interface AuthenticationCheck {
  id: string;
  name: string;
  status: VerificationStatus;
  details: string;
  isAuthoritative: boolean;
  evidence?: string;
}

export interface CrossDocumentMismatch {
  id: string;
  field: string;
  doc1Name: string;
  doc1Value: string;
  doc1Page?: number | string;
  doc2Name: string;
  doc2Value: string;
  doc2Page?: number | string;
  severity: 'CRITICAL' | 'WARNING' | 'INFORMATIONAL';
  description: string;
  recommendedAction: string;
}

export interface DocumentAnomaly {
  id: string;
  type: VerificationStatus;
  clause: string;
  title: string;
  description: string;
  evidenceQuote: string;
  recommendedAction: string;
  fieldAffected?: string;
  declaredValue?: string;
  verifiedValue?: string;
  sourcePage?: number | string;
}

export interface DocumentItem {
  id: string;
  name: string;
  category: 
    | 'Land Title & Possession Deed' 
    | 'Building Completion & Architect Plan' 
    | 'Fire & Life Safety NOC' 
    | 'Faculty Cadre & Salary Audit' 
    | 'Trust/Society Registration' 
    | 'NBA/NAAC Accreditation' 
    | 'Endowment Fund Certificate';
  fileType: 'pdf' | 'jpg' | 'png';
  fileSize: string;
  uploadDate: string;
  status: VerificationStatus;
  confidenceScore: number;
  previewUrl?: string;
  rawExtractedText?: string;
  pageCount?: number;
  isScanned?: boolean;
  fields?: ExtractedField[];
  missingFields?: string[];
  authenticationChecks?: AuthenticationCheck[];
  extractedData: {
    institutionName: string;
    documentIdentifier: string;
    issuanceDate: string;
    expiryDate: string;
    issuingAuthority: string;
    address?: string;
    keyMetrics: Record<string, string>;
  };
  findings: DocumentAnomaly[];
  processingError?: string | null;
}

export interface Application {
  id: string;
  applicationRef: string;
  institutionName: string;
  institutionType: InstitutionType;
  region: 'Northern' | 'Southern' | 'Western' | 'Eastern' | 'South-Central';
  location: string;
  submissionDate: string;
  lastUpdated: string;
  overallStatus: VerificationStatus;
  riskScore: number; // 0 (Low) to 100 (Severe)
  complianceScore: number; // 0 to 100
  documentsSubmittedCount: number;
  totalRequiredDocs: number;
  assignedAuditor: string;
  documents: DocumentItem[];
  reviewerNotes?: string;
}

export interface ComplianceRule {
  id: string;
  category: 'Infrastructure & Land' | 'Faculty Cadre' | 'Safety & Clearances' | 'Academic & Accreditation';
  name: string;
  clauseRef: string;
  requirement: string;
  standardValue: string;
  calculatedValue: string;
  unit?: string;
  result: VerificationStatus;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  evidence: string;
  reviewerActionTaken?: 'APPROVED_EXCEPTION' | 'NOTICE_ISSUED' | 'CLARIFICATION_REQUESTED' | 'PENDING';
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  eventType: 'AI Extraction' | 'Manual Override' | 'Defect Notice' | 'Document Upload' | 'Rule Configuration';
  user: string;
  action: string;
  targetApplication: string;
  details: string;
  status: VerificationStatus;
  hash: string;
}

export interface AIInsight {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  institution: string;
  summary: string;
  clause: string;
  detectedAt: string;
  actionRequired: string;
}
