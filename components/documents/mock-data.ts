import { AlertTriangle, Briefcase, Building2, CheckCircle2, Clock3, FileArchive, FileCheck2, FileText, Landmark, ShieldAlert, type LucideIcon } from "lucide-react";

export type DocumentStatus = "Compliant" | "Review Required" | "High Risk" | "In Verification";
export type StatusVariant = "success" | "warning" | "danger" | "info";

export type DocumentRecord = {
  id: string;
  title: string;
  category: string;
  type: string;
  owner: string;
  uploadedAt: string;
  updatedAt: string;
  size: string;
  pages: number;
  jurisdiction: string;
  healthScore: number;
  status: DocumentStatus;
  statusVariant: StatusVariant;
  summary: string;
  insights: string[];
  clausesToReview: string[];
  relatedRegulations: string[];
  timeline: Array<{
    label: string;
    detail: string;
    time: string;
  }>;
};

export type PortfolioMetric = {
  label: string;
  value: string;
  note: string;
  variant: StatusVariant | "neutral";
  icon: LucideIcon;
};

export type QueueItem = {
  title: string;
  detail: string;
  eta: string;
  variant: StatusVariant;
};

export const portfolioMetrics: PortfolioMetric[] = [
  {
    label: "Active Documents",
    value: "128",
    note: "+6 this week",
    variant: "neutral",
    icon: FileArchive,
  },
  {
    label: "Ready for Filing",
    value: "91",
    note: "71% portfolio coverage",
    variant: "success",
    icon: FileCheck2,
  },
  {
    label: "Needs Counsel Review",
    value: "14",
    note: "Prioritise this week",
    variant: "warning",
    icon: ShieldAlert,
  },
  {
    label: "Critical Redlines",
    value: "3",
    note: "Escalated today",
    variant: "danger",
    icon: AlertTriangle,
  },
];

export const documentCategories = [
  { label: "Corporate", count: 42, icon: Building2 },
  { label: "Commercial", count: 31, icon: Briefcase },
  { label: "Regulatory", count: 22, icon: Landmark },
  { label: "Operational", count: 33, icon: FileText },
];

export const reviewQueue: QueueItem[] = [
  {
    title: "Vendor master agreement renewal",
    detail: "Data transfer clause requires PDP alignment before signature.",
    eta: "Due in 4 hours",
    variant: "danger",
  },
  {
    title: "Board resolution package",
    detail: "Final signer block and witness attachment pending verification.",
    eta: "Due tomorrow",
    variant: "warning",
  },
  {
    title: "Employee NDA batch",
    detail: "Sampling checks look healthy; awaiting final compliance note.",
    eta: "In progress",
    variant: "info",
  },
];

