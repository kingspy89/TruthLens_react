import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaGavel, 
  FaChevronDown, 
  FaChevronUp, 
  FaExternalLinkAlt,
  FaEnvelope,
  FaCopy,
  FaCheck
} from 'react-icons/fa';
import toast from 'react-hot-toast';

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

const EvidenceContent = styled(motion.div)`
  margin-top: 16px;
`;

const Section = styled.div`
  margin-bottom: 24px;
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

const FactCheckItem = styled.div`
  background: rgba(46, 213, 115, 0.1);
  border: 1px solid rgba(46, 213, 115, 0.3);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
`;

const SourceItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: rgba(102, 126, 234, 0.05);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }
`;

const SourceInfo = styled.div`
  flex: 1;
`;

const SourceName = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const SourceDescription = styled.div`
  font-size: 12px;
  color: #666;
`;

const SourceActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }
`;

const EmailItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: rgba(255, 71, 87, 0.05);
  border: 1px solid rgba(255, 71, 87, 0.2);
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 71, 87, 0.1);
  }
`;

const EmailInfo = styled.div`
  flex: 1;
`;

const EmailName = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const EmailAddress = styled.div`
  font-size: 12px;
  color: #666;
  font-family: monospace;
`;

const NoDataMessage = styled.div`
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 20px;
`;

const EvidenceCard = ({ factChecks, sources, reportingEmails }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard!`);
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  const openLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
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
              <FaGavel />
            </HeaderIcon>
            <HeaderTitle>Evidence & Sources</HeaderTitle>
          </HeaderLeft>
          <ExpandButton>
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </ExpandButton>
        </CardHeader>

        {isExpanded && (
          <EvidenceContent
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {factChecks && factChecks.length > 0 && (
              <Section>
                <SectionTitle>
                  <FaGavel />
                  Fact Check Results
                </SectionTitle>
                {factChecks.map((check, index) => (
                  <FactCheckItem key={index}>
                    {typeof check === 'string' ? check : check.description}
                  </FactCheckItem>
                ))}
              </Section>
            )}

            {sources && sources.length > 0 && (
              <Section>
                <SectionTitle>
                  <FaExternalLinkAlt />
                  Source References
                </SectionTitle>
                {sources.map((source, index) => (
                  <SourceItem key={index}>
                    <SourceInfo>
                      <SourceName>
                        {source.name || `Source ${index + 1}`}
                      </SourceName>
                      <SourceDescription>
                        {source.description || source.url}
                      </SourceDescription>
                    </SourceInfo>
                    <SourceActions>
                      {source.url && (
                        <ActionButton
                          onClick={() => openLink(source.url)}
                          title="Open link"
                        >
                          <FaExternalLinkAlt />
                        </ActionButton>
                      )}
                      <ActionButton
                        onClick={() => copyToClipboard(
                          source.url || source.description, 
                          'Source link'
                        )}
                        title="Copy link"
                      >
                        <FaCopy />
                      </ActionButton>
                    </SourceActions>
                  </SourceItem>
                ))}
              </Section>
            )}

            {reportingEmails && reportingEmails.length > 0 && (
              <Section>
                <SectionTitle>
                  <FaEnvelope />
                  Report This Content
                </SectionTitle>
                {reportingEmails.map((email, index) => (
                  <EmailItem key={index}>
                    <EmailInfo>
                      <EmailName>
                        {email.description || `Report ${index + 1}`}
                      </EmailName>
                      <EmailAddress>
                        {email.email}
                      </EmailAddress>
                    </EmailInfo>
                    <SourceActions>
                      <ActionButton
                        onClick={() => copyToClipboard(email.email, 'Email address')}
                        title="Copy email"
                      >
                        <FaCopy />
                      </ActionButton>
                    </SourceActions>
                  </EmailItem>
                ))}
              </Section>
            )}

            {(!factChecks || factChecks.length === 0) && 
             (!sources || sources.length === 0) && 
             (!reportingEmails || reportingEmails.length === 0) && (
              <NoDataMessage>
                No evidence or sources available
              </NoDataMessage>
            )}
          </EvidenceContent>
        )}
      </Card>
    </motion.div>
  );
};

export default EvidenceCard;
