import React, { useState, useEffect } from "react";
import MainLayout from "./MainLayout";
import TopicCard from "./ui/TopicCard";
import FeaturedCard from "./ui/FeaturedCard";
import { useUserContext } from "../context/UserContext";
import { useNavigationContext } from "../context/NavigationContext";
import { useUIContext } from "../context/UIContext";
// Home Content Component
const HomeContent = () => {
  const { user } = useUserContext();
  const { goToCodingPlayground, isNavigating
  } = useNavigationContext();
  const handleTopicClick = (topic) => {
    if (!isNavigating) {
      goToCodingPlayground(topic);
    }
  };
  
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <section className="text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-violet-500 to-emerald-500 text-transparent bg-clip-text">
          Master DSA Like a Superhuman
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Welcome back, {user?.email}! Elevate your algorithmic thinking and problem-solving skills with our interactive learning platform.
        </p>
      </section>
      
      {/* Featured Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Topics</h2>
          <a href="#" className="text-violet-400 hover:text-violet-300 text-sm font-medium flex items-center gap-1">
            View all topics <span>→</span>
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Featured cards */}
          <button onClick={() => handleTopicClick("Arrays")}
      disabled={isNavigating}
      className={isNavigating ? "opacity-50 cursor-not-allowed" : ""}>
          <FeaturedCard 
            icon="🚀" 
            title="Getting Started with DSA" 
            color="from-blue-500 to-violet-500"
          />
          </button>
          <FeaturedCard 
            icon="🏆" 
            title="Competitive Programming" 
            color="from-purple-500 to-pink-500"
          />
          <FeaturedCard 
            icon="💼" 
            title="Interview Preparation" 
            color="from-orange-500 to-red-500"
          />
          <FeaturedCard 
            icon="🧠" 
            title="System Design" 
            color="from-emerald-500 to-teal-500"
          />
        </div>
      </section>
      
      {/* Topic Categories */}
      <section className="mb-8">
  <h2 className="text-2xl font-bold mb-6">Core DSA Topics</h2>
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
    <button onClick={() => handleTopicClick("Arrays")}
      disabled={isNavigating}
      className={isNavigating ? "opacity-50 cursor-not-allowed" : ""}>
      <TopicCard 
        icon="📊" 
        title="Arrays" 
        description="Master linear data structures and character manipulation" 
      />
    </button>
    <button onClick={() => handleTopicClick("Linkedlists")}
      disabled={isNavigating}
      className={isNavigating ? "opacity-50 cursor-not-allowed" : ""}>
      <TopicCard 
        icon="🔗" 
        title="Linkedlists" 
        description="Understand node-based data structures and pointer logic" 
      />
    </button>
    <button onClick={() => handleTopicClick("Trees")}
      disabled={isNavigating}
      className={isNavigating ? "opacity-50 cursor-not-allowed" : ""}>
      <TopicCard 
        icon="🌳" 
        title="Trees" 
        description="Dive into hierarchical structures and traversals" 
      />
    </button>
    <button onClick={() => handleTopicClick("Graphs")}
      disabled={isNavigating}
      className={isNavigating ? "opacity-50 cursor-not-allowed" : ""}>
      <TopicCard 
        icon="🌐" 
        title="Graphs" 
        description="Solve problems involving networks and connectivity" 
      />
    </button>
    <button onClick={() => handleTopicClick("Dynamic Programming")}
      disabled={isNavigating}
      className={isNavigating ? "opacity-50 cursor-not-allowed" : ""}>
      <TopicCard 
        icon="⚡" 
        title="Dp" 
        description="Optimize problems using dynamic programming techniques" 
      />
    </button>
    <button onClick={() => handleTopicClick("Searching")}
      disabled={isNavigating}
      className={isNavigating ? "opacity-50 cursor-not-allowed" : ""}>
      <TopicCard 
        icon="🔍" 
        title="Searching" 
        description="Explore efficient element search methods" 
      />
    </button>
    <button onClick={() => handleTopicClick("Sorting")}
      disabled={isNavigating}
      className={isNavigating ? "opacity-50 cursor-not-allowed" : ""}>
      <TopicCard 
        icon="🔀" 
        title="Sorting" 
        description="Understand algorithms to order data efficiently" 
      />
    </button>
    <button onClick={() => handleTopicClick("Recursion")}
      disabled={isNavigating}
      className={isNavigating ? "opacity-50 cursor-not-allowed" : ""}>
      <TopicCard 
        icon="🧩" 
        title="Recursion" 
        description="Solve problems using self-calling functions" 
      />
    </button>
  </div>
</section>


    </div>
  );
};

