import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Lightbulb, CheckCircle, Loader, Info, ArrowRight } from 'lucide-react';
import { useResearch } from '../context/ResearchContext';
import KnowledgeGraph from '../components/KnowledgeGraph';

const HypothesisPage: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>();
  const { papers, hypotheses, generateHypothesis, isLoading } = useResearch();
  const [paper, setPaper] = useState(papers.find(p => p.id === paperId) || null);
  const [paperHypotheses, setPaperHypotheses] = useState(
    hypotheses.filter(h => h.paperId === paperId)
  );
  const [selectedHypothesis, setSelectedHypothesis] = useState(
    paperHypotheses.length > 0 ? paperHypotheses[0] : null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  
  const graphRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setPaper(papers.find(p => p.id === paperId) || null);
  }, [papers, paperId]);
  
  useEffect(() => {
    const filteredHypotheses = hypotheses.filter(h => h.paperId === paperId);
    setPaperHypotheses(filteredHypotheses);
    if (filteredHypotheses.length > 0 && !selectedHypothesis) {
      setSelectedHypothesis(filteredHypotheses[0]);
    }
  }, [hypotheses, paperId, selectedHypothesis]);

  const handleGenerateHypothesis = async () => {
    if (paperId) {
      setIsGenerating(true);
      await generateHypothesis(paperId);
      setIsGenerating(false);
    }
  };

  const handleHypothesisSelect = (hypothesisId: string) => {
    const hypothesis = paperHypotheses.find(h => h.id === hypothesisId);
    if (hypothesis) {
      setSelectedHypothesis(hypothesis);
      // Scroll to graph
      if (graphRef.current) {
        graphRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-success-500';
    if (confidence >= 0.6) return 'text-accent-500';
    return 'text-warning-500';
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-primary-800 mb-4">
          Research Hypotheses
        </h1>
        <p className="text-gray-600 mb-2">Based on paper:</p>
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <h2 className="text-xl font-heading font-semibold text-primary-700 mb-1">{paper.title}</h2>
          <p className="text-sm text-gray-600">
            {paper.authors.join(', ')} • {paper.year} {paper.journal ? `• ${paper.journal}` : ''}
          </p>
        </div>
      </div>

      {paperHypotheses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 text-center">
          <h2 className="text-2xl font-heading font-bold text-primary-700 mb-4">Generate Research Hypotheses</h2>
          <p className="text-gray-600 mb-6">
            Our AI can analyze this paper and generate novel research hypotheses with supporting evidence.
          </p>
          <button
            onClick={handleGenerateHypothesis}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader className="animate-spin h-5 w-5 mr-2" />
                Generating Hypotheses...
              </>
            ) : (
              <>Generate Hypotheses</>
            )}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-heading font-bold text-primary-700 mb-4">
                Research Hypotheses
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Select a hypothesis to view details and supporting evidence:
              </p>
              <div className="space-y-3">
                {paperHypotheses.map((hypothesis) => (
                  <button
                    key={hypothesis.id}
                    onClick={() => handleHypothesisSelect(hypothesis.id)}
                    className={`w-full text-left p-3 rounded-md transition-colors duration-200 border ${
                      selectedHypothesis?.id === hypothesis.id
                        ? 'bg-primary-50 border-primary-300'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start">
                      <Lightbulb className={`h-5 w-5 mr-2 mt-0.5 ${
                        selectedHypothesis?.id === hypothesis.id
                          ? 'text-primary-600'
                          : 'text-gray-400'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-800">{hypothesis.statement}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs font-medium">Confidence:</span>
                          <div className="ml-2 bg-gray-200 rounded-full h-1.5 w-20">
                            <div
                              className={`h-1.5 rounded-full ${
                                hypothesis.confidence >= 0.8
                                  ? 'bg-success-500'
                                  : hypothesis.confidence >= 0.6
                                  ? 'bg-accent-500'
                                  : 'bg-warning-500'
                              }`}
                              style={{ width: `${hypothesis.confidence * 100}%` }}
                            ></div>
                          </div>
                          <span className={`ml-1 text-xs ${getConfidenceColor(hypothesis.confidence)}`}>
                            {Math.round(hypothesis.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-primary-50 rounded-lg border border-primary-100 p-4">
              <div className="flex">
                <Info className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-primary-700 mb-1">What are research hypotheses?</h3>
                  <p className="text-sm text-primary-600">
                    These are potential research directions and hypotheses generated by our AI based on the paper's findings. They can serve as starting points for new research projects.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            {selectedHypothesis && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-heading font-bold text-primary-700 mb-3">
                    Hypothesis Details
                  </h2>
                  <div className="p-4 bg-primary-50 rounded-md border border-primary-100 mb-4">
                    <p className="text-lg text-primary-800 italic">"{selectedHypothesis.statement}"</p>
                    <div className="flex items-center mt-3">
                      <span className="text-sm font-medium text-gray-600">Confidence:</span>
                      <div className="ml-2 bg-gray-200 rounded-full h-2 w-32">
                        <div
                          className={`h-2 rounded-full ${
                            selectedHypothesis.confidence >= 0.8
                              ? 'bg-success-500'
                              : selectedHypothesis.confidence >= 0.6
                              ? 'bg-accent-500'
                              : 'bg-warning-500'
                          }`}
                          style={{ width: `${selectedHypothesis.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className={`ml-2 font-medium ${getConfidenceColor(selectedHypothesis.confidence)}`}>
                        {Math.round(selectedHypothesis.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-heading font-bold text-primary-600 mb-3">
                    Supporting Evidence
                  </h3>
                  <div className="space-y-4">
                    {selectedHypothesis.supportingEvidence.map((evidence, index) => (
                      <div key={evidence.id} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary-100 flex items-center justify-center mr-2 mt-0.5">
                            <span className="text-xs font-bold text-primary-700">{index + 1}</span>
                          </div>
                          <div>
                            <p className="text-gray-800 mb-1">{evidence.text}</p>
                            <div className="flex flex-wrap items-center text-xs text-gray-500">
                              <span className="font-medium mr-1">Source:</span>
                              <span>{evidence.source}</span>
                              <span className="mx-2">•</span>
                              <span className="font-medium mr-1">Confidence:</span>
                              <span className={getConfidenceColor(evidence.confidence)}>
                                {Math.round(evidence.confidence * 100)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div ref={graphRef} className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-heading font-bold text-primary-700 mb-4">
                    Knowledge Graph
                  </h2>
                  <div className="aspect-video bg-gray-50 rounded-md border border-gray-200 p-2">
                    <KnowledgeGraph hypothesisId={selectedHypothesis.id} />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-heading font-bold text-primary-700 mb-4">
                    Next Steps
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                      to={`/verify/${selectedHypothesis.id}`}
                      className="flex items-center p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-200"
                    >
                      <CheckCircle className="h-8 w-8 text-secondary-500 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-800 mb-1">Verify Claims</h3>
                        <p className="text-sm text-gray-600">
                          Verify specific claims with evidence from scientific literature.
                        </p>
                      </div>
                      <ArrowRight className="ml-auto h-5 w-5 text-gray-400" />
                    </Link>
                    
                    <Link
                      to={`/funding/${paper.id}`}
                      className="flex items-center p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Lightbulb className="h-8 w-8 text-accent-500 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-800 mb-1">Find Funding</h3>
                        <p className="text-sm text-gray-600">
                          Discover funding opportunities for this research direction.
                        </p>
                      </div>
                      <ArrowRight className="ml-auto h-5 w-5 text-gray-400" />
                    </Link>
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

export default HypothesisPage;