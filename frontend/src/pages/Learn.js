import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaGraduationCap, 
  FaBook, 
  FaVideo, 
  FaQuestionCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaShieldAlt,
  FaBrain,
  FaSearch,
  FaFilter
} from 'react-icons/fa';

const LearnContainer = styled.div`
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
  justify-content: center;
  flex-wrap: wrap;
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

const FilterTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  justify-content: center;
  flex-wrap: wrap;
`;

const FilterTab = styled.button`
  padding: 12px 24px;
  border: 2px solid ${props => props.active ? '#4ecdc4' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 25px;
  background: ${props => props.active ? 'rgba(78, 205, 196, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(78, 205, 196, 0.2);
    border-color: #4ecdc4;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  gap: 24px;
  margin-bottom: 40px;
`;

const ContentCard = styled(motion.div)`
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

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const CardIcon = styled.div`
  font-size: 24px;
  color: #667eea;
`;

const CardTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #333;
`;

const CardContent = styled.div`
  color: #666;
  line-height: 1.6;
  margin-bottom: 16px;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const DifficultyBadge = styled.div`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    if (props.level === 'beginner') return 'rgba(46, 213, 115, 0.1)';
    if (props.level === 'intermediate') return 'rgba(255, 165, 2, 0.1)';
    return 'rgba(255, 71, 87, 0.1)';
  }};
  color: ${props => {
    if (props.level === 'beginner') return '#2ed573';
    if (props.level === 'intermediate') return '#ffa502';
    return '#ff4757';
  }};
`;

const ReadMoreButton = styled.button`
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
`;

const QuizSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const QuizTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const QuizQuestion = styled.div`
  margin-bottom: 20px;
`;

const QuestionText = styled.p`
  font-size: 16px;
  color: #333;
  margin-bottom: 12px;
  font-weight: 500;
`;

const AnswerOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AnswerOption = styled.button`
  padding: 12px 16px;
  border: 2px solid ${props => props.selected ? '#4ecdc4' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 8px;
  background: ${props => props.selected ? 'rgba(78, 205, 196, 0.1)' : 'transparent'};
  color: #333;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #4ecdc4;
    background: rgba(78, 205, 196, 0.05);
  }
`;

const Learn = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const learningContent = [
    {
      id: 1,
      type: 'article',
      title: 'Understanding Misinformation',
      content: 'Learn about different types of misinformation and how they spread through social media and other channels.',
      difficulty: 'beginner',
      icon: FaBook,
      category: 'basics'
    },
    {
      id: 2,
      type: 'video',
      title: 'AI Detection Methods',
      content: 'Discover how artificial intelligence is used to detect and analyze misinformation patterns.',
      difficulty: 'intermediate',
      icon: FaVideo,
      category: 'technology'
    },
    {
      id: 3,
      type: 'article',
      title: 'Fact-Checking Best Practices',
      content: 'Learn the essential skills for verifying information and identifying reliable sources.',
      difficulty: 'beginner',
      icon: FaCheckCircle,
      category: 'verification'
    },
    {
      id: 4,
      type: 'article',
      title: 'Psychological Manipulation Tactics',
      content: 'Understand how misinformation uses psychological techniques to influence people.',
      difficulty: 'advanced',
      icon: FaBrain,
      category: 'psychology'
    },
    {
      id: 5,
      type: 'article',
      title: 'Source Verification Techniques',
      content: 'Master the art of tracing information back to its original source and verifying credibility.',
      difficulty: 'intermediate',
      icon: FaSearch,
      category: 'verification'
    },
    {
      id: 6,
      type: 'article',
      title: 'Building Digital Literacy',
      content: 'Develop critical thinking skills for the digital age and learn to navigate information responsibly.',
      difficulty: 'beginner',
      icon: FaShieldAlt,
      category: 'literacy'
    }
  ];

  const quizQuestions = [
    {
      id: 1,
      question: "What is the primary difference between misinformation and disinformation?",
      options: [
        "Misinformation is always false, disinformation is sometimes true",
        "Misinformation is unintentional, disinformation is deliberate",
        "There is no difference between them",
        "Misinformation is online, disinformation is offline"
      ],
      correct: 1
    },
    {
      id: 2,
      question: "Which of the following is NOT a red flag for misinformation?",
      options: [
        "Emotional language designed to provoke",
        "Multiple credible sources confirming the information",
        "Claims that seem too good to be true",
        "Lack of author attribution or publication date"
      ],
      correct: 1
    }
  ];

  const filteredContent = learningContent.filter(item => {
    const matchesSearch = !searchTerm || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const categories = [
    { id: 'all', label: 'All Topics' },
    { id: 'basics', label: 'Basics' },
    { id: 'technology', label: 'Technology' },
    { id: 'verification', label: 'Verification' },
    { id: 'psychology', label: 'Psychology' },
    { id: 'literacy', label: 'Digital Literacy' }
  ];

  return (
    <LearnContainer>
      <Header>
        <Title>🎓 Learning Center</Title>
        <Subtitle>Expand your knowledge about misinformation detection and digital literacy</Subtitle>
      </Header>

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search learning content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>

      <FilterTabs>
        {categories.map(category => (
          <FilterTab
            key={category.id}
            active={activeFilter === category.id}
            onClick={() => setActiveFilter(category.id)}
          >
            {category.label}
          </FilterTab>
        ))}
      </FilterTabs>

      <ContentGrid>
        {filteredContent.map((item, index) => {
          const Icon = item.icon;
          return (
            <ContentCard
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <CardHeader>
                <CardIcon>
                  <Icon />
                </CardIcon>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              
              <CardContent>{item.content}</CardContent>
              
              <CardFooter>
                <DifficultyBadge level={item.difficulty}>
                  {item.difficulty.toUpperCase()}
                </DifficultyBadge>
                <ReadMoreButton>
                  Read More
                </ReadMoreButton>
              </CardFooter>
            </ContentCard>
          );
        })}
      </ContentGrid>

      <QuizSection>
        <QuizTitle>
          <FaQuestionCircle />
          Test Your Knowledge
        </QuizTitle>
        
        {quizQuestions.map((question, qIndex) => (
          <QuizQuestion key={question.id}>
            <QuestionText>
              {qIndex + 1}. {question.question}
            </QuestionText>
            <AnswerOptions>
              {question.options.map((option, oIndex) => (
                <AnswerOption
                  key={oIndex}
                  selected={selectedAnswer === `${question.id}-${oIndex}`}
                  onClick={() => setSelectedAnswer(`${question.id}-${oIndex}`)}
                >
                  {String.fromCharCode(65 + oIndex)}. {option}
                </AnswerOption>
              ))}
            </AnswerOptions>
          </QuizQuestion>
        ))}
      </QuizSection>
    </LearnContainer>
  );
};

export default Learn;
