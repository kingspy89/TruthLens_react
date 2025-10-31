import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaBrain, 
  FaChevronDown, 
  FaChevronUp, 
  FaExclamationTriangle,
  FaLink,
  FaEye,
  FaCode
} from 'react-icons/fa';

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.05);
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HeaderIcon = styled.div`
  font-size: 24px;
  color: #667eea;
`;

const HeaderTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #333;
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }
`;

const AnalysisContent = styled(motion.div)`
  margin-top: 16px;
`;

const AnalysisText = styled.div`
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  padding: 16px;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 20px;
  border-left: 4px solid #667eea;
`;

const TacticsSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TacticItem = styled.div`
  background: rgba(255, 165, 2, 0.1);
  border: 1px solid rgba(255, 165, 2, 0.3);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SourcesSection = styled.div`
  margin-bottom: 20px;
`;

const SourceItem = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(46, 213, 115, 0.1);
  border: 1px solid rgba(46, 213, 115, 0.3);
  border-radius: 8px;
  margin-bottom: 8px;
  text-decoration: none;
  color: #333;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(46, 213, 115, 0.2);
    transform: translateX(4px);
  }
`;

const NoDataMessage = styled.div`
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 20px;
`;

const AnalysisCard = ({ analysis, tactics, sources }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardHeader onClick={toggleExpanded}>
          <HeaderLeft>
            <HeaderIcon>
              <FaBrain />
            </HeaderIcon>
            <HeaderTitle>AI Analysis</HeaderTitle>
          </HeaderLeft>
          <ExpandButton>
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </ExpandButton>
        </CardHeader>

        {isExpanded && (
          <AnalysisContent
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {analysis ? (
              <AnalysisText>
                {analysis}
              </AnalysisText>
            ) : (
              <NoDataMessage>
                No AI analysis available
              </NoDataMessage>
            )}

            {tactics && tactics.length > 0 && (
              <TacticsSection>
                <SectionTitle>
                  <FaExclamationTriangle />
                  Manipulation Tactics Detected
                </SectionTitle>
                {tactics.map((tactic, index) => (
                  <TacticItem key={index}>
                    <FaCode />
                    {tactic}
                  </TacticItem>
                ))}
              </TacticsSection>
            )}

            {sources && sources.length > 0 && (
              <SourcesSection>
                <SectionTitle>
                  <FaLink />
                  Source References
                </SectionTitle>
                {sources.map((source, index) => (
                  <SourceItem 
                    key={index}
                    href={source.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaEye />
                    {source.name || source.description || `Source ${index + 1}`}
                  </SourceItem>
                ))}
              </SourcesSection>
            )}
          </AnalysisContent>
        )}
      </Card>
    </motion.div>
  );
};

export default AnalysisCard;
