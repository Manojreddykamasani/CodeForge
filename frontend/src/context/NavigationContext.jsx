import React, { createContext, use, useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserContext } from './UserContext';
import { useCodeContext } from './CodeContext';
// Create the context
const NavigationContext = createContext();
// Custom hook to use the NavigationContext
export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  return context;
};

// Provider component
export const NavigationProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useUserContext();
  const { loadQuestion } = useCodeContext();
  // Determine active tab based on current path
  const getActiveTabFromPath = (path) => {
    if (path === '/') return 'home';
    if (path === '/dashboard') return 'dashboard';
    if (path === '/practice') return 'practice';
    if (path === '/contests') return 'contests';
    if (path === '/about') return 'about';
    if (path === '/profile') return 'profile';
    if (path === '/settings') return 'settings';
    return '';
  };
  
  const [activeTab, setActiveTab] = useState(getActiveTabFromPath(location.pathname));
  
  // Update active tab when location changes
  React.useEffect(() => {
    const currentTab = getActiveTabFromPath(location.pathname);
    if (currentTab) {
      setActiveTab(currentTab);
    }
  }, [location.pathname]);
  
  // Navigation helpers
  const goToHome = () => navigate('/');
  const goToDashboard = () => navigate('/dashboard');
  const goToPractice = () => navigate('/practice');
  const goToContests = () => navigate('/contests');
  const goToAbout = () => navigate('/about');
  const goToProfile = () => navigate('/profile');
  const goToSettings = () => navigate('/settings');
  const goToCodingPlayground = (id)=>
    { loadQuestion(id)
      navigate('/codingplayground')}
  
  // Handle logout
  const handleLogout = async () => {
    const { success, error } = await logout();
    if (success) {
      navigate('/login');
    } else {
      console.error('Logout failed:', error);
    }
  };
  
  const value = {
    activeTab,
    setActiveTab,
    navigate,
    goToHome,
    goToDashboard,
    goToPractice,
    goToContests,
    goToAbout,
    goToProfile,
    goToSettings,
    goToCodingPlayground,
    handleLogout
  };

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};