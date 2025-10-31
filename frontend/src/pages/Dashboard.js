import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaChartBar, 
  FaArrowUp, 
  FaShieldAlt, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaUsers,
  FaBrain,
  FaEye,
  FaDownload
} from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useQuery } from 'react-query';
import { getDashboardData } from '../services/api';

const DashboardContainer = styled.div`
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const StatIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  color: ${props => props.color || '#667eea'};
`;

const StatValue = styled.h3`
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
`;

const StatLabel = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
`;

const StatChange = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.positive ? '#2ed573' : '#ff4757'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RecentActivity = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.color || 'rgba(102, 126, 234, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color || '#667eea'};
  font-size: 16px;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const ActivityDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
`;

const ActivityTime = styled.span`
  font-size: 12px;
  color: #999;
`;

const ExportButton = styled.button`
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  border-radius: 12px;
  color: white;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 20px auto;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
`;

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const { data: dashboardData, isLoading, error } = useQuery(
    ['dashboard-data', timeRange],
    () => getDashboardData(timeRange),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  const stats = [
    {
      icon: FaChartBar,
      value: dashboardData?.totalAnalyses || 0,
      label: 'Total Analyses',
      change: '+12%',
      positive: true,
      color: '#667eea'
    },
    {
      icon: FaExclamationTriangle,
      value: dashboardData?.highRiskContent || 0,
      label: 'High Risk Content',
      change: '+8%',
      positive: false,
      color: '#ff4757'
    },
    {
      icon: FaCheckCircle,
      value: dashboardData?.verifiedContent || 0,
      label: 'Verified Content',
      change: '+15%',
      positive: true,
      color: '#2ed573'
    },
    {
      icon: FaUsers,
      value: dashboardData?.activeUsers || 0,
      label: 'Active Users',
      change: '+5%',
      positive: true,
      color: '#4ecdc4'
    }
  ];

  const chartData = dashboardData?.chartData || [];
  const riskDistribution = dashboardData?.riskDistribution || [];

  const COLORS = ['#2ed573', '#ffa502', '#ff4757'];

  if (isLoading) {
    return (
      <DashboardContainer>
        <Header>
          <Title>📊 Analytics Dashboard</Title>
          <Subtitle>Real-time insights and performance metrics</Subtitle>
        </Header>
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'white' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>⏳</div>
          <div>Loading dashboard data...</div>
        </div>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <Header>
          <Title>📊 Analytics Dashboard</Title>
          <Subtitle>Real-time insights and performance metrics</Subtitle>
        </Header>
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'white' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>❌</div>
          <div>Failed to load dashboard data</div>
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>📊 Analytics Dashboard</Title>
        <Subtitle>Real-time insights and performance metrics</Subtitle>
      </Header>

      <StatsGrid>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <StatCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <StatIcon color={stat.color}>
                <Icon />
              </StatIcon>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
              <StatChange positive={stat.positive}>
                <FaArrowUp />
                {stat.change}
              </StatChange>
            </StatCard>
          );
        })}
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>
            <FaChartBar />
            Analysis Trends
          </ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="analyses" 
                stroke="#667eea" 
                strokeWidth={2}
                dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="highRisk" 
                stroke="#ff4757" 
                strokeWidth={2}
                dot={{ fill: '#ff4757', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>
            <FaShieldAlt />
            Risk Distribution
          </ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>

      <RecentActivity>
        <ChartTitle>
          <FaClock />
          Recent Activity
        </ChartTitle>
        {dashboardData?.recentActivity?.map((activity, index) => (
          <ActivityItem key={index}>
            <ActivityIcon color={activity.color}>
              {activity.icon === 'analysis' && <FaBrain />}
              {activity.icon === 'high-risk' && <FaExclamationTriangle />}
              {activity.icon === 'verified' && <FaCheckCircle />}
            </ActivityIcon>
            <ActivityContent>
              <ActivityTitle>{activity.title}</ActivityTitle>
              <ActivityDescription>{activity.description}</ActivityDescription>
              <ActivityTime>{activity.time}</ActivityTime>
            </ActivityContent>
          </ActivityItem>
        )) || (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No recent activity
          </div>
        )}
      </RecentActivity>

      <ExportButton>
        <FaDownload />
        Export Dashboard Data
      </ExportButton>
    </DashboardContainer>
  );
};

export default Dashboard;
