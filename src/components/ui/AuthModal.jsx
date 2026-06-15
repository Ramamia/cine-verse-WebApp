import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  authOverlay, authGlassPanel, authToggleContainer, authSwitchBtn,
  authTitle, authSubtitle, authInput, authActionBtn,
} from '../../styles/componentStyles';
import { api } from '../../services/api';

const THEME_RED = '#760707';

const AuthModal = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setErrorMsg('');
    
    if (!email || !password || (!isLogin && !nickname)) {
      setErrorMsg('PLEASE FILL IN ALL CREDENTIALS.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('INVALID EMAIL FORMAT DETECTED.');
      return;
    }

    if (!isLogin) {
      // Frontend security for signup
      if (password.length < 8) {
        setErrorMsg('PASSWORD MUST BE AT LEAST 8 CHARACTERS.');
        return;
      }
      if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        setErrorMsg('PASSWORD MUST CONTAIN AT LEAST ONE UPPERCASE LETTER AND ONE NUMBER.');
        return;
      }
    }

    setIsLoading(true);
    try {
      let data;
      if (isLogin) {
        data = await api.login(email, password);
      } else {
        data = await api.register(email, password, nickname);
      }
      
      if (data.token) {
        localStorage.setItem('cineverse_token', data.token);
      }
      onLogin(data.user);
    } catch (err) {
      setErrorMsg(err.message.toUpperCase());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={authOverlay}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={authGlassPanel}
      >
        {/* Toggle */}
        <div style={authToggleContainer}>
          {[['LOGIN', true], ['SIGN UP', false]].map(([label, val]) => (
            <div
              key={label}
              onClick={() => setIsLogin(val)}
              style={{
                ...authSwitchBtn,
                color: isLogin === val ? '#fff' : '#555',
                borderBottom: isLogin === val ? `2px solid ${THEME_RED}` : '2px solid transparent',
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Heading */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={authTitle}>
            {isLogin ? 'ACCESS TERMINAL' : 'INITIALIZE IDENTITY'}
          </h2>
          <p style={authSubtitle}>
            {isLogin
              ? "Welcome back. Let's access your profile."
              : "The curtains are rising. Let's start your journey."}
          </p>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div style={{
            color: '#ff4b4b',
            background: 'rgba(118, 7, 7, 0.2)',
            border: '1px solid #760707',
            padding: '10px',
            marginBottom: '15px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '11px',
            letterSpacing: '1px',
            textAlign: 'center'
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Fields */}
        <div style={{ width: '100%' }}>
          {!isLogin && (
            <input
              type="text"
              placeholder="NICKNAME"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              style={authInput}
              required
            />
          )}
          <input
            type="email"
            placeholder="EMAIL ADDRESS"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={authInput}
            required
          />
          <input
            type="password"
            placeholder="PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={authInput}
            required
          />
        </div>

        {/* CTA */}
        <button 
          onClick={handleSubmit} 
          disabled={isLoading}
          style={{ 
            ...authActionBtn, 
            backgroundColor: THEME_RED,
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'PROCESSING...' : (isLogin ? 'RESUME EXPERIENCE' : 'TAKE YOUR SEAT')}
        </button>
      </motion.div>
    </div>
  );
};

export default AuthModal;
