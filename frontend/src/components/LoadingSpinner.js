import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

const SpinnerContainer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 24px;
`;

const SpinnerRing = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid rgba(102, 126, 234, 0.1);
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const SpinnerInner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border: 3px solid rgba(102, 126, 234, 0.1);
  border-top: 3px solid #764ba2;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite reverse;
`;

const LoadingText = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin-bottom: 12px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const LoadingSubtext = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 24px;
  max-width: 400px;
  line-height: 1.5;
`;

const ProgressDots = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 20px;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
  animation: ${pulse} 1.4s ease-in-out infinite;
  animation-delay: ${props => props.delay || 0}s;
`;

const LoadingSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
  max-width: 300px;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 14px;
  color: white;
  opacity: ${props => props.active ? 1 : 0.6};
  transition: opacity 0.3s ease;
`;

const StepIcon = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.completed ? '#4ecdc4' : 'rgba(255, 255, 255, 0.3)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
  font-weight: bold;
`;

const LoadingSpinner = ({ 
  message = "Analyzing content...", 
  submessage = "Our AI is examining your content for misinformation patterns",
  showSteps = true 
}) => {
  const steps = [
    { text: "Processing input...", completed: true },
    { text: "Running AI analysis...", completed: true },
    { text: "Checking fact sources...", completed: false },
    { text: "Generating report...", completed: false }
  ];

  return (
    <LoadingContainer>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <SpinnerContainer>
          <SpinnerRing />
          <SpinnerInner />
        </SpinnerContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <LoadingText>{message}</LoadingText>
        <LoadingSubtext>{submessage}</LoadingSubtext>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <ProgressDots>
          <Dot delay={0} />
          <Dot delay={0.2} />
          <Dot delay={0.4} />
        </ProgressDots>
      </motion.div>

      {showSteps && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <LoadingSteps>
            {steps.map((step, index) => (
              <Step key={index} active={step.completed}>
                <StepIcon completed={step.completed}>
                  {step.completed ? '✓' : index + 1}
                </StepIcon>
                {step.text}
              </Step>
            ))}
          </LoadingSteps>
        </motion.div>
      )}
    </LoadingContainer>
  );
};

export default LoadingSpinner;
