import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Lightbulb, CheckCircle, DollarSign, ArrowRight } from 'lucide-react';
import { useResearch } from '../context/ResearchContext';

const HomePage: React.FC = () => {
  const { papers } = useResearch();
  
  return (
    <div className="bg-gradient-to-b from-primary-700 to-primary-800 text-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight mb-6">
            Accelerate Scientific Discovery with AI
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto mb-10">
            Analyze research papers, generate hypotheses, verify claims, and discover funding opportunities with our advanced AI research assistant.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/upload"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-primary-700 transition-colors duration-200"
            >
              Upload Paper
            </Link>
            <Link
              to="/summary/demo"
              className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-primary-700 transition-colors duration-200"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white text-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-700">
              Powerful Features for Researchers
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform uses advanced AI to help you gain deeper insights from scientific literature and accelerate your research.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-primary-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary-700" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-2 text-primary-700">Paper Analysis</h3>
              <p className="text-gray-600 mb-4">
                Upload research papers and get AI-generated summaries highlighting key findings.
              </p>
              <Link
                to="/upload"
                className="text-primary-600 hover:text-primary-700 inline-flex items-center font-medium"
              >
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-primary-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-primary-700" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-2 text-primary-700">Hypothesis Generation</h3>
              <p className="text-gray-600 mb-4">
                Generate novel research hypotheses with supporting evidence from scientific literature.
              </p>
              <Link
                to="/hypothesis/demo"
                className="text-primary-600 hover:text-primary-700 inline-flex items-center font-medium"
              >
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-primary-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary-700" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-2 text-primary-700">Claim Verification</h3>
              <p className="text-gray-600 mb-4">
                Verify scientific claims with evidence and citations from trusted research sources.
              </p>
              <Link
                to="/verify/demo"
                className="text-primary-600 hover:text-primary-700 inline-flex items-center font-medium"
              >
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-primary-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-primary-700" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-2 text-primary-700">Funding Matches</h3>
              <p className="text-gray-600 mb-4">
                Discover relevant funding opportunities matched to your research interests.
              </p>
              <Link
                to="/funding/demo"
                className="text-primary-600 hover:text-primary-700 inline-flex items-center font-medium"
              >
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Papers Section */}
      {papers.length > 0 && (
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold text-primary-700">Recent Papers</h2>
              <p className="mt-4 text-xl text-gray-600">
                Recently analyzed research papers in our system.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {papers.slice(0, 3).map((paper) => (
                <div key={paper.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <div className="p-6">
                    <h3 className="text-lg font-heading font-bold text-primary-700 mb-2 line-clamp-2">
                      {paper.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {paper.authors.join(', ')} • {paper.year}
                    </p>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {paper.abstract}
                    </p>
                    <Link
                      to={`/summary/${paper.id}`}
                      className="text-primary-600 hover:text-primary-700 inline-flex items-center font-medium"
                    >
                      View summary <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;