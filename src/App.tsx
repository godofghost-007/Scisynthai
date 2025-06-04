import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PaperUploadPage from './pages/PaperUploadPage';
import PaperSummaryPage from './pages/PaperSummaryPage';
import HypothesisPage from './pages/HypothesisPage';
import ClaimVerificationPage from './pages/ClaimVerificationPage';
import FundingPage from './pages/FundingPage';
import { ResearchProvider } from './context/ResearchContext';

function App() {
  return (
    <ResearchProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="upload" element={<PaperUploadPage />} />
            <Route path="summary/:paperId" element={<PaperSummaryPage />} />
            <Route path="hypothesis/:paperId" element={<HypothesisPage />} />
            <Route path="verify/:hypothesisId" element={<ClaimVerificationPage />} />
            <Route path="funding/:paperId" element={<FundingPage />} />
          </Route>
        </Routes>
      </Router>
    </ResearchProvider>
  );
}

export default App;