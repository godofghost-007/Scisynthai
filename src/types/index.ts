export interface Paper {
  id: string;
  title: string;
  authors: string[];
  journal?: string;
  year: number;
  doi?: string;
  abstract?: string;
  fullText?: string;
  summary?: string;
  keyFindings?: string[];
  uploaded: Date;
}

export interface Hypothesis {
  id: string;
  paperId: string;
  statement: string;
  confidence: number;
  supportingEvidence: Evidence[];
  knowledgeGraphData?: KnowledgeGraphData;
  generated: Date;
}

export interface Evidence {
  id: string;
  text: string;
  source: string;
  confidence: number;
}

export interface Claim {
  id: string;
  hypothesisId: string;
  statement: string;
  verificationStatus: 'verified' | 'partially verified' | 'unverified' | 'disputed';
  supportingEvidence: Evidence[];
  confidence: number;
}

export interface FundingOpportunity {
  id: string;
  title: string;
  organization: string;
  amount: string;
  deadline: Date;
  description: string;
  eligibility: string;
  url: string;
  matchScore: number;
  keywords: string[];
}

export interface KnowledgeGraphData {
  nodes: Node[];
  links: Link[];
}

export interface Node {
  id: string;
  name: string;
  type: 'concept' | 'paper' | 'author' | 'hypothesis' | 'evidence';
  value: number;
}

export interface Link {
  source: string;
  target: string;
  value: number;
  label?: string;
}