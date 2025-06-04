import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockPapers, mockHypotheses, mockClaims, mockFundingOpportunities } from '../data/mockData';
import { Paper, Hypothesis, Claim, FundingOpportunity } from '../types';

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
}

const ResearchContext = createContext<ResearchContextType | undefined>(undefined);

export const ResearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [papers, setPapers] = useState<Paper[]>(mockPapers);
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>(mockHypotheses);
  const [claims, setClaims] = useState<Claim[]>(mockClaims);
  const [fundingOpportunities, setFundingOpportunities] = useState<FundingOpportunity[]>(
    mockFundingOpportunities
  );
  const [currentPaper, setCurrentPaper] = useState<Paper | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    // In a real app, this would fetch from an API
    setCurrentPaper(mockPapers[0]);
  }, []);

  // Simulate API calls
  const uploadPaper = async (paper: Paper): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setPapers([...papers, paper]);
      setCurrentPaper(paper);
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
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const paper = papers.find((p) => p.id === paperId);
      if (paper && !paper.summary) {
        const updatedPapers = papers.map((p) =>
          p.id === paperId
            ? {
                ...p,
                summary: 'This is an AI-generated summary of the research paper...',
                keyFindings: [
                  'First key finding from the paper',
                  'Second important discovery',
                  'Third significant result',
                ],
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
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2500));
      // In a real app, this would make an API call
      // For now, we'll just use mock data
    } catch (err) {
      setError('Failed to generate hypothesis');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyClaim = async (claimId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // In a real app, this would make an API call
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
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1800));
      // In a real app, this would make an API call
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
    verifyClaim,
    findFunding,
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