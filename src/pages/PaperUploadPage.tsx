import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, ExternalLink, Loader } from 'lucide-react';
import { useResearch } from '../context/ResearchContext';
import { Paper } from '../types';

const PaperUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { uploadPaper, isLoading } = useResearch();
  const [uploadMethod, setUploadMethod] = useState<'file' | 'doi' | 'manual'>('file');
  const [file, setFile] = useState<File | null>(null);
  const [doi, setDoi] = useState('');
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [year, setYear] = useState('');
  const [journal, setJournal] = useState('');
  const [abstract, setAbstract] = useState('');
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new paper object
    const newPaper: Paper = {
      id: Date.now().toString(),
      title: title || (file ? file.name.replace(/\.[^/.]+$/, '') : 'Untitled Paper'),
      authors: authors ? authors.split(',').map(a => a.trim()) : ['Unknown Author'],
      year: parseInt(year) || new Date().getFullYear(),
      journal: journal || undefined,
      doi: doi || undefined,
      abstract: abstract || undefined,
      uploaded: new Date(),
    };
    
    await uploadPaper(newPaper);
    navigate(`/summary/${newPaper.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-3xl font-heading font-bold text-primary-700 mb-6">Upload Research Paper</h1>
        
        <div className="flex flex-wrap mb-8 border-b">
          <button
            className={`px-4 py-2 font-medium ${
              uploadMethod === 'file'
                ? 'border-b-2 border-primary-500 text-primary-700'
                : 'text-gray-500 hover:text-primary-600'
            }`}
            onClick={() => setUploadMethod('file')}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Upload File
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              uploadMethod === 'doi'
                ? 'border-b-2 border-primary-500 text-primary-700'
                : 'text-gray-500 hover:text-primary-600'
            }`}
            onClick={() => setUploadMethod('doi')}
          >
            <ExternalLink className="w-4 h-4 inline mr-2" />
            Enter DOI
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              uploadMethod === 'manual'
                ? 'border-b-2 border-primary-500 text-primary-700'
                : 'text-gray-500 hover:text-primary-600'
            }`}
            onClick={() => setUploadMethod('manual')}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Manual Entry
          </button>
        </div>
        
        <form onSubmit={handleUpload}>
          {uploadMethod === 'file' && (
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Upload PDF or Text File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.txt"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <Upload className="h-12 w-12 text-gray-400 mb-3" />
                  <span className="text-sm text-gray-500">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    PDF or TXT up to 10MB
                  </span>
                </label>
              </div>
            </div>
          )}
          
          {uploadMethod === 'doi' && (
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="doi">
                DOI (Digital Object Identifier)
              </label>
              <input
                type="text"
                id="doi"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., 10.1038/s41586-021-03819-2"
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll retrieve the paper metadata from CrossRef or other academic databases.
              </p>
            </div>
          )}
          
          {uploadMethod === 'manual' && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="title">
                  Paper Title*
                </label>
                <input
                  type="text"
                  id="title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter paper title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="authors">
                  Authors*
                </label>
                <input
                  type="text"
                  id="authors"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter author names, separated by commas"
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="year">
                    Year*
                  </label>
                  <input
                    type="number"
                    id="year"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Publication year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="journal">
                    Journal
                  </label>
                  <input
                    type="text"
                    id="journal"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Journal name"
                    value={journal}
                    onChange={(e) => setJournal(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="abstract">
                  Abstract
                </label>
                <textarea
                  id="abstract"
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter paper abstract"
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  Upload and Analyze
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaperUploadPage;