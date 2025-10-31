import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import VerdictCard from './VerdictCard';
import AnalysisCard from './AnalysisCard';
import EvidenceCard from './EvidenceCard';
import LoadingSpinner from './LoadingSpinner';

const ResultsContainer = styled.div`
  margin: 20px 0;
`;

const ResultsHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const ResultsTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const ResultsSubtitle = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(255, 71, 87, 0.1);
  border: 2px solid #ff4757;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  color: #ff4757;
  font-weight: 600;
  margin: 20px 0;
`;

const NoResultsMessage = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  color: white;
  font-size: 18px;
  margin: 20px 0;
`;

const ResultsDisplay = ({ 
  results, 
  isLoading, 
  error, 
  hasAnalyzed 
}) => {
  if (isLoading) {
    return (
      <ResultsContainer>
        <ResultsHeader>
          <ResultsTitle>🔍 Analyzing Content</ResultsTitle>
          <ResultsSubtitle>Our AI is examining your content for misinformation...</ResultsSubtitle>
        </ResultsHeader>
        <LoadingSpinner />
      </ResultsContainer>
    );
  }

  if (error) {
    return (
      <ResultsContainer>
        <ErrorMessage>
          ❌ {error}
        </ErrorMessage>
      </ResultsContainer>
    );
  }

  if (!hasAnalyzed || !results) {
    return (
      <ResultsContainer>
        <NoResultsMessage>
          🎯 Ready to analyze content
          <br />
          <span style={{ fontSize: '14px', opacity: 0.8 }}>
            Use the input form above to get started
          </span>
        </NoResultsMessage>
      </ResultsContainer>
    );
  }

  return (
    <ResultsContainer>
      <ResultsHeader>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ResultsTitle>📊 Analysis Results</ResultsTitle>
          <ResultsSubtitle>
            Risk Score: {results.risk_score || 0}/100 | 
            Confidence: {results.confidence || 0}%
          </ResultsSubtitle>
        </motion.div>
      </ResultsHeader>

      <ResultsGrid>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <VerdictCard 
            verdict={results.verdict}
            riskScore={results.risk_score}
            confidence={results.confidence}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnalysisCard 
            analysis={results.ai_analysis}
            tactics={results.manipulation_tactics}
            sources={results.source_links}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <EvidenceCard 
            factChecks={results.fact_checks}
            sources={results.source_links}
            reportingEmails={results.reporting_emails}
          />
        </motion.div>
      </ResultsGrid>
    </ResultsContainer>
  );
};

export default ResultsDisplay;
