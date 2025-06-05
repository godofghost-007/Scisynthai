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
  claims?: Claim[];
  mindMap?: MindMapData;
  knowledgeGraph?: KnowledgeGraphData;
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
  references?: Reference[];
}

export interface Reference {
  id: string;
  title: string;
  authors: string[];
  year: number;
  journal?: string;
  doi?: string;
  relevanceScore: number;
  supports: boolean;
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

export interface MindMapData {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
}

export interface MindMapNode {
  id: string;
  text: string;
  type?: string;
}

export interface MindMapEdge {
  from: string;
  to: string;
  label?: string;
}

export interface SearchFilters {
  domain?: string[];
  startDate?: Date;
  endDate?: Date;
  authors?: string[];
  keywords?: string[];
  journals?: string[];
}

export interface APIResponse<T> {
  data: T;
  error?: string;
  metadata?: {
    total: number;
    page: number;
    pageSize: number;
  };
}