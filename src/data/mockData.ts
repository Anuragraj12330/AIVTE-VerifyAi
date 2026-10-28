import { Application, ComplianceRule, ActivityLog, AIInsight } from '../types';

export const AICTE_SEAL_IMG = '/src/assets/images/aicte_verification_seal_1793181019214.jpg';
export const REVIEWER_AVATAR = '/src/assets/images/avatar_reviewer_lead_1793181016284.jpg';
export const ANALYST_AVATAR = '/src/assets/images/avatar_compliance_analyst_1793181018413.jpg';
export const BLUEPRINT_PREVIEW_IMG = '/src/assets/images/document_blueprint_preview_1793181019745.jpg';

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-001',
    applicationRef: 'AICTE-2026-SR-9418',
    institutionName: 'Apex Institute of Technology & Sciences',
    institutionType: 'Engineering & Technology',
    region: 'Southern',
    location: 'Bengaluru, Karnataka',
    submissionDate: '2026-10-14',
    lastUpdated: '2026-10-27 16:42',
    overallStatus: 'WARNING',
    riskScore: 68,
    complianceScore: 78,
    documentsSubmittedCount: 7,
    totalRequiredDocs: 7,
    assignedAuditor: 'Dr. Sunita Mehra',
    reviewerNotes: 'Sub-division survey demarcation pending from District Collectorate. Built-up area in architect certificate differs by 2,650 sq.m from municipal sanction plan.',
    documents: [
      {
        id: 'doc-101',
        name: 'Land_Title_Sale_Deed_Sy44_2.pdf',
        category: 'Land Title & Possession Deed',
        fileType: 'pdf',
        fileSize: '4.8 MB',
        uploadDate: '2026-10-14',
        status: 'WARNING',
        confidenceScore: 97.2,
        previewUrl: BLUEPRINT_PREVIEW_IMG,
        extractedData: {
          institutionName: 'Apex Institute of Technology & Sciences',
          documentIdentifier: 'REV/KA/BLR/2021/44-2',
          issuanceDate: '2021-03-18',
          expiryDate: '2051-03-17 (30 Yr Lease)',
          issuingAuthority: 'Sub-Registrar Office, Yelahanka Bengaluru',
          keyMetrics: {
            'Registered Extent': '5.25 Acres (21,245 sq.m)',
            'Contiguity': 'Single Contiguous Plot',
            'Survey Number': 'Sy. No. 44/2 (Part A)',
            'Tenure Classification': 'Registered 30-Year Irrevocable Lease',
            'Non-Agricultural Conversion': 'Order No. ALN/CR/114/2020-21 Passed'
          }
        },
        findings: [
          {
            id: 'FN-101',
            type: 'WARNING',
            clause: 'AICTE APH 2025-26 Sec 4.1.2',
            title: 'Revenue Sub-division Survey Boundary Variance',
            description: 'Deed lists Survey 44/2, while municipal layout sanction references Survey 44/2A. Boundary demarcations require official revenue sub-division sketch.',
            evidenceQuote: 'Schedule: "All that agricultural land converted for educational use bearing Sy. No. 44/2..."',
            recommendedAction: 'Direct applicant to furnish 11E Revenue Demarcation Sketch issued by Assistant Director of Land Records (ADLR).',
            fieldAffected: 'Survey Demarcation Number',
            declaredValue: 'Sy. No. 44/2',
            verifiedValue: 'Sy. No. 44/2A'
          }
        ]
      },
      {
        id: 'doc-102',
        name: 'Architect_Built_Up_Area_Completion_Certificate.pdf',
        category: 'Building Completion & Architect Plan',
        fileType: 'pdf',
        fileSize: '8.2 MB',
        uploadDate: '2026-10-15',
        status: 'FAILED CHECK',
        confidenceScore: 94.6,
        previewUrl: BLUEPRINT_PREVIEW_IMG,
        extractedData: {
          institutionName: 'Apex Institute of Technology & Sciences',
          documentIdentifier: 'COA/ARCH/2025/CERT-890',
          issuanceDate: '2025-11-20',
          expiryDate: 'Permanent Record',
          issuingAuthority: 'Council of Architecture Reg. CA/2004/34891',
          keyMetrics: {
            'Certified Built-Up Area': '14,850 sq.m',
            'Municipal Sanctioned Area': '12,200 sq.m',
            'Instructional Carpet Area': '7,920 sq.m',
            'Barrier-Free Access': 'Elevators (2) + Ramp 1:12 Verified',
            'Occupancy Status': 'Provisional Fit-Out'
          }
        },
        findings: [
          {
            id: 'FN-102',
            type: 'FAILED CHECK',
            clause: 'AICTE APH 2025-26 Sec 4.4(a)',
            title: 'Unsanctioned Built-Up Area Mismatch (+2,650 sq.m)',
            description: 'Architect certificate declares 14,850 sq.m built-up area; municipal approval plan allows only 12,200 sq.m FSI. Excess area lacks Town Planning regularisation endorsement.',
            evidenceQuote: 'Architect Certificate Item 3: "Total constructed area 14,850 sq.m" vs Municipal Plan #BBMP/TP/2022/410: "Sanctioned FSI 12,200 sq.m"',
            recommendedAction: 'Issue formal AICTE Defect Notice requiring revised sanction plan from Town Planning Authority.',
            fieldAffected: 'Sanctioned Built-Up Area',
            declaredValue: '14,850 sq.m',
            verifiedValue: '12,200 sq.m'
          }
        ]
      },
      {
        id: 'doc-103',
        name: 'State_Fire_Safety_NOC_2025.pdf',
        category: 'Fire & Life Safety NOC',
        fileType: 'pdf',
        fileSize: '3.1 MB',
        uploadDate: '2026-10-15',
        status: 'PASS',
        confidenceScore: 98.9,
        extractedData: {
          institutionName: 'Apex Institute of Technology & Sciences',
          documentIdentifier: 'K-FS/BNG/NOC-2024/774',
          issuanceDate: '2024-06-10',
          expiryDate: '2027-06-09',
          issuingAuthority: 'Karnataka State Fire and Emergency Services',
          keyMetrics: {
            'NOC Validity': 'Active until 09-Jun-2027',
            'Hydrant System': 'Two-stage pressurized pump (7.5 Bar)',
            'Static Water Reservoir': '150,000 Litres Dedicated',
            'Escape Stairwells': '3 Enclosed External Staircases (1.8m width)'
          }
        },
        findings: [
          {
            id: 'FN-103',
            type: 'PASS',
            clause: 'AICTE APH 2025-26 Sec 5.4',
            title: 'Fire Safety Compliant with Active Certification',
            description: 'Fire Safety NOC is currently active with valid 3-year term. Satisfies National Building Code (NBC) 2016 Part IV norms.',
            evidenceQuote: 'NOC Clause 4: "Fire hydrant pressure and underground storage tank capacity verified on site."',
            recommendedAction: 'Retain verified status in dossier.'
          }
        ]
      }
    ]
  },
  {
    id: 'app-002',
    applicationRef: 'AICTE-2026-WR-1104',
    institutionName: 'National Polytechnic College',
    institutionType: 'Polytechnic & Diploma',
    region: 'Western',
    location: 'Pune, Maharashtra',
    submissionDate: '2026-10-18',
    lastUpdated: '2026-10-28 01:15',
    overallStatus: 'WARNING',
    riskScore: 54,
    complianceScore: 82,
    documentsSubmittedCount: 6,
    totalRequiredDocs: 6,
    assignedAuditor: 'Prakash Deshmukh',
    reviewerNotes: 'Fire NOC expired 45 days prior to submission. Renewal fee paid and receipt attached; awaiting physical site re-inspection endorsement.',
    documents: [
      {
        id: 'doc-201',
        name: 'Maharashtra_Fire_NOC_Renewal_Challan.pdf',
        category: 'Fire & Life Safety NOC',
        fileType: 'pdf',
        fileSize: '2.4 MB',
        uploadDate: '2026-10-18',
        status: 'WARNING',
        confidenceScore: 95.1,
        extractedData: {
          institutionName: 'National Polytechnic College',
          documentIdentifier: 'MH-FIRE/PUNE/RN-2026/89',
          issuanceDate: '2023-08-15',
          expiryDate: '2026-08-14 (Expired)',
          issuingAuthority: 'Pune Metropolitan Region Fire Department',
          keyMetrics: {
            'NOC Term': '3 Years (Expired 14-Aug-2026)',
            'Renewal Application Date': '2026-09-02 (Post Expiry)',
            'Challan Amount Paid': '₹45,000 via MahaOnline Ref #99281',
            'Pending Step': 'Divisional Fire Officer Inspection'
          }
        },
        findings: [
          {
            id: 'FN-201',
            type: 'WARNING',
            clause: 'AICTE APH 2025-26 Sec 5.4(b)',
            title: 'Fire Safety NOC Expired with Ongoing Renewal',
            description: 'Previous certificate lapsed on 14-Aug-2026. While renewal payment receipt is provided, mandatory unconditional clearance is pending.',
            evidenceQuote: 'Challan #MH-44021: "Inspection scheduled within 30 days"',
            recommendedAction: 'Issue provisional 30-day compliance window to submit Chief Fire Officer renewal endorsement.'
          }
        ]
      }
    ]
  },
  {
    id: 'app-003',
    applicationRef: 'AICTE-2026-NR-3829',
    institutionName: 'Vanguard Institute of Management',
    institutionType: 'Management (MBA/PGDM)',
    region: 'Northern',
    location: 'Gurugram, NCR Haryana',
    submissionDate: '2026-10-20',
    lastUpdated: '2026-10-27 11:30',
    overallStatus: 'PASS',
    riskScore: 12,
    complianceScore: 98,
    documentsSubmittedCount: 8,
    totalRequiredDocs: 8,
    assignedAuditor: 'Dr. Sunita Mehra',
    reviewerNotes: 'Exemplary application. Freehold unencumbered land (3.2 acres), NBA Tier-1 accredited PGDM program, Faculty cadre ratio 1:14 (superior to 1:15 required).',
    documents: [
      {
        id: 'doc-301',
        name: 'NBA_Tier1_Accreditation_Certificate.pdf',
        category: 'NBA/NAAC Accreditation',
        fileType: 'pdf',
        fileSize: '1.9 MB',
        uploadDate: '2026-10-20',
        status: 'PASS',
        confidenceScore: 99.4,
        extractedData: {
          institutionName: 'Vanguard Institute of Management',
          documentIdentifier: 'NBA/ACCR/MGMT/2024/0912',
          issuanceDate: '2024-07-01',
          expiryDate: '2027-06-30',
          issuingAuthority: 'National Board of Accreditation, New Delhi',
          keyMetrics: {
            'Accredited Program': 'PGDM (Post Graduate Diploma in Management)',
            'Accreditation Status': 'Accredited (Tier-1 Institutional Framework)',
            'Validity Period': '3 Years (Active)',
            'Outcome Score': '742 / 1000 Points'
          }
        },
        findings: [
          {
            id: 'FN-301',
            type: 'PASS',
            clause: 'AICTE APH 2025-26 Sec 6.1',
            title: 'Accreditation Standards Fully Met',
            description: 'Accreditation from NBA active through 2027. Eligible for autonomy and intake expansion.',
            evidenceQuote: 'NBA Resolution: "Approved accreditation for a period of three academic years."',
            recommendedAction: 'Eligible for automatic renewal fast-track.'
          }
        ]
      }
    ]
  },
  {
    id: 'app-004',
    applicationRef: 'AICTE-2026-SR-5512',
    institutionName: 'St. Xavier College of Engineering & Research',
    institutionType: 'Engineering & Technology',
    region: 'Southern',
    location: 'Kochi, Kerala',
    submissionDate: '2026-10-22',
    lastUpdated: '2026-10-26 14:10',
    overallStatus: 'FAILED CHECK',
    riskScore: 88,
    complianceScore: 48,
    documentsSubmittedCount: 5,
    totalRequiredDocs: 7,
    assignedAuditor: 'Dr. Sunita Mehra',
    reviewerNotes: 'Critical infrastructure deficit. Instructional lab carpet area measures only 3.1 sq.m per student against mandatory minimum 4.0 sq.m. Missing Anti-Ragging committee gazette notification.',
    documents: [
      {
        id: 'doc-401',
        name: 'Civil_Carpet_Area_Audit_Report.pdf',
        category: 'Building Completion & Architect Plan',
        fileType: 'pdf',
        fileSize: '5.1 MB',
        uploadDate: '2026-10-22',
        status: 'FAILED CHECK',
        confidenceScore: 96.8,
        previewUrl: BLUEPRINT_PREVIEW_IMG,
        extractedData: {
          institutionName: 'St. Xavier College of Engineering & Research',
          documentIdentifier: 'KER/ENG/AUDIT/2026/194',
          issuanceDate: '2026-02-10',
          expiryDate: 'Permanent Record',
          issuingAuthority: 'State Technical Directorate Certified Auditor',
          keyMetrics: {
            'Enrolled Intake': '1,200 Students',
            'Instructional Lab Area': '3,720 sq.m',
            'Effective Ratio': '3.10 sq.m / student',
            'APH Mandated Min': '4.00 sq.m / student',
            'Area Deficit': '1,080 sq.m Shortfall'
          }
        },
        findings: [
          {
            id: 'FN-401',
            type: 'FAILED CHECK',
            clause: 'AICTE APH 2025-26 Sec 4.4(c)',
            title: 'Deficit in Instructional Laboratory Carpet Area',
            description: 'Calculated 3.10 sq.m/student falls below mandatory AICTE 4.00 sq.m/student floor requirement for Engineering disciplines.',
            evidenceQuote: 'Tabulation Sheet B: "Total laboratory area 3,720 sq.m for sanctioned student intake of 1,200."',
            recommendedAction: 'Immediate reduction of intake or provision of additional instructional block within 60 days.',
            fieldAffected: 'Laboratory Carpet Area per Student',
            declaredValue: '3.10 sq.m',
            verifiedValue: '4.00 sq.m required'
          }
        ]
      }
    ]
  },
  {
    id: 'app-005',
    applicationRef: 'AICTE-2026-SCR-8291',
    institutionName: 'Hyderabad Institute of Advanced Technology',
    institutionType: 'Engineering & Technology',
    region: 'South-Central',
    location: 'Hyderabad, Telangana',
    submissionDate: '2026-10-23',
    lastUpdated: '2026-10-28 02:10',
    overallStatus: 'PASS',
    riskScore: 8,
    complianceScore: 96,
    documentsSubmittedCount: 7,
    totalRequiredDocs: 7,
    assignedAuditor: 'Dr. Sunita Mehra',
    reviewerNotes: 'Autonomous institution. NAAC A+ accredited (CGPA 3.52). Contiguous land area of 8.4 acres with complete building completion certificate and approved fire safety clearance.',
    documents: [
      {
        id: 'doc-501',
        name: 'NAAC_Accreditation_Certificate_A_Plus.pdf',
        category: 'NBA/NAAC Accreditation',
        fileType: 'pdf',
        fileSize: '3.8 MB',
        uploadDate: '2026-10-23',
        status: 'PASS',
        confidenceScore: 99.8,
        extractedData: {
          institutionName: 'Hyderabad Institute of Advanced Technology',
          documentIdentifier: 'NAAC/TEL/2025/CERT-7128',
          issuanceDate: '2025-04-10',
          expiryDate: '2030-04-09',
          issuingAuthority: 'National Assessment and Accreditation Council',
          keyMetrics: {
            'NAAC Grade': 'A+ (CGPA 3.52)',
            'Autonomous Status': 'UGC Conferred Autonomous through 2032',
            'Validity Term': '5 Years (Active)',
            'Faculty Cadre': '1:13.8 (Exceeds Norm)'
          }
        },
        findings: [
          {
            id: 'FN-501',
            type: 'PASS',
            clause: 'AICTE APH 2025-26 Sec 6.2',
            title: 'High Institutional Accreditation Standing',
            description: 'NAAC A+ with CGPA 3.52 confers deemed approval status for existing technical programs.',
            evidenceQuote: 'NAAC Notification: "Institutional accreditation awarded with cumulative grade point 3.52 on four point scale."',
            recommendedAction: 'Clear for expedited extension of approval.'
          }
        ]
      }
    ]
  },
  {
    id: 'app-006',
    applicationRef: 'AICTE-2026-ER-4471',
    institutionName: 'Kalinga Academy of Applied Sciences',
    institutionType: 'Applied Sciences & Pharmacy',
    region: 'Eastern',
    location: 'Bhubaneswar, Odisha',
    submissionDate: '2026-10-25',
    lastUpdated: '2026-10-25 09:20',
    overallStatus: 'NOT CHECKED',
    riskScore: 0,
    complianceScore: 0,
    documentsSubmittedCount: 4,
    totalRequiredDocs: 7,
    assignedAuditor: 'Unassigned Queue',
    reviewerNotes: 'New application pending batch automated OCR extraction and cross-check pipeline execution.',
    documents: [
      {
        id: 'doc-601',
        name: 'Trust_Deed_Registration_Kalinga.pdf',
        category: 'Trust/Society Registration',
        fileType: 'pdf',
        fileSize: '3.4 MB',
        uploadDate: '2026-10-25',
        status: 'NOT CHECKED',
        confidenceScore: 0,
        extractedData: {
          institutionName: 'Kalinga Academy of Applied Sciences',
          documentIdentifier: 'OD/TRUST/2022/990',
          issuanceDate: '2022-01-14',
          expiryDate: 'Perpetual',
          issuingAuthority: 'Registrar of Societies, Odisha',
          keyMetrics: {
            'Registration Status': 'Pending Ingestion',
            'Batch State': 'In Queue'
          }
        },
        findings: []
      }
    ]
  }
];

