import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import PracticePage from "./components/PracticePage";
import AboutPage from "./components/AboutPage";
import ContestsPage from "./components/ContestsPage";
import Dashboard from "./components/Dashboard";
import SolutionPage from "./components/SolutionPage";
import { supabase } from "./supabaseClient";
import CodingChallenge from "./components/CodingChallenge";
import { CodeProvider } from "./context/CodeContext";
import { UserProvider } from "./context/UserContext";
import { NavigationProvider } from "./context/NavigationContext";
import { ProblemProvider } from "./context/ProblemContext";
import { UIProvider } from "./context/UIContext";
import { UserDataProvider } from "./context/UserDataContext";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);

      const loggedInFromStorage = localStorage.getItem("isLoggedIn") === "true";
      setIsAuthenticated(loggedInFromStorage);

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const isLoggedIn = !!session;

        console.log("Supabase session:", session);

        if (isLoggedIn) {
          localStorage.setItem("isLoggedIn", "true");
        } else {
          localStorage.removeItem("isLoggedIn");
        }

        setIsAuthenticated(isLoggedIn);
      } catch (error) {
        console.error("Error checking auth:", error);
        localStorage.removeItem("isLoggedIn");
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event, session);
      if (event === "SIGNED_IN") {
        localStorage.setItem("isLoggedIn", "true");
        setIsAuthenticated(true);
      } else if (event === "SIGNED_OUT") {
        localStorage.removeItem("isLoggedIn");
        setIsAuthenticated(false);
      }
    });

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" />;
    return children;
  };

  const AuthRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>;
    if (isAuthenticated) return <Navigate to="/home" />;
    return children;
  };

  return (
    <Router>
      <UserProvider>
        <NavigationProvider>
          <ProblemProvider>
            <UIProvider>
              <UserDataProvider>
                <Routes>
                  {/* Redirect "/" based on auth state */}
                  <Route
                    path="/"
                    element={
                      loading ? (
                        <div>Loading...</div>
                      ) : isAuthenticated ? (
                        <Navigate to="/home" />
                      ) : (
                        <LandingPage />
                      )
                    }
                  />

                  {/* Auth route for login */}
                  <Route
                    path="/login"
                    element={
                      <AuthRoute>
                        <LoginPage />
                      </AuthRoute>
                    }
                  />

                  {/* Protected routes */}
                  <Route
                    path="/home"
                    element={
                      <ProtectedRoute>
                        <HomePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/codingplayground"
                    element={
                      <ProtectedRoute>
                            <CodeProvider>

                          <CodingChallenge />
                          </CodeProvider>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/practice"
                    element={
                      <ProtectedRoute>
                        <PracticePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/solution/:id"
                    element={
                      <ProtectedRoute>
                        <SolutionPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/contests"
                    element={
                      <ProtectedRoute>
                        <ContestsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/about"
                    element={
                      <ProtectedRoute>
                        <AboutPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback route */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </UserDataProvider>
            </UIProvider>
          </ProblemProvider>
        </NavigationProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
