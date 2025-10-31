import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaTimesCircle, 
  FaQuestionCircle,
  FaShieldAlt
} from 'react-icons/fa';

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const CardHeader = styled.div`
  margin-bottom: 20px;
`;

const VerdictIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const VerdictTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color: ${props => props.color || '#333'};
`;

const VerdictDescription = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.5;
`;

const RiskScoreContainer = styled.div`
  background: ${props => props.bgColor || 'rgba(102, 126, 234, 0.1)'};
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
`;

const RiskScoreTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
`;

const RiskScoreBar = styled.div`
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  height: 12px;
  margin-bottom: 8px;
  overflow: hidden;
`;

const RiskScoreFill = styled.div`
  height: 100%;
  background: ${props => props.color || 'linear-gradient(45deg, #667eea, #764ba2)'};
  border-radius: 10px;
  transition: width 0.8s ease;
  width: ${props => props.percentage || 0}%;
`;

const RiskScoreText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const ConfidenceContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 12px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 8px;
`;

const ConfidenceLabel = styled.span`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const ConfidenceValue = styled.span`
  font-size: 16px;
  color: #667eea;
  font-weight: 700;
`;

const getVerdictConfig = (verdict, riskScore) => {
  const score = riskScore || 0;
  
  if (verdict === 'FALSE INFORMATION' || score >= 80) {
    return {
      icon: FaTimesCircle,
      title: 'FALSE INFORMATION',
      description: 'This content contains false or misleading information.',
      color: '#ff4757',
      bgColor: 'rgba(255, 71, 87, 0.1)',
      barColor: 'linear-gradient(45deg, #ff4757, #ff3742)'
    };
  } else if (verdict === 'MISLEADING' || (score >= 60 && score < 80)) {
    return {
      icon: FaExclamationTriangle,
      title: 'MISLEADING',
      description: 'This content is partially true but may be misleading.',
      color: '#ffa502',
      bgColor: 'rgba(255, 165, 2, 0.1)',
      barColor: 'linear-gradient(45deg, #ffa502, #ff9500)'
    };
  } else if (verdict === 'TRUE' || score < 30) {
    return {
      icon: FaCheckCircle,
      title: 'TRUE',
      description: 'This content appears to be factually accurate.',
      color: '#2ed573',
      bgColor: 'rgba(46, 213, 115, 0.1)',
      barColor: 'linear-gradient(45deg, #2ed573, #20bf6b)'
    };
  } else {
    return {
      icon: FaQuestionCircle,
      title: 'UNVERIFIED',
      description: 'Unable to determine the accuracy of this content.',
      color: '#747d8c',
      bgColor: 'rgba(116, 125, 140, 0.1)',
      barColor: 'linear-gradient(45deg, #747d8c, #5a6c7d)'
    };
  }
};

const VerdictCard = ({ verdict, riskScore, confidence }) => {
  const config = getVerdictConfig(verdict, riskScore);
  const Icon = config.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardHeader>
          <VerdictIcon>
            <Icon style={{ color: config.color }} />
          </VerdictIcon>
          <VerdictTitle color={config.color}>
            {config.title}
          </VerdictTitle>
          <VerdictDescription>
            {config.description}
          </VerdictDescription>
        </CardHeader>

        <RiskScoreContainer bgColor={config.bgColor}>
          <RiskScoreTitle>
            <FaShieldAlt style={{ marginRight: '8px', color: config.color }} />
            Risk Assessment
          </RiskScoreTitle>
          <RiskScoreBar>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${riskScore || 0}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <RiskScoreFill 
                color={config.barColor}
                percentage={riskScore || 0}
              />
            </motion.div>
          </RiskScoreBar>
          <RiskScoreText>
            <span>Low Risk</span>
            <span>{riskScore || 0}/100</span>
            <span>High Risk</span>
          </RiskScoreText>
        </RiskScoreContainer>

        <ConfidenceContainer>
          <ConfidenceLabel>AI Confidence</ConfidenceLabel>
          <ConfidenceValue>{confidence || 0}%</ConfidenceValue>
        </ConfidenceContainer>
      </Card>
    </motion.div>
  );
};

export default VerdictCard;