export const COMPLIANCE_RULES: ComplianceRule[] = [
  {
    id: 'rule-01',
    category: 'Infrastructure & Land',
    name: 'Minimum Contiguous Land Area',
    clauseRef: 'AICTE APH 2025-26 Sec 4.1',
    requirement: 'Minimum contiguous unencumbered land parcel for Engineering & Technology programs in Urban/Mega cities is 2.50 Acres (Rural: 7.50 Acres).',
    standardValue: '≥ 2.50',
    calculatedValue: '5.25',
    unit: 'Acres',
    result: 'PASS',
    severity: 'HIGH',
    evidence: 'Verified against Registered 30-Year Lease Deed Vol 429, Page 112 with Sub-Registrar endorsement.',
    reviewerActionTaken: 'PENDING'
  },
  {
    id: 'rule-02',
    category: 'Infrastructure & Land',
    name: 'Instructional Carpet Area per Student',
    clauseRef: 'AICTE APH 2025-26 Sec 4.4(c)',
    requirement: 'Minimum instructional laboratory, workshop, and lecture carpet area must meet 4.00 sq.m per enrolled student.',
    standardValue: '≥ 4.00',
    calculatedValue: '3.72',
    unit: 'sq.m / student',
    result: 'WARNING',
    severity: 'HIGH',
    evidence: 'Civil audit calculation: 7,920 sq.m instructional area divided by 2,130 sanctioned intake gives 3.72 sq.m (7% variance under allowable buffer).',
    reviewerActionTaken: 'CLARIFICATION_REQUESTED'
  },
  {
    id: 'rule-03',
    category: 'Infrastructure & Land',
    name: 'Architect Sanction vs Municipal FSI Consistency',
    clauseRef: 'AICTE APH 2025-26 Sec 4.4(a)',
    requirement: 'Declared built-up area in Registered Architect Certificate must match approved Municipal Town Planning sanction plan within 5% tolerance.',
    standardValue: '≤ 5.0%',
    calculatedValue: '21.7%',
    unit: 'variance',
    result: 'FAILED CHECK',
    severity: 'HIGH',
    evidence: 'Architect declares 14,850 sq.m built area vs Municipal Sanction Plan #BBMP/TP/2022/410 approving 12,200 sq.m (+2,650 sq.m excess unsanctioned space).',
    reviewerActionTaken: 'NOTICE_ISSUED'
  },
  {
    id: 'rule-04',
    category: 'Faculty Cadre',
    name: 'Student-to-Faculty Ratio (SFR)',
    clauseRef: 'AICTE APH 2025-26 Sec 7.1',
    requirement: 'Engineering & Technology undergraduate degree programs mandate a Student-to-Faculty Ratio of 1:15 based on regular pay scale appointments.',
    standardValue: '≤ 15.0',
    calculatedValue: '14.8',
    unit: ':1 SFR',
    result: 'PASS',
    severity: 'HIGH',
    evidence: '144 full-time AICTE qualified faculty members verified against 2,130 enrolled students. EPF salary credit statements reconciled.',
    reviewerActionTaken: 'PENDING'
  },
  {
    id: 'rule-05',
    category: 'Faculty Cadre',
    name: 'Faculty Cadre Proportion (1:2:6)',
    clauseRef: 'AICTE APH 2025-26 Sec 7.2',
    requirement: 'Faculty distribution across Professor : Associate Professor : Assistant Professor cadres must follow 1 : 2 : 6 ratio.',
    standardValue: '1 : 2 : 6',
    calculatedValue: '1 : 1.8 : 6.4',
    unit: 'cadre ratio',
    result: 'PASS',
    severity: 'MEDIUM',
    evidence: '16 Professors, 29 Associate Professors, and 99 Assistant Professors currently in active employment service.',
    reviewerActionTaken: 'PENDING'
  },
  {
    id: 'rule-06',
    category: 'Safety & Clearances',
    name: 'Fire & Life Safety NOC Validity',
    clauseRef: 'AICTE APH 2025-26 Sec 5.4',
    requirement: 'Institution must possess an active, non-expired Fire Safety Clearance Certificate issued by the State Fire Services Directorate.',
    standardValue: 'Active / Valid',
    calculatedValue: 'Valid (Exp. 2027)',
    result: 'PASS',
    severity: 'HIGH',
    evidence: 'Certificate #K-FS/BNG/NOC-2024/774 verified directly against Karnataka Fire Department database. Valid through 09-Jun-2027.',
    reviewerActionTaken: 'PENDING'
  },
  {
    id: 'rule-07',
    category: 'Safety & Clearances',
    name: 'Barrier-Free Accessibility & Disability Compliance',
    clauseRef: 'AICTE APH 2025-26 Sec 5.6',
    requirement: 'RPwD Act 2016 compliance: Dedicated disabled parking, continuous tactile ramps (1:12 slope), Braille elevators, and accessible restrooms on every floor.',
    standardValue: '100% Compliant',
    calculatedValue: 'Verified',
    result: 'PASS',
    severity: 'MEDIUM',
    evidence: 'Architect accessibility audit confirms 2 specialized stretcher lifts, tactile flooring across corridors, and dedicated ground floor accessible restrooms.',
    reviewerActionTaken: 'PENDING'
  },
  {
    id: 'rule-08',
    category: 'Academic & Accreditation',
    name: 'Anti-Ragging Committee Statutory Notification',
    clauseRef: 'AICTE APH 2025-26 Sec 6.4',
    requirement: 'Mandatory constitution of Anti-Ragging Squad, Committee, and 24x7 helpline details published on institutional web portal and public gazette.',
    standardValue: 'Published & Filed',
    calculatedValue: 'Verified 2026',
    result: 'PASS',
    severity: 'HIGH',
    evidence: 'Annual compliance affidavit filed with AICTE portal; District Magistrate and Local Police Station representative signatories verified.',
    reviewerActionTaken: 'PENDING'
  }
];

