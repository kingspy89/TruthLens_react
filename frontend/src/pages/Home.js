import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import InputTabs from '../components/InputTabs';
import ResultsDisplay from '../components/ResultsDisplay';
import { useQuery } from 'react-query';
import { analyzeContent } from '../services/api';
import toast from 'react-hot-toast';

const HomeContainer = styled.div`
  min-height: 100vh;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroSection = styled.div`
  text-align: center;
  padding: 60px 20px;
  margin-bottom: 40px;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 48px;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin: 40px 0;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  color: white;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const FeatureIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  color: #4ecdc4;
`;

const FeatureTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const FeatureDescription = styled.p`
  font-size: 14px;
  opacity: 0.9;
  line-height: 1.5;
`;

const Home = () => {
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  const { data: results, isLoading, error, refetch } = useQuery(
    ['analysis', analysisData],
    () => analyzeContent(analysisData),
    {
      enabled: !!analysisData,
      onSuccess: () => {
        setHasAnalyzed(true);
        toast.success('Analysis completed!');
      },
      onError: (error) => {
        toast.error('Analysis failed. Please try again.');
        console.error('Analysis error:', error);
      }
    }
  );

  const handleAnalyze = (inputData) => {
    setAnalysisData(inputData);
    setHasAnalyzed(false);
  };

  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms detect misinformation patterns'
    },
    {
      icon: '🔍',
      title: 'Multi-Format Support',
      description: 'Analyze text, images, and URLs with comprehensive fact-checking'
    },
    {
      icon: '📊',
      title: 'Real-Time Results',
      description: 'Get instant analysis with detailed risk assessments and evidence'
    },
    {
      icon: '🛡️',
      title: 'Source Verification',
      description: 'Cross-reference with credible sources and fact-checking databases'
    }
  ];

  return (
    <HomeContainer>
      <HeroSection>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroTitle>
            TruthLens
          </HeroTitle>
          <HeroSubtitle>
            AI-Powered Misinformation Detection System
            <br />
            <span style={{ fontSize: '16px', opacity: 0.8 }}>
              Detect, analyze, and combat false information with cutting-edge technology
            </span>
          </HeroSubtitle>
        </motion.div>
      </HeroSection>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <InputTabs onAnalyze={handleAnalyze} isLoading={isLoading} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <ResultsDisplay 
          results={results}
          isLoading={isLoading}
          error={error?.message}
          hasAnalyzed={hasAnalyzed}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <FeatureGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeatureGrid>
      </motion.div>
    </HomeContainer>
  );
};

export default Home;