export const documents: DocumentRecord[] = [
  {
    id: "doc-pdp-vendor-msa",
    title: "Vendor Data Processing Addendum",
    category: "Commercial",
    type: "Master Service Agreement",
    owner: "Procurement Legal",
    uploadedAt: "31 Mar 2026 · 08:10",
    updatedAt: "31 Mar 2026 · 10:24",
    size: "2.4 MB",
    pages: 18,
    jurisdiction: "Indonesia",
    healthScore: 68,
    status: "Review Required",
    statusVariant: "warning",
    summary:
      "Strong commercial structure with mostly complete annexes, but cross-border transfer language and processor obligations still need sharper wording for PDP readiness.",
    insights: [
      "2 clauses partially aligned with UU PDP and should be tightened before countersignature.",
      "Liability cap and audit cooperation language are acceptable for current vendor tier.",
      "Schedule B references an outdated retention period that conflicts with internal policy.",
    ],
    clausesToReview: [
      "Cross-border transfer mechanism for subprocessors based outside Indonesia.",
      "Breach notification SLA currently states 7 days; policy target is 72 hours.",
      "Data deletion certificate requirement missing from termination section.",
    ],
    relatedRegulations: [
      "UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi",
      "PP No. 71 Tahun 2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik",
    ],
    timeline: [
      {
        label: "Uploaded",
        detail: "Procurement Legal submitted the agreement package.",
        time: "08:10",
      },
      {
        label: "AI analysis completed",
        detail: "Clause extraction, metadata mapping, and risk scoring finished.",
        time: "08:18",
      },
      {
        label: "Reviewer note added",
        detail: "Counsel flagged transfer and retention wording for revision.",
        time: "10:24",
      },
    ],
  },
  {
    id: "doc-board-resolution-2026",
    title: "Board Resolution - New Subsidiary Setup",
    category: "Corporate",
    type: "Corporate Resolution",
    owner: "Corporate Secretary",
    uploadedAt: "30 Mar 2026 · 15:42",
    updatedAt: "31 Mar 2026 · 09:02",
    size: "1.1 MB",
    pages: 9,
    jurisdiction: "Indonesia",
    healthScore: 92,
    status: "Compliant",
    statusVariant: "success",
    summary:
      "Clean internal resolution package with complete signatory structure, correct entity references, and no immediate governance gaps detected.",
    insights: [
      "Entity names and shareholder composition are internally consistent across the package.",
      "Submission-ready after witness attachment is archived with the signed copy.",
      "No high-risk governance deviation detected against the current articles of association.",
    ],
    clausesToReview: [
      "Archive wet-sign witness attachment together with the final board minutes.",
    ],
    relatedRegulations: [
      "UU No. 40 Tahun 2007 tentang Perseroan Terbatas",
    ],
    timeline: [
      {
        label: "Uploaded",
        detail: "Corporate Secretary uploaded the board resolution draft.",
        time: "15:42",
      },
      {
        label: "AI analysis completed",
        detail: "Governance template check and entity validation completed.",
        time: "15:49",
      },
      {
        label: "Marked compliant",
        detail: "No blocking items found for filing preparation.",
        time: "09:02",
      },
    ],
  },
  {
    id: "doc-employee-nda-batch",
    title: "Employee NDA Batch - Product Team",
    category: "Operational",
    type: "Employment Agreement",
    owner: "People Operations",
    uploadedAt: "29 Mar 2026 · 13:30",
    updatedAt: "30 Mar 2026 · 16:10",
    size: "3.8 MB",
    pages: 26,
    jurisdiction: "Indonesia",
    healthScore: 81,
    status: "In Verification",
    statusVariant: "info",
    summary:
      "Template quality is solid and confidentiality obligations are present, with a few employee-specific annexes still being checked for completeness.",
    insights: [
      "Confidentiality and IP assignment language match the approved template.",
      "Three annexes need final initials before archiving the batch.",
      "No severe labor-law mismatch surfaced in sampled clauses.",
    ],
    clausesToReview: [
      "Complete initials on Annex B for three employees.",
      "Confirm return-of-property wording against the latest HR handbook.",
    ],
    relatedRegulations: [
      "UU No. 13 Tahun 2003 tentang Ketenagakerjaan",
      "UU No. 6 Tahun 2023 tentang Cipta Kerja",
    ],
    timeline: [
      {
        label: "Uploaded",
        detail: "People Operations uploaded the consolidated NDA pack.",
        time: "13:30",
      },
      {
        label: "AI analysis completed",
        detail: "Template variance detection and annex parsing completed.",
        time: "13:41",
      },
      {
        label: "Verification open",
        detail: "Admin team is validating remaining initials and annex pages.",
        time: "16:10",
      },
    ],
  },
  {
    id: "doc-oss-license-pack",
    title: "OSS-RBA License Compliance Pack",
    category: "Regulatory",
    type: "Regulatory Filing",
    owner: "Compliance Office",
    uploadedAt: "28 Mar 2026 · 09:05",
    updatedAt: "29 Mar 2026 · 11:22",
    size: "5.2 MB",
    pages: 34,
    jurisdiction: "Indonesia",
    healthScore: 54,
    status: "High Risk",
    statusVariant: "danger",
    summary:
      "The filing pack contains outdated supporting attachments and inconsistent business classification references that should be corrected before regulator submission.",
    insights: [
      "Two attachment dates are stale relative to the intended filing period.",
      "KBLI reference is inconsistent between cover sheet and supporting declaration.",
      "Escalate for manual counsel review before external submission.",
    ],
    clausesToReview: [
      "Update supporting tax registration attachment to the latest issued copy.",
      "Harmonise KBLI classification across cover sheet, declaration, and annex.",
      "Reconfirm responsible officer title in the statement letter.",
    ],
    relatedRegulations: [
      "PP No. 5 Tahun 2021 tentang Perizinan Berusaha Berbasis Risiko",
      "Peraturan BKPM terkait OSS-RBA terbaru",
    ],
    timeline: [
      {
        label: "Uploaded",
        detail: "Compliance Office uploaded the regulator filing pack.",
        time: "09:05",
      },
      {
        label: "AI analysis completed",
        detail: "Metadata consistency and filing readiness scan completed.",
        time: "09:19",
      },
      {
        label: "Escalated",
        detail: "Critical attachment mismatch routed to counsel queue.",
        time: "11:22",
      },
    ],
  },
];

export const recentActivity = [
  {
    title: "AI completed clause extraction for 12 new uploads",
    detail: "Portfolio refreshed automatically after the morning ingestion run.",
    time: "10 minutes ago",
    icon: CheckCircle2,
  },
  {
    title: "Counsel requested redline review on vendor DPA",
    detail: "Cross-border transfer clauses were flagged for manual approval.",
    time: "45 minutes ago",
    icon: Clock3,
  },
  {
    title: "Regulatory filing pack escalated",
    detail: "OSS-RBA pack moved into high-priority remediation queue.",
    time: "Yesterday",
    icon: AlertTriangle,
  },
];

export function getDocumentById(id: string) {
  return documents.find((document) => document.id === id) ?? documents[0];
}
