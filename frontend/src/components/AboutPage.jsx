import React, { useEffect } from "react";
import { useNavigationContext } from "../context/NavigationContext";
import MainNavbar from "./MainNavbar";

function AboutPage() {
  const { setActiveTab } = useNavigationContext();
  
  useEffect(() => {
    setActiveTab("about");
  }, [setActiveTab]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-900 text-gray-200">
      <MainNavbar />
      
      <main className="flex-1 p-8 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl font-bold text-white mb-8">About CodeForge</h1>
        
        <div className="space-y-10">
          {/* Mission Section */}
          <section className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
            <h2 className="text-2xl font-semibold text-violet-400 mb-4">Our Mission</h2>
            <p className="text-gray-300 mb-4">
              CodeForge was built with a simple but powerful mission: to help developers of all levels master programming 
              through deliberate practice and friendly competition.
            </p>
            <p className="text-gray-300">
              We believe that the best way to improve coding skills is through consistent practice, 
              challenging yourself with increasingly difficult problems, and learning from others.
            </p>
          </section>
          
          {/* Features Section */}
          <section className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
            <h2 className="text-2xl font-semibold text-violet-400 mb-4">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureCard 
                icon="🎯" 
                title="Targeted Practice" 
                description="Handcrafted problems designed to strengthen specific skills and concepts."
              />
              <FeatureCard 
                icon="🏆" 
                title="Competitions" 
                description="Regular contests to test your skills against others and learn new approaches."
              />
              <FeatureCard 
                icon="📊" 
                title="Progress Tracking" 
                description="Detailed analytics to visualize your improvement over time." 
              />
              <FeatureCard 
                icon="👥" 
                title="Community Learning" 
                description="See solutions from other coders and learn different ways to solve problems."
              />
            </div>
          </section>
          
          {/* How It Works */}
          <section className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
            <h2 className="text-2xl font-semibold text-violet-400 mb-4">How It Works</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-300 text-lg font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white mb-2">Select a Problem</h3>
                  <p className="text-gray-300">
                    Choose from our extensive library of problems, filtered by difficulty, category, 
                    or skills you want to improve.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-300 text-lg font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white mb-2">Solve in Our IDE</h3>
                  <p className="text-gray-300">
                    Write your solution in our integrated development environment with 
                    syntax highlighting, autocompletion, and real-time test execution.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-300 text-lg font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white mb-2">Submit and Learn</h3>
                  <p className="text-gray-300">
                    Get instant feedback on your solution, including time and space complexity analysis.
                    Compare your approach with others to learn new techniques.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-300 text-lg font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white mb-2">Track Your Progress</h3>
                  <p className="text-gray-300">
                    Watch your skills improve over time with detailed analytics and visualizations
                    of your progress across different problem categories.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Team Section */}
<section className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
  <h2 className="text-2xl font-semibold text-violet-400 mb-4">Our Team</h2>
  <p className="text-gray-300 mb-6">
    CodeForge was created by a team of passionate developers who believe in the power 
    of deliberate practice and continuous learning.
  </p>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <TeamMemberCard 
      name="Manoj Reddy" 
      role="Full-stack  Developer & Team Lead"
      bio=" Leads the technical architecture and team coordination."
    />
    <TeamMemberCard 
      name="Sreenidhi Reddy" 
      role="Frontend Developer"
      bio="Specializes in React and modern JavaScript frameworks. Focused on creating responsive and accessible user interfaces."
    />
    <TeamMemberCard 
      name="Divija Reddy" 
      role="Frontend Developer"
      bio="UI/UX enthusiast with a keen eye for design details. Implements pixel-perfect interfaces with optimized performance."
    />
    <TeamMemberCard 
      name="Mahindra Reddy" 
      role="Frontend Developer"
      bio="Full-stack leaning frontend developer who bridges the gap between design and implementation with clean component architecture."
    />
  </div>
</section>
          
          {/* Contact Section */}
          <section className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
            <h2 className="text-2xl font-semibold text-violet-400 mb-4">Contact Us</h2>
            <p className="text-gray-300 mb-4">
              Have questions, suggestions, or feedback? We'd love to hear from you!
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <a 
                href="mailto:support@codeforge.dev" 
                className="px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-md flex items-center justify-center gap-2 transition-colors"
              >
                <span className="text-lg">✉️</span>
                Email Us
              </a>
              <a 
                href="https://github.com/codeforge" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-5 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-md flex items-center justify-center gap-2 transition-colors"
              >
                <span className="text-lg">⭐</span>
                GitHub
              </a>
              <a 
                href="https://twitter.com/codeforge" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-5 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-md flex items-center justify-center gap-2 transition-colors"
              >
                <span className="text-lg">🐦</span>
                Twitter
              </a>
            </div>
          </section>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-800 py-6 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 text-xl font-bold text-violet-500 mb-4 md:mb-0">
            <span className="text-2xl">⚡</span>
            CodeForge
          </div>
          <div className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} CodeForge. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature card component
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-zinc-800 rounded-lg p-5 border border-zinc-700 hover:border-violet-500/50 transition-colors">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}

// Team member card component
function TeamMemberCard({ name, role, bio }) {
  // Create initials from name
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('');
    
  return (
    <div className="bg-zinc-800 rounded-lg p-5 border border-zinc-700">
      <div className="h-16 w-16 rounded-full bg-gradient-to-r from-violet-500 to-emerald-500 flex items-center justify-center text-white text-xl font-bold mb-4">
        {initials}
      </div>
      <h3 className="text-lg font-semibold text-white">{name}</h3>
      <p className="text-violet-400 text-sm mb-3">{role}</p>
      <p className="text-gray-400 text-sm">{bio}</p>
    </div>
  );
}

export default AboutPage;