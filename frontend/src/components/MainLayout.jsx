import React from "react";
import MainNavLink from "./ui/MainNavLink";
import UserNavLink from "./ui/UserNavLink";
import { useUserContext } from '../context/UserContext';
import { useNavigationContext } from "../context/NavigationContext";
import { useUIContext } from "../context/UIContext";

const MainLayout = ({ children }) => {
  const { user } = useUserContext();
  
  // Navigation context and UI context
  const { 
    activeTab,
    goToHome, 
    goToDashboard, 
    goToPractice, 
    goToContests, 
    goToAbout,
    goToProfile,
    goToSettings,
    handleLogout
  } = useNavigationContext();
  
  const { setShowModal } = useUIContext();

  return (
    <div className="min-h-screen flex flex-col bg-zinc-900 text-gray-200">
      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 bg-zinc-950 border-b border-zinc-800 px-6 py-3 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-xl font-bold text-violet-500">
            <span className="text-2xl">⚡</span>
            CodeForge
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <MainNavLink active={activeTab === "home"} onClick={goToHome}>Home</MainNavLink>
            <MainNavLink active={activeTab === "dashboard"} onClick={goToDashboard}>Dashboard</MainNavLink>
            <MainNavLink active={activeTab === "practice"} onClick={goToPractice}>Practice</MainNavLink>
            <MainNavLink active={activeTab === "contests"} onClick={goToContests}>Contests</MainNavLink>
            <MainNavLink active={activeTab === "about"} onClick={goToAbout}>About</MainNavLink>
          </div>
        </div>
        
        <div className="flex items-center gap-5">
          <div className="hidden md:flex items-center gap-5">
            
            <UserNavLink onClick={handleLogout}>
              <span className="text-lg">🚪</span>
              Logout
            </UserNavLink>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-r from-violet-500 to-emerald-500 text-white font-semibold text-sm shadow-lg shadow-purple-500/20"
          >
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </button>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-800 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <span className="text-2xl">⚡</span>
            <span className="font-bold text-violet-500">CodeForge</span>
          </div>
          
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} CodeForge. All rights reserved.
          </div>
          
          <div className="flex gap-4 mt-4 md:mt-0">
            <button 
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms
            </button>
            <button 
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy
            </button>
            <button 
              className="text-gray-400 hover:text-white transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;