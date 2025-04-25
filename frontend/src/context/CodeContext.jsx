import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { supabase } from '../supabaseClient';
const CodeContext = createContext();

// Custom hook to use the CodeContext
export const useCodeContext = () => {
  const context = useContext(CodeContext);
  if (!context) {
    throw new Error('useCodeContext must be used within a CodeProvider');
  }
  return context;
};

// Provider component
export const CodeProvider = ({ children }) => {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadQuestion = async (questionId) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('id', questionId)
        .single();
  
      if (error) throw error;
      if (!data) throw new Error('Question not found');
  
      setQuestion(data);
      return data;
    } catch (err) {
      setError(err.message || "Failed to load question");
      console.error("Error loading question:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    question,
    setQuestion,
    loading,
    error,
    loadQuestion
  };

  return <CodeContext.Provider value={value}>{children}</CodeContext.Provider>;
};