export const ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-01',
    timestamp: '2026-10-28 02:40:12',
    eventType: 'AI Extraction',
    user: 'Gemini 3.8 Flash Neural Engine',
    action: 'Document Parsed & Reconciled',
    targetApplication: 'Apex Institute of Technology (AICTE-2026-SR-9418)',
    details: 'Extracted 14 metadata fields from Architect_Built_Up_Area.pdf. Detected 2,650 sq.m discrepancy vs municipal master plan.',
    status: 'FAILED CHECK',
    hash: '0x8f2d919c4b7e9a8f2348'
  },
  {
    id: 'log-02',
    timestamp: '2026-10-28 01:14:45',
    eventType: 'Defect Notice',
    user: 'Dr. Sunita Mehra (Senior Auditor)',
    action: 'Formal Defect Notice Dispatched',
    targetApplication: 'St. Xavier College of Engineering (AICTE-2026-SR-5512)',
    details: 'Dispatched AICTE Defect Notice for inadequate laboratory carpet area (3.10 sq.m vs required 4.00 sq.m per student).',
    status: 'FAILED CHECK',
    hash: '0x1c8b32e09aa47f12e841'
  },
  {
    id: 'log-03',
    timestamp: '2026-10-27 18:22:10',
    eventType: 'Manual Override',
    user: 'Prakash Deshmukh (Zonal Reviewer)',
    action: 'Conditional Grace Period Granted',
    targetApplication: 'National Polytechnic College (AICTE-2026-WR-1104)',
    details: 'Approved 30-day provisional review window for submission of finalized Fire Safety NOC inspection endorsement.',
    status: 'WARNING',
    hash: '0x4e9f7831acb021d77429'
  },
  {
    id: 'log-04',
    timestamp: '2026-10-27 14:05:30',
    eventType: 'AI Extraction',
    user: 'Gemini 3.8 Flash Neural Engine',
    action: 'Accreditation Credentials Validated',
    targetApplication: 'Vanguard Institute of Management (AICTE-2026-NR-3829)',
    details: 'Cross-checked NBA Tier-1 accreditation certificate #NBA/ACCR/MGMT/2024/0912 against official National Board repository. 100% matched.',
    status: 'PASS',
    hash: '0x9923bbfa1103c847e930'
  },
  {
    id: 'log-05',
    timestamp: '2026-10-27 10:18:02',
    eventType: 'Document Upload',
    user: 'Institutional Registrar (Kalinga Academy)',
    action: 'Document Dossier Ingested',
    targetApplication: 'Kalinga Academy of Applied Sciences (AICTE-2026-ER-4471)',
    details: 'Uploaded 4 documents: Trust Deed, Land Allotment Letter, Bank Endowment Guarantee, and Draft Curriculum.',
    status: 'NOT CHECKED',
    hash: '0x33b8a1c900e47192df80'
  },
  {
    id: 'log-06',
    timestamp: '2026-10-26 16:50:41',
    eventType: 'Rule Configuration',
    user: 'System Administrator (AICTE HQ)',
    action: 'Regulatory Threshold Updated',
    targetApplication: 'System Wide (Approval Process Handbook 2025-26)',
    details: 'Updated Student-to-Faculty Ratio requirement rule for PGDM courses from 1:20 to mandatory 1:15 in alignment with revised gazette.',
    status: 'PASS',
    hash: '0xaa782e430981dfbc4201'
  }
];

