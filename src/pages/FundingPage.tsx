import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DollarSign, Calendar, Bookmark, ExternalLink, Search, Loader, ArrowLeft, Filter } from 'lucide-react';
import { useResearch } from '../context/ResearchContext';
import { FundingOpportunity } from '../types';

const FundingPage: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>();
  const { papers, fundingOpportunities, findFunding, isLoading } = useResearch();
  const [paper, setPaper] = useState(papers.find(p => p.id === paperId) || null);
  const [opportunities, setOpportunities] = useState<FundingOpportunity[]>(fundingOpportunities);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOpportunity, setSelectedOpportunity] = useState<FundingOpportunity | null>(null);
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxMatchScore, setMaxMatchScore] = useState<number>(100);
  const [isSearching, setIsSearching] = useState(false);
  
  useEffect(() => {
    setPaper(papers.find(p => p.id === paperId) || null);
  }, [papers, paperId]);
  
  useEffect(() => {
    setOpportunities(fundingOpportunities);
    if (fundingOpportunities.length > 0 && !selectedOpportunity) {
      setSelectedOpportunity(fundingOpportunities[0]);
    }
  }, [fundingOpportunities, selectedOpportunity]);

  const handleFindFunding = async () => {
    if (paperId) {
      setIsSearching(true);
      await findFunding(paperId);
      setIsSearching(false);
    }
  };

  const handleOpportunitySelect = (opportunityId: string) => {
    const opportunity = opportunities.find(o => o.id === opportunityId);
    if (opportunity) {
      setSelectedOpportunity(opportunity);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const filteredOpportunities = opportunities
    .filter(opportunity => 
      opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(opportunity => {
      if (!minAmount) return true;
      const numericAmount = parseFloat(opportunity.amount.replace(/[^0-9.]/g, ''));
      return !isNaN(numericAmount) && numericAmount >= parseFloat(minAmount);
    })
    .filter(opportunity => opportunity.matchScore <= maxMatchScore);

  const renderMatchScore = (score: number) => {
    let bgColor;
    if (score >= 90) bgColor = 'bg-success-500';
    else if (score >= 75) bgColor = 'bg-accent-500';
    else if (score >= 60) bgColor = 'bg-warning-500';
    else bgColor = 'bg-gray-400';
    
    return (
      <div className="flex items-center">
        <div className="relative w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 mr-3">
          <div className={`absolute inset-0 rounded-full ${bgColor} opacity-20`}></div>
          <span className="text-lg font-bold">{score}</span>
        </div>
        <div>
          <div className="text-xs text-gray-500">Match Score</div>
          <div className="text-sm font-medium">
            {score >= 90 ? 'Excellent' : score >= 75 ? 'Good' : score >= 60 ? 'Fair' : 'Low'}
          </div>
        </div>
      </div>
    );
  };

  const getDaysRemaining = (deadline: Date) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (!paper) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-heading font-bold text-primary-700 mb-4">Paper Not Found</h1>
          <p className="text-gray-600 mb-6">The paper you're looking for could not be found.</p>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link
          to={`/summary/${paper.id}`}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Paper
        </Link>
        <h1 className="text-3xl font-heading font-bold text-primary-800 mb-4">
          Funding Opportunities
        </h1>
        <p className="text-gray-600 mb-2">Based on research paper:</p>
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <h2 className="text-xl font-heading font-semibold text-primary-700 mb-1">{paper.title}</h2>
          <p className="text-sm text-gray-600">
            {paper.authors.join(', ')} • {paper.year} {paper.journal ? `• ${paper.journal}` : ''}
          </p>
        </div>
      </div>

      {opportunities.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 text-center">
          <h2 className="text-2xl font-heading font-bold text-primary-700 mb-4">Find Funding Opportunities</h2>
          <p className="text-gray-600 mb-6">
            Our AI can find relevant funding opportunities matched to your research interests.
          </p>
          <button
            onClick={handleFindFunding}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <Loader className="animate-spin h-5 w-5 mr-2" />
                Searching Opportunities...
              </>
            ) : (
              <>Find Funding</>
            )}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-heading font-bold text-primary-700 mb-4">
                Filter Opportunities
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Search by title, organization..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Funding Amount</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Min amount"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Match Score: {maxMatchScore}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={maxMatchScore}
                    onChange={(e) => setMaxMatchScore(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Found {filteredOpportunities.length} opportunities</p>
                {filteredOpportunities.length === 0 && (
                  <p className="text-sm text-gray-500 italic">Try adjusting your filters</p>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-primary-50 border-b border-primary-100">
                <h2 className="font-heading font-bold text-primary-700">Available Opportunities</h2>
              </div>
              
              <div className="divide-y divide-gray-200 max-h-[calc(100vh-500px)] overflow-y-auto">
                {filteredOpportunities.map((opportunity) => (
                  <button
                    key={opportunity.id}
                    onClick={() => handleOpportunitySelect(opportunity.id)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors duration-200 ${
                      selectedOpportunity?.id === opportunity.id ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium text-gray-800">{opportunity.title}</h3>
                      <span className={`text-xs rounded-full px-2 py-0.5 ${
                        opportunity.matchScore >= 90 ? 'bg-success-100 text-success-500' :
                        opportunity.matchScore >= 75 ? 'bg-accent-100 text-accent-500' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {opportunity.matchScore}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{opportunity.organization}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Deadline: {formatDate(opportunity.deadline)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            {selectedOpportunity && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-primary-600 text-white p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-heading font-bold mb-2">
                        {selectedOpportunity.title}
                      </h2>
                      <p className="text-primary-100">
                        {selectedOpportunity.organization}
                      </p>
                    </div>
                    <div className="bg-white text-primary-600 rounded-lg p-2 text-center min-w-24">
                      <span className="block text-sm font-medium">Deadline</span>
                      <span className="block font-bold">{formatDate(selectedOpportunity.deadline)}</span>
                      <span className="text-xs mt-1 block">
                        {getDaysRemaining(selectedOpportunity.deadline) > 0 
                          ? `${getDaysRemaining(selectedOpportunity.deadline)} days left` 
                          : 'Deadline passed'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex-1 min-w-[200px] p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Funding Amount</h3>
                      <p className="text-xl font-bold text-primary-700">{selectedOpportunity.amount}</p>
                    </div>
                    
                    <div className="flex-1 min-w-[200px] p-4 bg-gray-50 rounded-lg border border-gray-200">
                      {renderMatchScore(selectedOpportunity.matchScore)}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-heading font-bold text-primary-700 mb-3">Description</h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {selectedOpportunity.description}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-heading font-bold text-primary-700 mb-3">Eligibility</h3>
                    <p className="text-gray-700 mb-4">
                      {selectedOpportunity.eligibility}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-heading font-bold text-primary-700 mb-3">Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedOpportunity.keywords.map((keyword, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6 flex justify-between items-center">
                    <button className="inline-flex items-center text-primary-600 hover:text-primary-700">
                      <Bookmark className="h-5 w-5 mr-1" />
                      Save for later
                    </button>
                    
                    <a
                      href={selectedOpportunity.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                    >
                      View Application <ExternalLink className="ml-1 h-4 w-4" />
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

export default FundingPage;