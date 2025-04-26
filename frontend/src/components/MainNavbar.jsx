import React from 'react';
import { useNavigationContext } from '../context/NavigationContext';
import { useUserContext } from '../context/UserContext';
import { useUIContext } from '../context/UIContext';
import MainNavLink from "./ui/MainNavLink";
import UserNavLink from "./ui/UserNavLink";

function MainNavbar() {
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

  const { user } = useUserContext();
  const { setShowModal } = useUIContext();

  return (
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
  );
}

export default MainNavbar;