export const AI_INSIGHTS: AIInsight[] = [
  {
    id: 'ins-01',
    severity: 'critical',
    title: 'Built-Up FSI Area Discrepancy Across Approvals',
    institution: 'Apex Institute of Technology & Sciences',
    summary: 'The architect completion certificate reports 14,850 sq.m of constructed instructional space, while the municipal planning permission permits a maximum 12,200 sq.m (+21.7% unsanctioned floor space).',
    clause: 'AICTE APH 2025-26 Sec 4.4(a)',
    detectedAt: '2 hours ago',
    actionRequired: 'Issue AICTE Defect Notice for regularized town planning completion plan.'
  },
  {
    id: 'ins-02',
    severity: 'warning',
    title: 'Fire Safety NOC Expired With Renewal Pending',
    institution: 'National Polytechnic College',
    summary: 'Primary Fire Safety Certificate lapsed on 14-Aug-2026. Institutional renewal fee challan is submitted, but official site clearance from the Chief Fire Officer remains outstanding.',
    clause: 'AICTE APH 2025-26 Sec 5.4(b)',
    detectedAt: 'Yesterday',
    actionRequired: 'Conditional 30-day compliance window granted; monitor inspection upload.'
  },
  {
    id: 'ins-03',
    severity: 'critical',
    title: 'Severe Instructional Laboratory Area Deficit',
    institution: 'St. Xavier College of Engineering & Research',
    summary: 'Instructional laboratory floor space provides only 3.10 sq.m per student against the mandatory 4.00 sq.m minimum specified by AICTE, creating an aggregate deficit of 1,080 sq.m.',
    clause: 'AICTE APH 2025-26 Sec 4.4(c)',
    detectedAt: '2 days ago',
    actionRequired: 'Recommend immediate reduction in sanctioned student intake.'
  }
];
