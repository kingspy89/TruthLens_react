import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaFileAlt, 
  FaImage, 
  FaLink, 
  FaUpload,
  FaTimes,
  FaCheck
} from 'react-icons/fa';

const TabsContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 24px;
  margin: 20px 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const TabHeader = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
`;

const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  background: ${props => props.active ? 'linear-gradient(45deg, #667eea, #764ba2)' : 'transparent'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 12px 12px 0 0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: ${props => props.active ? 'linear-gradient(45deg, #667eea, #764ba2)' : 'rgba(102, 126, 234, 0.1)'};
    color: ${props => props.active ? 'white' : '#667eea'};
  }
`;

const TabContent = styled.div`
  min-height: 300px;
`;

const TextInput = styled.textarea`
  width: 100%;
  padding: 16px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
  min-height: 200px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const ImageUpload = styled.div`
  border: 2px dashed rgba(102, 126, 234, 0.3);
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(102, 126, 234, 0.05);

  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }
`;

const UploadIcon = styled(FaUpload)`
  font-size: 48px;
  color: #667eea;
  margin-bottom: 16px;
`;

const UploadText = styled.p`
  font-size: 18px;
  color: #666;
  margin-bottom: 8px;
`;

const UploadSubtext = styled.p`
  font-size: 14px;
  color: #999;
`;

const URLInput = styled.input`
  width: 100%;
  padding: 16px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const FilePreview = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  margin-top: 16px;
`;

const FileInfo = styled.div`
  flex: 1;
`;

const FileName = styled.p`
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const FileSize = styled.p`
  font-size: 12px;
  color: #666;
`;

const RemoveButton = styled.button`
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ff3742;
    transform: scale(1.1);
  }
`;

const AnalyzeButton = styled.button`
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  border-radius: 12px;
  color: white;
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  margin-top: 20px;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const InputTabs = ({ onAnalyze, isLoading }) => {
  const [activeTab, setActiveTab] = useState('text');
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: file.type,
        file: file
      });
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const handleAnalyze = () => {
    let inputData = {};
    
    switch (activeTab) {
      case 'text':
        inputData = { type: 'text', content: textInput };
        break;
      case 'image':
        inputData = { type: 'image', file: uploadedFile?.file };
        break;
      case 'url':
        inputData = { type: 'url', content: urlInput };
        break;
      default:
        return;
    }
    
    onAnalyze(inputData);
  };

  const isAnalyzeDisabled = () => {
    switch (activeTab) {
      case 'text':
        return !textInput.trim();
      case 'image':
        return !uploadedFile;
      case 'url':
        return !urlInput.trim();
      default:
        return true;
    }
  };

  return (
    <TabsContainer>
      <TabHeader>
        <TabButton
          active={activeTab === 'text'}
          onClick={() => setActiveTab('text')}
        >
          <FaFileAlt />
          Text Analysis
        </TabButton>
        <TabButton
          active={activeTab === 'image'}
          onClick={() => setActiveTab('image')}
        >
          <FaImage />
          Image Analysis
        </TabButton>
        <TabButton
          active={activeTab === 'url'}
          onClick={() => setActiveTab('url')}
        >
          <FaLink />
          URL Analysis
        </TabButton>
      </TabHeader>

      <TabContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'text' && (
              <TextInput
                placeholder="Paste or type the text you want to analyze for misinformation..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
            )}

            {activeTab === 'image' && (
              <div>
                <ImageUpload onClick={() => document.getElementById('file-upload').click()}>
                  <UploadIcon />
                  <UploadText>Click to upload an image</UploadText>
                  <UploadSubtext>Supports JPG, PNG, GIF up to 10MB</UploadSubtext>
                </ImageUpload>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
                
                {uploadedFile && (
                  <FilePreview>
                    <FaCheck style={{ color: '#4ecdc4', fontSize: '20px' }} />
                    <FileInfo>
                      <FileName>{uploadedFile.name}</FileName>
                      <FileSize>{uploadedFile.size}</FileSize>
                    </FileInfo>
                    <RemoveButton onClick={removeFile}>
                      <FaTimes />
                    </RemoveButton>
                  </FilePreview>
                )}
              </div>
            )}

            {activeTab === 'url' && (
              <URLInput
                type="url"
                placeholder="Enter a URL to analyze (news article, social media post, etc.)"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <AnalyzeButton
          onClick={handleAnalyze}
          disabled={isAnalyzeDisabled() || isLoading}
        >
          {isLoading ? 'Analyzing...' : '🔍 Analyze Content'}
        </AnalyzeButton>
      </TabContent>
    </TabsContainer>
  );
};

export default InputTabs;
