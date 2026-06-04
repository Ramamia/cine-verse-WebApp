import React from 'react';
import { authInput } from '../../styles/componentStyles';

export default function NicknameInput({ nickname, setNickname }) {
  return (
    <div style={{ margin: '15px 0', width: '100%' }}>
      <label style={{
        display: 'block',
        color: '#ffdbac',
        fontSize: '0.75rem',
        letterSpacing: '2px',
        marginBottom: '8px',
        fontFamily: 'monospace',
        textAlign: 'left'
      }}>
        CHOOSE A NICKNAME
      </label>
      <input
        type="text"
        placeholder="ENTER NICKNAME"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        style={{
          ...authInput,
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid #333',
          padding: '12px',
          color: '#fff',
          fontSize: '0.85rem',
          borderRadius: '4px',
          width: '100%',
          boxSizing: 'border-box',
          outline: 'none',
          fontFamily: 'monospace',
          letterSpacing: '1px'
        }}
      />
    </div>
  );
}
