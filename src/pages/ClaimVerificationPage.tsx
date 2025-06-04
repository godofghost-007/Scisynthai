import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle, Search, Loader, ArrowLeft, ExternalLink } from 'lucide-react';
import { useResearch } from '../context/ResearchContext';
import { Claim } from '../types';

const ClaimVerificationPage: React.FC = () => {
  const { hypothesisId } = useParams<{ hypothesisId: string }>();
  const { claims, hypotheses, verifyClaim, isLoading } = useResearch();
  const [hypothesis, setHypothesis] = useState(hypotheses.find(h => h.id === hypothesisId) || null);
  const [hypothesisClaims, setHypothesisClaims] = useState(
    claims.filter(c => c.hypothesisId === hypothesisId)
  );
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    setHypothesis(hypotheses.find(h => h.id === hypothesisId) || null);
  }, [hypotheses, hypothesisId]);
  
  useEffect(() => {
    const filteredClaims = claims.filter(c => c.hypothesisId === hypothesisId);
    setHypothesisClaims(filteredClaims);
    if (filteredClaims.length > 0 && !selectedClaim) {
      setSelectedClaim(filteredClaims[0]);
    }
  }, [claims, hypothesisId, selectedClaim]);

  const handleVerifyClaim = async (claimId: string) => {
    setIsVerifying(true);
    await verifyClaim(claimId);
    setIsVerifying(false);
  };

  const handleClaimSelect = (claimId: string) => {
    const claim = hypothesisClaims.find(c => c.id === claimId);
    if (claim) {
      setSelectedClaim(claim);
    }
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-success-500" />;
      case 'partially verified':
        return <AlertCircle className="h-5 w-5 text-accent-500" />;
      case 'disputed':
        return <XCircle className="h-5 w-5 text-error-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-success-500';
      case 'partially verified':
        return 'bg-accent-500';
      case 'disputed':
        return 'bg-error-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getVerificationText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'partially verified':
        return 'Partially Verified';
      case 'disputed':
        return 'Disputed';
      default:
        return 'Unverified';
    }
  };

  const filteredClaims = searchTerm 
    ? hypothesisClaims.filter(claim => 
        claim.statement.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : hypothesisClaims;

  if (!hypothesis) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-heading font-bold text-primary-700 mb-4">Hypothesis Not Found</h1>
          <p className="text-gray-600 mb-6">The hypothesis you're looking for could not be found.</p>
          <Link
            to="/upload"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Upload a Paper
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link
          to={`/hypothesis/${hypothesis.paperId}`}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Hypotheses
        </Link>
        <h1 className="text-3xl font-heading font-bold text-primary-800 mb-4">
          Claim Verification
        </h1>
        <div className="bg-primary-50 p-4 rounded-md border border-primary-100">
          <h2 className="text-xl font-heading font-semibold text-primary-700 mb-2">Hypothesis:</h2>
          <p className="text-primary-800 italic">"{hypothesis.statement}"</p>
        </div>
      </div>

      {hypothesisClaims.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 text-center">
          <h2 className="text-2xl font-heading font-bold text-primary-700 mb-4">Verify Claims</h2>
          <p className="text-gray-600 mb-6">
            Our AI can analyze specific claims from this hypothesis and verify them against scientific literature.
          </p>
          <button
            onClick={() => handleVerifyClaim(hypothesis.id)}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            disabled={isVerifying}
          >
            {isVerifying ? (
              <>
                <Loader className="animate-spin h-5 w-5 mr-2" />
                Verifying Claims...
              </>
            ) : (
              <>Verify Claims</>
            )}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-heading font-bold text-primary-700 mb-4">
                Claims to Verify
              </h2>
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Search claims..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
                {filteredClaims.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No claims match your search.</p>
                ) : (
                  filteredClaims.map((claim) => (
                    <button
                      key={claim.id}
                      onClick={() => handleClaimSelect(claim.id)}
                      className={`w-full text-left p-3 rounded-md transition-colors duration-200 border ${
                        selectedClaim?.id === claim.id
                          ? 'bg-primary-50 border-primary-300'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5 mr-2">
                          {getVerificationIcon(claim.verificationStatus)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{claim.statement}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs font-medium">Confidence:</span>
                            <div className="ml-2 bg-gray-200 rounded-full h-1.5 w-20">
                              <div
                                className={`h-1.5 rounded-full ${getVerificationColor(claim.verificationStatus)}`}
                                style={{ width: `${claim.confidence * 100}%` }}
                              ></div>
                            </div>
                            <span className="ml-1 text-xs">{Math.round(claim.confidence * 100)}%</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            {selectedClaim && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-heading font-bold text-primary-700">
                    Verification Results
                  </h2>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">Status:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getVerificationColor(selectedClaim.verificationStatus)}`}>
                      {getVerificationText(selectedClaim.verificationStatus)}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200 mb-6">
                  <h3 className="text-lg font-heading font-bold text-gray-800 mb-2">Claim</h3>
                  <p className="text-gray-700 italic">"{selectedClaim.statement}"</p>
                </div>
                
                <h3 className="text-lg font-heading font-bold text-primary-700 mb-3">
                  Supporting Evidence
                </h3>
                <div className="space-y-4 mb-6">
                  {selectedClaim.supportingEvidence.map((evidence, index) => (
                    <div key={evidence.id} className="p-4 bg-white rounded-md border border-gray-200 shadow-sm">
                      <div className="flex">
                        <div className="flex-shrink-0 mt-0.5 mr-3">
                          {evidence.confidence > 0.8 ? (
                            <CheckCircle className="h-5 w-5 text-success-500" />
                          ) : evidence.confidence > 0.6 ? (
                            <CheckCircle className="h-5 w-5 text-accent-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-warning-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-gray-800 mb-2">{evidence.text}</p>
                          <div className="flex flex-wrap items-center text-sm text-gray-600">
                            <span className="font-medium mr-1">Source:</span>
                            <span className="mr-2">{evidence.source}</span>
                            <div className="flex items-center ml-auto">
                              <span className="font-medium mr-1">Relevance:</span>
                              <div className="ml-1 bg-gray-200 rounded-full h-1.5 w-16">
                                <div
                                  className={`h-1.5 rounded-full ${
                                    evidence.confidence > 0.8
                                      ? 'bg-success-500'
                                      : evidence.confidence > 0.6
                                      ? 'bg-accent-500'
                                      : 'bg-warning-500'
                                  }`}
                                  style={{ width: `${evidence.confidence * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-heading font-bold text-primary-700 mb-3">
                    Summary
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {selectedClaim.verificationStatus === 'verified' && (
                      "This claim is strongly supported by multiple high-quality sources from the scientific literature. The evidence consistently validates the statement with high confidence."
                    )}
                    {selectedClaim.verificationStatus === 'partially verified' && (
                      "This claim has some supporting evidence, but may lack comprehensive validation or have some conflicting information. Additional research may be needed for full verification."
                    )}
                    {selectedClaim.verificationStatus === 'disputed' && (
                      "This claim has significant contradicting evidence in the scientific literature or lacks sufficient supporting evidence for verification."
                    )}
                    {selectedClaim.verificationStatus === 'unverified' && (
                      "This claim currently lacks sufficient evidence for verification in the scientific literature. Further research is needed."
                    )}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">Overall Confidence:</span>
                      <div className="bg-gray-200 rounded-full h-2 w-32">
                        <div
                          className={`h-2 rounded-full ${getVerificationColor(selectedClaim.verificationStatus)}`}
                          style={{ width: `${selectedClaim.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 font-medium">{Math.round(selectedClaim.confidence * 100)}%</span>
                    </div>
                    
                    <a
                      href="#"
                      className="inline-flex items-center text-primary-600 hover:text-primary-700"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View full analysis <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimVerificationPage;