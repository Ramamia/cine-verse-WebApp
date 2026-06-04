import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  authOverlay, authGlassPanel, authToggleContainer, authSwitchBtn,
  authTitle, authSubtitle, authInput, authActionBtn,
} from '../../styles/componentStyles';

const THEME_RED = '#760707';

const AuthModal = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (!email || !password) {
      alert('Please fill in all credentials.');
      return;
    }
    // Simple email validation regex
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    onLogin({ email, password, isLogin });
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

        {/* Fields */}
        <div style={{ width: '100%' }}>
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
        <button onClick={handleSubmit} style={{ ...authActionBtn, backgroundColor: THEME_RED }}>
          {isLogin ? 'RESUME EXPERIENCE' : 'TAKE YOUR SEAT'}
        </button>
      </motion.div>
    </div>
  );
};

export default AuthModal;
