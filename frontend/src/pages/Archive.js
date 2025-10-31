import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  FaSearch,
  FaFilter,
  FaDownload,
  FaEye,
  FaCalendarAlt,
  FaShieldAlt,
  FaExclamationTriangle
} from 'react-icons/fa';
import { useQuery } from 'react-query';
import { getArchivedReports, getReportDetails, exportReport } from '../services/api';
import ReportDetailsModal from '../components/ReportDetailsModal';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const ArchiveContainer = styled.div`
  min-height: 100vh;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 32px;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  justify-content: center;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 300px;
  padding: 12px 16px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;
  backdrop-filter: blur(10px);

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    outline: none;
    border-color: #4ecdc4;
    box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.2);
  }
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;
  backdrop-filter: blur(10px);
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #4ecdc4;
  }

  option {
    background: #333;
    color: white;
  }
`;

const ReportsGrid = styled.div`
  display: grid;
  gap: 20px;
  margin-bottom: 40px;
`;

const ReportCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const ReportTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
`;

const ReportDate = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
`;

const ReportContent = styled.p`
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ReportFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;

const RiskBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
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

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background: ${props => props.primary ? 'linear-gradient(45deg, #667eea, #764ba2)' : 'rgba(102, 126, 234, 0.1)'};
  color: ${props => props.primary ? 'white' : '#667eea'};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: white;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.6;
`;

const EmptyTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const EmptyDescription = styled.p`
  font-size: 16px;
  opacity: 0.8;
  max-width: 400px;
  margin: 0 auto;
`;

const Archive = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  // Modal state
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reportDetails, setReportDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const { data: reports, isLoading, error } = useQuery(
    ['archived-reports', searchTerm, filterRisk, filterDate],
    () => getArchivedReports({ searchTerm, filterRisk, filterDate }),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  // Filter reports to only include those belonging to the logged-in user
  // Assuming each report has a userId field and we have access to current user ID
  const currentUserId = user?.uid || null;

  const filteredReports = reports?.filter(report => {
    // Temporarily disable userId filtering for mock data
    // if (currentUserId && report.userId && report.userId !== currentUserId) {
    //   return false;
    // }
    const matchesSearch = !searchTerm ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk = filterRisk === 'all' ||
      (filterRisk === 'high' && report.risk_score >= 80) ||
      (filterRisk === 'medium' && report.risk_score >= 60 && report.risk_score < 80) ||
      (filterRisk === 'low' && report.risk_score < 60);

    return matchesSearch && matchesRisk;
  }) || [];

  // Handler functions
  const handleViewReport = async (reportId) => {
    try {
      setSelectedReportId(reportId);
      setModalOpen(true);
      setLoadingDetails(true);
      setDetailsError(null);
      setReportDetails(null);
      
      const details = await getReportDetails(reportId);
      setReportDetails(details);
    } catch (error) {
      setDetailsError(error.message);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleExportReport = async (reportId, format = 'json') => {
    try {
      const response = await exportReport(reportId, format);
      
      if (format === 'pdf') {
        // Handle PDF download
        const blob = response.data;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `report-${reportId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        // Handle JSON download
        const dataStr = JSON.stringify(response.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `report-${reportId}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed: ' + error.message);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedReportId(null);
    setReportDetails(null);
    setDetailsError(null);
  };

  const handleModalExport = (format) => {
    if (selectedReportId) {
      handleExportReport(selectedReportId, format);
    }
  };

  if (isLoading) {
    return (
      <ArchiveContainer>
      <Header>
        <Title>📚 Your Analysis History</Title>
        <Subtitle>Browse and search through your analyzed content</Subtitle>
      </Header>
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'white' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>⏳</div>
          <div>Loading archived reports...</div>
        </div>
      </ArchiveContainer>
    );
  }

  if (error) {
    return (
      <ArchiveContainer>
        <Header>
          <Title>📚 Analysis Archive</Title>
          <Subtitle>Browse and search through all analyzed content</Subtitle>
        </Header>
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'white' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>❌</div>
          <div>Failed to load archived reports</div>
        </div>
      </ArchiveContainer>
    );
  }

  return (
    <ArchiveContainer>
      <Header>
        <Title>📚 Analysis Archive</Title>
        <Subtitle>Browse and search through all analyzed content</Subtitle>
      </Header>

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search reports..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterSelect
          value={filterRisk}
          onChange={(e) => setFilterRisk(e.target.value)}
        >
          <option value="all">All Risk Levels</option>
          <option value="high">High Risk (80+)</option>
          <option value="medium">Medium Risk (60-79)</option>
          <option value="low">Low Risk (0-59)</option>
        </FilterSelect>
        <FilterSelect
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </FilterSelect>
      </SearchContainer>

      {filteredReports.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📚</EmptyIcon>
          <EmptyTitle>No reports found</EmptyTitle>
          <EmptyDescription>
            {searchTerm || filterRisk !== 'all' || filterDate !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'No reports have been archived yet. Start by analyzing some content!'
            }
          </EmptyDescription>
        </EmptyState>
      ) : (
        <ReportsGrid>
          {filteredReports.map((report, index) => (
            <ReportCard
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <ReportHeader>
                <div>
                  <ReportTitle>{report.title}</ReportTitle>
                  <ReportDate>
                    <FaCalendarAlt />
                    {new Date(report.created_at).toLocaleDateString()}
                  </ReportDate>
                </div>
                <RiskBadge risk={report.risk_score}>
                  <FaShieldAlt />
                  {report.risk_score}/100
                </RiskBadge>
              </ReportHeader>

              <ReportContent>{report.content}</ReportContent>

              <ReportFooter>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    {report.verdict || 'UNVERIFIED'}
                  </span>
                  {report.risk_score >= 80 && (
                    <FaExclamationTriangle style={{ color: '#ff4757', fontSize: '12px' }} />
                  )}
                </div>
                <ActionButtons>
                  <ActionButton onClick={() => handleViewReport(report.id)}>
                    <FaEye />
                    View
                  </ActionButton>
                  <ActionButton primary onClick={() => handleExportReport(report.id, 'json')}>
                    <FaDownload />
                    Export
                  </ActionButton>
                </ActionButtons>
              </ReportFooter>
            </ReportCard>
          ))}
        </ReportsGrid>
      )}
      
      <ReportDetailsModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        report={reportDetails}
        isLoading={loadingDetails}
        error={detailsError}
        onExport={handleModalExport}
      />
    </ArchiveContainer>
  );
};

export default Archive;
