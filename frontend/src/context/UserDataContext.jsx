import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    username: "coder123",
    email: "coder123@example.com",
    topics: [],
    history: [],
    recommendedProblems: [
      { id: 1, title: "Binary Tree Level Order Traversal", difficulty: "Medium", topic: "Trees", matchScore: 95 },
      { id: 2, title: "Merge Intervals", difficulty: "Medium", topic: "Arrays", matchScore: 90 },
      { id: 3, title: "Course Schedule", difficulty: "Medium", topic: "Graphs", matchScore: 85 }
    ]
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser(); // Get the currently authenticated user
      if (!user) {
        console.error("No user is authenticated");
        return;
      }
      const user_id = user.id; // Get the user_id dynamically

      // Fetch topics and XP
      const { data: topicsData, error: topicError } = await supabase
        .from("submissions")
        .select("xp, questions(topic)")
        .eq("user_id", user_id);

      const topicXpMap = {};
      topicsData?.forEach(({ xp, questions }) => {
        const topic = questions?.topic || "Unknown";
        if (!topicXpMap[topic]) topicXpMap[topic] = 0;
        topicXpMap[topic] += xp;
      });

      const formattedTopics = Object.entries(topicXpMap).map(([name, xp]) => ({
        name,
        xp,
      }));

      // Fetch assigned questions
      const { data: assignedQuestions, error: questionError } = await supabase
        .from("questions")
        .select("id, title, topic")
        .eq("user_id", user_id);

      // Fetch user's completed submissions
      const { data: submittedQuestions, error: subError } = await supabase
        .from("submissions")
        .select("question_id")
        .eq("user_id", user_id);

      const completedSet = new Set(submittedQuestions?.map((s) => s.question_id));

      // Include question_id in the history
      const formattedHistory = (assignedQuestions?.map((q) => ({
        id: q.id,  // Adding question_id here
        title: q.title,
        topic: q.topic,
        status: completedSet.has(q.id) ? "Completed" : "In Progress"
      })) || []).reverse();

      if (topicError || questionError || subError) {
        console.error("Error loading user data:", topicError || questionError || subError);
        return;
      }

      setUserData((prev) => ({
        ...prev,
        topics: formattedTopics,
        history: formattedHistory
      }));
    };

    fetchUserData();
  }, []);

  return (
    <UserDataContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserDataContext = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserDataContext must be used within a UserDataProvider');
  }
  return context;
};
