import React, { useState } from 'react';
import {
  sidePanelStyle, panelHeader, feedItem, userRow, ratingStyle, commentStyle,
} from '../../styles/hubStyles';

const FEED_ITEMS = [
  { user: 'Lara', rating: '★ 4', comment: '"The twist in Scream 6 blew my mind!"' },
  { user: 'Fahed', rating: '★ 2.9', comment: '"I can\'t believe the ending of that movie it sucks"' },
  { user: 'Lilia', rating: '★ 4.5', comment: '"minecraft movie was AMAZINGG"' },
];

const CineSocialFeed = ({ feedItems = FEED_ITEMS, following = [], onToggleFollow, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        ...sidePanelStyle,
        display: 'flex',
        flexDirection: 'column',
        transform: isOpen ? 'translateY(-50%)' : 'translateY(-50%) translateX(calc(-100% - 20px))',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <style>{`
        .feed-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .feed-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        .feed-scrollbar::-webkit-scrollbar-thumb {
          background: #760707;
          border-radius: 2px;
        }
        .feed-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a50f0f;
        }
        .social-toggle-btn:hover {
          background: #760707 !important;
          box-shadow: 0 0 15px rgba(118, 7, 7, 0.8) !important;
          color: #fff !important;
        }
      `}</style>

      {/* Toggle Drawer Button sticking out to the right */}
      <button
        className="social-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'absolute',
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '32px',
          height: '90px',
          background: 'rgba(10, 0, 0, 0.75)',
          backdropFilter: 'blur(10px)',
          border: '1px solid #760707',
          borderLeft: 'none',
          borderTopRightRadius: '6px',
          borderBottomRightRadius: '6px',
          color: '#ff4b4b',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px',
          boxShadow: '4px 0 15px rgba(0, 0, 0, 0.6)',
          zIndex: 110,
          fontFamily: 'monospace',
          fontSize: '10px',
          fontWeight: 'bold',
          letterSpacing: '1px',
          transition: 'all 0.3s ease',
        }}
      >
        <span style={{ fontSize: '13px', lineHeight: 1 }}></span>
        <span style={{ writingMode: 'vertical-lr', textOrientation: 'mixed', letterSpacing: '1px' }}>
          {isOpen ? 'CLOSE ◀' : 'SOCIAL ▶'}
        </span>
      </button>

      <h4 style={panelHeader}>CINE-SOCIAL</h4>
      <div className="feed-scrollbar" style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
        {feedItems.map(({ user, rating, comment }) => {
          const isFollowing = following.includes(user);
          const isCurrentUser = user && currentUser && user.toLowerCase() === currentUser.toLowerCase();
          return (
            <div key={user} style={feedItem}>
              <div style={userRow}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <b>{user}</b>
                  {!isCurrentUser && (
                    <button
                      onClick={() => onToggleFollow && onToggleFollow(user)}
                      style={{
                        background: isFollowing ? 'rgba(255, 255, 255, 0.1)' : 'rgba(203, 24, 108, 0.15)',
                        border: isFollowing ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(203, 24, 108, 0.5)',
                        borderRadius: '3px',
                        color: isFollowing ? '#aaa' : '#cb186c',
                        fontSize: '0.6rem',
                        padding: '2px 6px',
                        cursor: 'pointer',
                        fontFamily: 'monospace',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {isFollowing ? 'FOLLOWING' : 'FOLLOW'}
                    </button>
                  )}
                </div>
                <span style={ratingStyle}>{rating}</span>
              </div>
              <p style={commentStyle}>{comment}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CineSocialFeed;
