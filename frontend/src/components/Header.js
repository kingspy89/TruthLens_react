import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import toast from 'react-hot-toast';
import {
  FaShieldAlt,
  FaBars,
  FaTimes,
  FaHome,
  FaArchive,
  FaGraduationCap,
  FaChartBar,
  FaSignOutAlt
} from 'react-icons/fa';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0 20px;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: white;
  font-size: 24px;
  font-weight: 700;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const LogoIcon = styled(FaShieldAlt)`
  font-size: 32px;
  color: #4ecdc4;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 32px;
  align-items: center;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    flex-direction: column;
    padding: 20px;
    gap: 20px;
    border-radius: 0 0 20px 20px;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: ${props => props.isActive ? '#4ecdc4' : 'white'};
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: ${props => props.isActive ? '100%' : '0'};
    height: 2px;
    background: #4ecdc4;
    transition: width 0.3s ease;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;

  @media (max-width: 768px) {
    display: block;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  color: white;
`;

const UserName = styled.span`
  font-weight: 500;
`;

const SignOutButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  const navItems = [
    { path: '/home', label: 'Home', icon: FaHome },
    { path: '/archive', label: 'Archive', icon: FaArchive },
    { path: '/learn', label: 'Learn', icon: FaGraduationCap },
    { path: '/dashboard', label: 'Dashboard', icon: FaChartBar },
  ];

  return (
    <HeaderContainer>
      <Nav>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Logo to="/">
            <LogoIcon />
            TruthLens
          </Logo>
        </motion.div>

        <NavLinks isOpen={isMenuOpen}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <NavLink
                  to={item.path}
                  isActive={location.pathname === item.path}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon />
                  {item.label}
                </NavLink>
              </motion.div>
            );
          })}
        </NavLinks>

        <MobileMenuButton onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuButton>
        {user && (
          <UserSection>
            <UserName>{user.displayName}</UserName>
            <SignOutButton onClick={handleSignOut}>
              <FaSignOutAlt />
              Sign Out
            </SignOutButton>
          </UserSection>
        )}
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
