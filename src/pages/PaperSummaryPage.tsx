import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Users, Calendar, Lightbulb, CheckCircle, DollarSign, Loader, ArrowRight } from 'lucide-react';
import { useResearch } from '../context/ResearchContext';

const PaperSummaryPage: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>();
  const { papers, generateSummary, isLoading } = useResearch();
  const [paper, setPaper] = useState(papers.find(p => p.id === paperId) || null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  
  useEffect(() => {
    setPaper(papers.find(p => p.id === paperId) || null);
  }, [papers, paperId]);

  const handleGenerateSummary = async () => {
    if (paperId) {
      setIsGeneratingSummary(true);
      await generateSummary(paperId);
      setIsGeneratingSummary(false);
    }
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary-800 mb-4">{paper.title}</h1>
        <div className="flex flex-wrap items-center text-sm text-gray-600 space-x-4 mb-4">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{paper.authors.join(', ')}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{paper.year}</span>
          </div>
          {paper.journal && (
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              <span>{paper.journal}</span>
            </div>
          )}
        </div>
        {paper.doi && (
          <div className="text-sm text-gray-600 mb-4">
            <span className="font-medium">DOI:</span> {paper.doi}
          </div>
        )}
        {paper.abstract && (
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
            <h2 className="text-lg font-heading font-bold text-primary-700 mb-2">Abstract</h2>
            <p className="text-gray-700">{paper.abstract}</p>
          </div>
        )}
      </div>

      {!paper.summary ? (
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 text-center">
          <h2 className="text-2xl font-heading font-bold text-primary-700 mb-4">Generate AI Summary</h2>
          <p className="text-gray-600 mb-6">
            Let our AI analyze this paper and generate a comprehensive summary highlighting key findings.
          </p>
          <button
            onClick={handleGenerateSummary}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            disabled={isGeneratingSummary}
          >
            {isGeneratingSummary ? (
              <>
                <Loader className="animate-spin h-5 w-5 mr-2" />
                Generating Summary...
              </>
            ) : (
              <>Generate Summary</>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-heading font-bold text-primary-700 mb-4">AI-Generated Summary</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">{paper.summary}</p>
            
            {paper.keyFindings && paper.keyFindings.length > 0 && (
              <div>
                <h3 className="text-xl font-heading font-bold text-primary-600 mb-3">Key Findings</h3>
                <ul className="space-y-2">
                  {paper.keyFindings.map((finding, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary-100 flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-xs font-bold text-primary-700">{index + 1}</span>
                      </div>
                      <span className="text-gray-700">{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to={`/hypothesis/${paper.id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 flex flex-col items-center text-center"
            >
              <Lightbulb className="h-10 w-10 text-accent-500 mb-3" />
              <h3 className="text-lg font-heading font-bold text-primary-700 mb-2">Generate Hypotheses</h3>
              <p className="text-sm text-gray-600 mb-3">
                Generate novel research hypotheses based on this paper.
              </p>
              <span className="text-primary-600 flex items-center text-sm font-medium">
                Continue <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
            
            <Link
              to={`/verify/demo`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 flex flex-col items-center text-center"
            >
              <CheckCircle className="h-10 w-10 text-secondary-500 mb-3" />
              <h3 className="text-lg font-heading font-bold text-primary-700 mb-2">Verify Claims</h3>
              <p className="text-sm text-gray-600 mb-3">
                Verify scientific claims with evidence from literature.
              </p>
              <span className="text-primary-600 flex items-center text-sm font-medium">
                Continue <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
            
            <Link
              to={`/funding/${paper.id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 flex flex-col items-center text-center"
            >
              <DollarSign className="h-10 w-10 text-success-500 mb-3" />
              <h3 className="text-lg font-heading font-bold text-primary-700 mb-2">Find Funding</h3>
              <p className="text-sm text-gray-600 mb-3">
                Discover funding opportunities related to this research.
              </p>
              <span className="text-primary-600 flex items-center text-sm font-medium">
                Continue <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaperSummaryPage;