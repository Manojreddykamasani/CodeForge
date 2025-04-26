import React, { createContext, use, useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserContext } from './UserContext';
import { supabase } from '../supabaseClient';
import LoadingOverlay from '../components/LoadingOverlay';
import axios from 'axios';
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
  const [isNavigating, setIsNavigating] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { logout,user } = useUserContext();
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
  const goToCodingPlayground = async (topic) => {
    setIsNavigating(true);
    const TIMEOUT = 50000; // Timeout duration in milliseconds (50 seconds)
    
    try {
      // First, try to get the latest question for the topic
      const { data: existingQuestion, error: fetchError } = await supabase
        .from("questions")
        .select("id")
        .eq("user_id", user.id)
        .eq("topic", topic)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
  
      if (existingQuestion && !fetchError) {
        // If question exists, navigate to it
        return navigate(`/codingplayground/${existingQuestion.id}`);
      }
  
      // If no question exists, generate a new one
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout: API call exceeded time limit.")), TIMEOUT)
      );
  
      const apiCallPromise = axios.post("https://codeforge-4k0k.onrender.com/generate/first", {
        topic: topic,
        user_id: user.id,
      });
  
      const response = await Promise.race([apiCallPromise, timeoutPromise]);
  
      // Now we expect the response to contain the question data WITH the id
      if (response?.data?.id) {
        // Navigate directly using the ID from the response
        navigate(`/codingplayground/${response.data.id}`);
      } else {
        console.error("API response missing ID:", response?.data);
        alert("Question was generated but we couldn't get its ID. Please try again.");
      }
    } catch (error) {
      console.error("Error in goToCodingPlayground:", error);
      alert(error.message || "Failed to fetch or generate the question. Please try again.");
    }
    finally{
      setIsNavigating(false);
    }
  };
  
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
    handleLogout,
    isNavigating
  };

  return <NavigationContext.Provider value={value}>
    {children}
    <LoadingOverlay isLoading={isNavigating} />
  </NavigationContext.Provider>;
};