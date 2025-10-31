import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import toast from 'react-hot-toast';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 2rem;
`;

const LoginButton = styled.button`
  background: #4285f4;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  transition: background-color 0.3s;

  &:hover {
    background: #3367d6;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const GoogleIcon = styled.span`
  font-size: 20px;
`;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      toast.success(`Welcome, ${user.displayName}!`);
      navigate('/home'); // Redirect to home after login
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast.error('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>Welcome to TruthLens</Title>
        <Subtitle>Sign in with Google to access the platform</Subtitle>
        <LoginButton onClick={handleGoogleSignIn} disabled={loading}>
          <GoogleIcon>🔵</GoogleIcon>
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </LoginButton>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
