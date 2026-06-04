import React from 'react';
import {
  sidePanelStyle, panelHeader, feedItem, userRow, ratingStyle, commentStyle,
} from '../../styles/hubStyles';

const FEED_ITEMS = [
  { user: 'Lara',  rating: '★ 4',   comment: '"The twist in Scream 6 blew my mind!"' },
  { user: 'Fahed', rating: '★ 2.9', comment: '"I can\'t believe the ending of that movie it sucks"' },
  { user: 'Lilia', rating: '★ 4.5', comment: '"minecraft movie was AMAZINGG"' },
];

const CineSocialFeed = ({ feedItems = FEED_ITEMS, following = [], onToggleFollow }) => (
  <div style={sidePanelStyle}>
    <h4 style={panelHeader}>CINE-SOCIAL</h4>
    {feedItems.map(({ user, rating, comment }) => {
      const isFollowing = following.includes(user);
      return (
        <div key={user} style={feedItem}>
          <div style={userRow}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <b>{user}</b>
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
            </div>
            <span style={ratingStyle}>{rating}</span>
          </div>
          <p style={commentStyle}>{comment}</p>
        </div>
      );
    })}
  </div>
);

export default CineSocialFeed;
