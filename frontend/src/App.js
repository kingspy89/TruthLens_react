import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Home from './pages/Home';
import Archive from './pages/Archive';
import Learn from './pages/Learn';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const MainContent = styled.main`
  padding-top: 80px;
  min-height: calc(100vh - 80px);
`;

function App() {
  return (
    <AppContainer>
      <Header />
      <MainContent>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </MainContent>
    </AppContainer>
  );
}

export default App;
