import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTimes, 
  FaCalendarAlt, 
  FaShieldAlt, 
  FaExclamationTriangle,
  FaCheck,
  FaClock,
  FaDownload,
  FaBrain,
  FaLink,
  FaCode
} from 'react-icons/fa';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 20px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  padding: 24px 32px 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #333;
  }
`;

const TitleSection = styled.div`
  flex: 1;
`;

const ReportTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
  line-height: 1.3;
`;

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  margin-bottom: 8px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
`;

const RiskBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  background: ${props => {
    if (props.risk >= 80) return 'rgba(255, 71, 87, 0.1)';
    if (props.risk >= 60) return 'rgba(255, 165, 2, 0.1)';
    return 'rgba(46, 213, 115, 0.1)';
  }};
  color: ${props => {
    if (props.risk >= 80) return '#ff4757';
    if (props.risk >= 60) return '#ffa502';
    return '#2ed573';
  }};
  border: 1px solid ${props => {
    if (props.risk >= 80) return 'rgba(255, 71, 87, 0.3)';
    if (props.risk >= 60) return 'rgba(255, 165, 2, 0.3)';
    return 'rgba(46, 213, 115, 0.3)';
  }};
`;

const VerdictBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    if (props.verdict === 'TRUE') return 'rgba(46, 213, 115, 0.1)';
    if (props.verdict === 'FALSE') return 'rgba(255, 71, 87, 0.1)';
    if (props.verdict === 'MISLEADING') return 'rgba(255, 165, 2, 0.1)';
    return 'rgba(108, 117, 125, 0.1)';
  }};
  color: ${props => {
    if (props.verdict === 'TRUE') return '#2ed573';
    if (props.verdict === 'FALSE') return '#ff4757';
    if (props.verdict === 'MISLEADING') return '#ffa502';
    return '#6c757d';
  }};
  border: 1px solid ${props => {
    if (props.verdict === 'TRUE') return 'rgba(46, 213, 115, 0.3)';
    if (props.verdict === 'FALSE') return 'rgba(255, 71, 87, 0.3)';
    if (props.verdict === 'MISLEADING') return 'rgba(255, 165, 2, 0.3)';
    return 'rgba(108, 117, 125, 0.3)';
  }};
`;

const ModalBody = styled.div`
  padding: 24px 32px 32px;
`;

const Section = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ContentBlock = styled.div`
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  padding: 20px;
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  border-left: 4px solid #667eea;
`;

const AnalysisBlock = styled.div`
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  padding: 20px;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  border-left: 4px solid #667eea;
  margin-bottom: 20px;
`;

const TacticsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TacticItem = styled.div`
  background: rgba(255, 165, 2, 0.1);
  border: 1px solid rgba(255, 165, 2, 0.3);
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SourcesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SourceItem = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(46, 213, 115, 0.1);
  border: 1px solid rgba(46, 213, 115, 0.3);
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(46, 213, 115, 0.2);
    transform: translateX(4px);
  }
`;

const EvidenceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const EvidenceItem = styled.div`
  background: rgba(46, 213, 115, 0.05);
  border: 1px solid rgba(46, 213, 115, 0.2);
  border-radius: 8px;
  padding: 16px;
`;

const EvidenceTitle = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const EvidenceDescription = styled.div`
  color: #666;
  font-size: 14px;
  line-height: 1.5;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #666;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #ff4757;
