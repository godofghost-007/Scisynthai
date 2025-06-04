import React from 'react';
import { Github, Mail, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-800 text-primary-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-heading font-bold text-lg mb-4">ResearchAI</h3>
            <p className="text-sm">
              Empowering researchers with AI to accelerate scientific discovery and innovation.
            </p>
          </div>
          <div>
            <h3 className="text-white font-heading font-bold text-lg mb-4">Features</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/upload" className="hover:text-white transition-colors">
                  Paper Analysis
                </a>
              </li>
              <li>
                <a href="/hypothesis/demo" className="hover:text-white transition-colors">
                  Hypothesis Generation
                </a>
              </li>
              <li>
                <a href="/verify/demo" className="hover:text-white transition-colors">
                  Claim Verification
                </a>
              </li>
              <li>
                <a href="/funding/demo" className="hover:text-white transition-colors">
                  Funding Opportunities
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-heading font-bold text-lg mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="#"
                className="text-primary-100 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="mailto:info@researchai.example.com"
                className="text-primary-100 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-primary-700 text-sm text-center flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0">
          <span>© {currentYear} ResearchAI. All rights reserved.</span>
          <span className="sm:ml-2 flex items-center">
            Made with <Heart className="h-4 w-4 mx-1 text-error-500" /> for researchers
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;