// About Content Component 
const AboutContent = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-6">About CodeForge</h1>
      
      <div className="bg-zinc-800 rounded-xl p-8 border border-zinc-700/50 mb-8">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-gray-300 mb-6">
          At CodeForge, we believe that mastering data structures and algorithms should be accessible to everyone. 
          Our platform is designed to provide a structured learning path for developers of all levels, from beginners 
          to advanced coders preparing for technical interviews at top tech companies.
        </p>
        <p className="text-gray-300">
          We're committed to creating an engaging, interactive experience that makes learning DSA not just effective, 
          but also enjoyable. Our team consists of experienced developers, educators, and competitive programmers who 
          are passionate about helping others succeed in their coding journey.
        </p>
      </div>
    </div>
  );
};

// Settings Content Component
const SettingsContent = () => {
  const { user } = useUserContext();
  const { notifications, toggleNotification, theme, toggleTheme } = useUIContext();
  
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="bg-zinc-800 rounded-xl border border-zinc-700/50 overflow-hidden">
        <div className="p-6 border-b border-zinc-700/50">
          <h2 className="text-xl font-bold mb-4">Account Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Display Name</label>
              <input 
                type="text" 
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-md p-3 text-white focus:outline-none focus:border-violet-500" 
                defaultValue={user?.email?.split('@')[0]}
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email Address</label>
              <input 
                type="email" 
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-md p-3 text-white focus:outline-none focus:border-violet-500" 
                defaultValue={user?.email}
                readOnly
              />
            </div>
          </div>
        </div>
        
        <div className="p-6 border-b border-zinc-700/50">
          <h2 className="text-xl font-bold mb-4">Appearance</h2>
          
          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <div 
              className={`w-12 h-6 rounded-full relative cursor-pointer ${theme === 'dark' ? 'bg-violet-600' : 'bg-zinc-700'}`}
              onClick={toggleTheme}
            >
              <div className={`absolute top-1 bg-white rounded-full w-4 h-4 transition-all ${theme === 'dark' ? 'right-1' : 'left-1'}`}></div>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-b border-zinc-700/50">
          <h2 className="text-xl font-bold mb-4">Notifications</h2>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <div 
                className={`w-12 h-6 rounded-full relative cursor-pointer ${notifications.email ? 'bg-violet-600' : 'bg-zinc-700'}`}
                onClick={() => toggleNotification('email')}
              >
                <div className={`absolute top-1 bg-white rounded-full w-4 h-4 transition-all ${notifications.email ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Push Notifications</span>
              <div 
                className={`w-12 h-6 rounded-full relative cursor-pointer ${notifications.push ? 'bg-violet-600' : 'bg-zinc-700'}`}
                onClick={() => toggleNotification('push')}
              >
                <div className={`absolute top-1 bg-white rounded-full w-4 h-4 transition-all ${notifications.push ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <button className="bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// Main HomePage Component
function HomePage({ initialActiveTab = "home" }) {
  const [loading, setLoading] = useState(true);
  
  // Use contexts
  const { navigate } = useNavigationContext();
  const { user } = useUserContext();
  const { activeTab, setActiveTab } = useUIContext();
  
  // Set initial active tab from props via context
  useEffect(() => {
    setActiveTab(initialActiveTab);
  }, [initialActiveTab, setActiveTab]);
  
  // Check authentication status on component mount
  useEffect(() => {
    // Auto-redirect to login if not authenticated
    if (!user && !loading) {
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [user, navigate, loading]);
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-violet-500 border-r-violet-500 border-b-violet-500 border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Auth check fallback
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Authentication Required</h1>
          <p className="text-gray-300 mb-6">Please log in to access this page.</p>
          <button 
            onClick={() => navigate("/login")}
            className="bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-6 rounded-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <MainLayout>
      {activeTab === "home" && <HomeContent />}
      {activeTab === "about" && <AboutContent />}
      {activeTab === "settings" && <SettingsContent />}
    </MainLayout>
  );
}

export default HomePage;