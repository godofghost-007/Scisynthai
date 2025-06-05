import React, { createContext, useContext, useState, useEffect } from 'react';
import { Paper, Hypothesis, Claim, FundingOpportunity, SearchFilters } from '../types';
import { generatePaperSummary, generateHypotheses, verifyClaim } from '../services/openai';
import { library } from '../services/library';

interface ResearchContextType {
  papers: Paper[];
  hypotheses: Hypothesis[];
  claims: Claim[];
  fundingOpportunities: FundingOpportunity[];
  currentPaper: Paper | null;
  isLoading: boolean;
  error: string | null;
  setPapers: (papers: Paper[]) => void;
  setHypotheses: (hypotheses: Hypothesis[]) => void;
  setClaims: (claims: Claim[]) => void;
  setFundingOpportunities: (opportunities: FundingOpportunity[]) => void;
  setCurrentPaper: (paper: Paper | null) => void;
  uploadPaper: (paper: Paper) => Promise<void>;
  generateSummary: (paperId: string) => Promise<void>;
  generateHypothesis: (paperId: string) => Promise<void>;
  verifyClaim: (claimId: string) => Promise<void>;
  findFunding: (paperId: string) => Promise<void>;
  searchPapers: (query: string, filters?: SearchFilters) => Promise<void>;
  addPaperByDOI: (doi: string) => Promise<void>;
}

const ResearchContext = createContext<ResearchContextType | undefined>(undefined);

export const ResearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [fundingOpportunities, setFundingOpportunities] = useState<FundingOpportunity[]>([]);
  const [currentPaper, setCurrentPaper] = useState<Paper | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchPapers = async (query: string, filters?: SearchFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await library.searchPapers(query, filters);
      setPapers(results);
    } catch (err) {
      setError('Failed to search papers');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const addPaperByDOI = async (doi: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const paper = await library.addPaper(doi);
      if (paper) {
        setPapers([...papers, paper]);
        setCurrentPaper(paper);
      } else {
        setError('Paper not found');
      }
    } catch (err) {
      setError('Failed to add paper');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadPaper = async (paper: Paper): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const addedPaper = await library.addPaper(paper);
      if (addedPaper) {
        setPapers([...papers, addedPaper]);
        setCurrentPaper(addedPaper);
      }
    } catch (err) {
      setError('Failed to upload paper');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSummary = async (paperId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const paper = papers.find((p) => p.id === paperId);
      if (paper) {
        const { summary, keyFindings } = await generatePaperSummary(paper);
        const updatedPapers = papers.map((p) =>
          p.id === paperId
            ? {
                ...p,
                summary,
                keyFindings,
              }
            : p
        );
        setPapers(updatedPapers);
        setCurrentPaper(updatedPapers.find((p) => p.id === paperId) || null);
      }
    } catch (err) {
      setError('Failed to generate summary');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateHypothesis = async (paperId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const paper = papers.find((p) => p.id === paperId);
      if (paper) {
        const newHypotheses = await generateHypotheses(paper);
        setHypotheses([...hypotheses, ...newHypotheses]);
      }
    } catch (err) {
      setError('Failed to generate hypothesis');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyClaimById = async (claimId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const claim = claims.find((c) => c.id === claimId);
      if (claim) {
        const result = await verifyClaim(claim);
        const updatedClaims = claims.map((c) =>
          c.id === claimId
            ? {
                ...c,
                verificationStatus: result.verificationStatus,
                confidence: result.confidence,
                supportingEvidence: result.evidence,
              }
            : c
        );
        setClaims(updatedClaims);
      }
    } catch (err) {
      setError('Failed to verify claim');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const findFunding = async (paperId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1800));
    } catch (err) {
      setError('Failed to find funding opportunities');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    papers,
    hypotheses,
    claims,
    fundingOpportunities,
    currentPaper,
    isLoading,
    error,
    setPapers,
    setHypotheses,
    setClaims,
    setFundingOpportunities,
    setCurrentPaper,
    uploadPaper,
    generateSummary,
    generateHypothesis,
    verifyClaim: verifyClaimById,
    findFunding,
    searchPapers,
    addPaperByDOI,
  };

  return <ResearchContext.Provider value={value}>{children}</ResearchContext.Provider>;
};

export const useResearch = (): ResearchContextType => {
  const context = useContext(ResearchContext);
  if (context === undefined) {
    throw new Error('useResearch must be used within a ResearchProvider');
  }
  return context;
};