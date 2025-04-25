import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthModal = ({ isVisible, hideModal }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginEmailError, setLoginEmailError] = useState('');
  const [loginPasswordError, setLoginPasswordError] = useState('');
  
  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupNameError, setSignupNameError] = useState('');
  const [signupEmailError, setSignupEmailError] = useState('');
  const [signupPasswordError, setSignupPasswordError] = useState('');
  
  // Email validation helper
  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  
  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginEmailError('');
    setLoginPasswordError('');
    
    // Validate inputs
    let isValid = true;
    
    if (!validateEmail(loginEmail)) {
      setLoginEmailError('Please enter a valid email address');
      isValid = false;
    }
    
    if (loginPassword.length < 1) {
      setLoginPasswordError('Password is required');
      isValid = false;
    }
    
    if (!isValid) return;
    
    // Attempt login with Supabase
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      
      if (error) throw error;
      
      // Login successful
      console.log('Login successful:', data);
      hideModal();
      
      // Redirect to dashboard or reload with new state
      window.location.href = '/dashboard';
      
    } catch (error) {
      console.error('Login error:', error.message);
      setLoginPasswordError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupNameError('');
    setSignupEmailError('');
    setSignupPasswordError('');
    
    // Validate inputs
    let isValid = true;
    
    if (signupName.length < 2) {
      setSignupNameError('Name is required');
      isValid = false;
    }
    
    if (!validateEmail(signupEmail)) {
      setSignupEmailError('Please enter a valid email address');
      isValid = false;
    }
    
    if (signupPassword.length < 8) {
      setSignupPasswordError('Password must be at least 8 characters');
      isValid = false;
    }
    
    if (!isValid) return;
    
    // Attempt signup with Supabase
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: { 
            full_name: signupName 
          }
        }
      });
      
      if (error) throw error;
      
      // Signup successful
      console.log('Signup successful:', data);
      supabase.from('weaknesses').insert([
        {
          weakness: []
        }
      ])
      
      // If signup requires email verification
      if (data.user && !data.session) {
        alert('Check your email for the confirmation link!');
        hideModal();
      } else {
        // Direct login after signup
        window.location.href = '/dashboard';
      }
      
    } catch (error) {
      console.error('Signup error:', error.message);
      setSignupEmailError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Close when clicking outside
  const handleOutsideClick = (e) => {
    if (e.target.className.includes('modal-overlay')) {
      hideModal();
    }
  };
  
  return (
    <div className={`fixed inset-0 bg-black/75 flex items-center justify-center z-10 transition-all duration-300 ${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={handleOutsideClick}>
      <div className="bg-subtle rounded-lg w-[400px] max-w-[90%] overflow-hidden transform transition-transform duration-300 ease-in-out" style={{ transform: isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
        <div className="p-6 border-b border-muted/10 flex justify-between items-center">
          <h3 className="text-xl font-semibold">Welcome to Code Forge</h3>
          <button className="bg-transparent border-none text-muted text-2xl cursor-pointer leading-none" onClick={hideModal}>&times;</button>
        </div>
        <div className="p-6">
          <div className="flex border-b border-muted/10 mb-6">
            <div 
              className={`py-3 px-4 text-sm font-medium cursor-pointer border-b-2 transition-colors ${activeTab === 'login' ? 'text-accent border-accent' : 'text-muted border-transparent'}`} 
              onClick={() => setActiveTab('login')}
            >
              Log In
            </div>
            <div 
              className={`py-3 px-4 text-sm font-medium cursor-pointer border-b-2 transition-colors ${activeTab === 'signup' ? 'text-accent border-accent' : 'text-muted border-transparent'}`} 
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </div>
          </div>
          
          <div>
            {/* Login Form */}
            <div className={activeTab === 'login' ? 'block' : 'hidden'} id="loginPane">
              <form id="loginForm" onSubmit={handleLogin}>
                <div className="mb-5">
                  <label className="form-label" htmlFor="loginEmail">Email</label>
                  <input 
                    type="email" 
                    id="loginEmail" 
                    className="form-input" 
                    placeholder="your@email.com" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                  {loginEmailError && (
                    <div className="form-error show">{loginEmailError}</div>
                  )}
                </div>
                <div className="mb-5">
                  <label className="form-label" htmlFor="loginPassword">Password</label>
                  <input 
                    type="password" 
                    id="loginPassword" 
                    className="form-input" 
                    placeholder="••••••••" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  {loginPasswordError && (
                    <div className="form-error show">{loginPasswordError}</div>
                  )}
                </div>
                <div className="mb-5">
                  <button type="submit" className="btn w-full py-3" disabled={loading}>
                    {loading ? 'Logging in...' : 'Log In'}
                  </button>
                </div>
              </form>
              <div className="text-center mt-6">
                <a href="#" className="auth-link">Forgot password?</a>
              </div>
            </div>
            
            {/* Signup Form */}
            <div className={activeTab === 'signup' ? 'block' : 'hidden'} id="signupPane">
              <form id="signupForm" onSubmit={handleSignup}>
                <div className="mb-5">
                  <label className="form-label" htmlFor="signupName">Full Name</label>
                  <input 
                    type="text" 
                    id="signupName" 
                    className="form-input" 
                    placeholder="John Doe" 
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                  {signupNameError && (
                    <div className="form-error show">{signupNameError}</div>
                  )}
                </div>
                <div className="mb-5">
                  <label className="form-label" htmlFor="signupEmail">Email</label>
                  <input 
                    type="email" 
                    id="signupEmail" 
                    className="form-input" 
                    placeholder="your@email.com" 
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                  {signupEmailError && (
                    <div className="form-error show">{signupEmailError}</div>
                  )}
                </div>
                <div className="mb-5">
                  <label className="form-label" htmlFor="signupPassword">Password</label>
                  <input 
                    type="password" 
                    id="signupPassword" 
                    className="form-input" 
                    placeholder="••••••••" 
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                  {signupPasswordError && (
                    <div className="form-error show">{signupPasswordError}</div>
                  )}
                </div>
                <div className="mb-5">
                  <button type="submit" className="btn w-full py-3" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </form>
              <div className="text-center mt-6">
                <p className="text-muted text-sm mb-2">
                  By signing up, you agree to our 
                  <a href="#" className="auth-link ml-1">Terms</a> and 
                  <a href="#" className="auth-link ml-1">Privacy Policy</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