`;

const getVerdictIcon = (verdict) => {
  switch (verdict) {
    case 'TRUE': return <FaCheck />;
    case 'FALSE': return <FaExclamationTriangle />;
    case 'MISLEADING': return <FaExclamationTriangle />;
    default: return <FaClock />;
  }
};

const ReportDetailsModal = ({ isOpen, onClose, report, isLoading, error, onExport }) => {
  if (!isOpen) return null;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      <ModalOverlay
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        <ModalContent
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader>
            <TitleSection>
              {isLoading ? (
                <ReportTitle>Loading Report...</ReportTitle>
              ) : error ? (
                <ReportTitle>Error Loading Report</ReportTitle>
              ) : (
                <>
                  <ReportTitle>{report?.title || 'Report Details'}</ReportTitle>
                  <MetaInfo>
                    <MetaItem>
                      <FaCalendarAlt />
                      {report?.created_at ? new Date(report.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'N/A'}
                    </MetaItem>
                    <RiskBadge risk={report?.risk_score || 0}>
                      <FaShieldAlt />
                      {report?.risk_score || 0}/100
                    </RiskBadge>
                    <VerdictBadge verdict={report?.verdict}>
                      {getVerdictIcon(report?.verdict)}
                      {report?.verdict || 'UNVERIFIED'}
                    </VerdictBadge>
                  </MetaInfo>
                </>
              )}
            </TitleSection>
            <CloseButton onClick={onClose}>
              <FaTimes />
            </CloseButton>
          </ModalHeader>

          <ModalBody>
            {isLoading && (
              <LoadingState>
                <LoadingSpinner />
                <div>Loading report details...</div>
              </LoadingState>
            )}

            {error && (
              <ErrorState>
                <FaExclamationTriangle size={32} style={{ marginBottom: '16px' }} />
                <div>{error}</div>
              </ErrorState>
            )}

            {report && !isLoading && !error && (
              <>
                <Section>
                  <SectionTitle>
                    <FaBrain />
                    Original Content
                  </SectionTitle>
                  <ContentBlock>
                    {report.content || 'No content available'}
                  </ContentBlock>
                </Section>

                {report.analysis && (
                  <Section>
                    <SectionTitle>
                      <FaBrain />
                      AI Analysis
                    </SectionTitle>
                    <AnalysisBlock>
                      {report.analysis}
                    </AnalysisBlock>
                  </Section>
                )}

                {report.tactics && report.tactics.length > 0 && (
                  <Section>
                    <SectionTitle>
                      <FaExclamationTriangle />
                      Manipulation Tactics Detected
                    </SectionTitle>
                    <TacticsList>
                      {report.tactics.map((tactic, index) => (
                        <TacticItem key={index}>
                          <FaCode />
                          {tactic}
                        </TacticItem>
                      ))}
                    </TacticsList>
                  </Section>
                )}

                {report.sources && report.sources.length > 0 && (
                  <Section>
                    <SectionTitle>
                      <FaLink />
                      Source References
                    </SectionTitle>
                    <SourcesList>
                      {report.sources.map((source, index) => (
                        <SourceItem 
                          key={index}
                          href={source.url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaLink />
                          {source.name || source.description || `Source ${index + 1}`}
                        </SourceItem>
                      ))}
                    </SourcesList>
                  </Section>
                )}

                {report.evidence && report.evidence.length > 0 && (
                  <Section>
                    <SectionTitle>
                      <FaCheck />
                      Evidence
                    </SectionTitle>
                    <EvidenceList>
                      {report.evidence.map((evidence, index) => (
                        <EvidenceItem key={index}>
                          <EvidenceTitle>{evidence.title || `Evidence ${index + 1}`}</EvidenceTitle>
                          <EvidenceDescription>{evidence.description || evidence.content}</EvidenceDescription>
                        </EvidenceItem>
                      ))}
                    </EvidenceList>
                  </Section>
                )}

                {onExport && (
                  <Section>
                    <SectionTitle>
                      <FaDownload />
                      Export Options
                    </SectionTitle>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => onExport('json')}
                        style={{
                          padding: '10px 16px',
                          border: 'none',
                          borderRadius: '8px',
                          background: 'linear-gradient(45deg, #667eea, #764ba2)',
                          color: 'white',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <FaDownload style={{ marginRight: '6px' }} />
                        Export as JSON
                      </button>
                      <button
                        onClick={() => onExport('pdf')}
                        style={{
                          padding: '10px 16px',
                          border: '2px solid #667eea',
                          borderRadius: '8px',
                          background: 'transparent',
                          color: '#667eea',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <FaDownload style={{ marginRight: '6px' }} />
                        Export as PDF
                      </button>
                    </div>
                  </Section>
                )}
              </>
            )}
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </AnimatePresence>
  );
};

export default ReportDetailsModal;