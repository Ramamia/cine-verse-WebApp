import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function MovieDetailPopup({ movie, user, setUser, onClose, onAddReview, followedFriends = [], genre = 'horror' }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedFriend, setSelectedFriend] = useState('');
  const [recommendationMessage, setRecommendationMessage] = useState('');

  if (!movie) return null;

  const isFavorite = user.topMovies?.some(m => m.id === movie.id);

  const handleToggleFavorite = () => {
    const currentFavorites = user.topMovies || [];
    if (isFavorite) {
      setUser(prev => ({
        ...prev,
        topMovies: currentFavorites.filter(m => m.id !== movie.id)
      }));
    } else {
      if (currentFavorites.length >= 5) {
        alert('You can only select up to 5 favorite movies in your profile.');
        return;
      }
      setUser(prev => ({
        ...prev,
        topMovies: [...currentFavorites, {
          id: movie.id,
          title: movie.title,
          year: movie.year,
          poster: movie.poster
        }]
      }));
    }
  };

  const handleRecommend = (e) => {
    e.preventDefault();
    if (!selectedFriend) {
      alert('Please select a followed user to recommend to.');
      return;
    }
    setRecommendationMessage(`Success: Sent recommendation of "${movie.title}" to ${selectedFriend}!`);
    setTimeout(() => setRecommendationMessage(''), 4000);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('Please write a review comment.');
      return;
    }
    
    // Call the parent handler to prepend this review to the dynamic feed
    if (onAddReview) {
      onAddReview({
        user: user.nickname || 'ANONYMOUS',
        rating: '★ ' + rating,
        comment: `"${comment.trim()}" (on ${movie.title.toUpperCase()})`
      });
    }

    alert('Your review has been successfully posted to Cine-Social!');
    setComment('');
  };
  // ── Theme Colors based on genre ──
  const isRomcom = genre === 'romcom';
  const themeAccent = isRomcom ? '#ff69b4' : '#760707';
  const themeAccentLight = isRomcom ? '#ffb6d9' : '#ff4b4b';
  const themeAccentRgba = isRomcom ? 'rgba(255, 105, 180, 0.5)' : 'rgba(118, 7, 7, 0.5)';
  const themeAccentRgbaLight = isRomcom ? 'rgba(255, 105, 180, 0.15)' : 'rgba(118, 7, 7, 0.15)';
  const themeAccentRgbaDivider = isRomcom ? 'rgba(255, 105, 180, 0.2)' : 'rgba(118, 7, 7, 0.2)';
  const themeShadow = isRomcom ? 'rgba(255, 105, 180, 0.3)' : 'rgba(118, 7, 7, 0.3)';
  const themeCardBg = isRomcom ? 'rgba(30, 15, 25, 0.95)' : 'rgba(12, 10, 10, 0.95)';
  const themePosterBg = isRomcom ? '#1a0a14' : '#000';
  const badgeLabel = isRomcom ? 'ROMCOM LOUNGE' : 'HORROR VAULT';
  const themeInputBorder = isRomcom ? 'rgba(255, 105, 180, 0.4)' : 'rgba(118, 7, 7, 0.4)';

  return (
    <div style={overlayStyle}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        style={{
          ...popupCardStyle,
          background: themeCardBg,
          border: `1px solid ${themeAccentRgba}`,
          boxShadow: `0 25px 50px rgba(0, 0, 0, 0.8), 0 0 35px ${themeShadow}`,
        }}
      >
        {/* Close Button */}
        <button onClick={onClose} style={closeBtnStyle}>
          X
        </button>

        {/* Left Column - Poster */}
        <div style={{ ...posterColumnStyle, background: themePosterBg, borderRight: `1px solid ${themeAccentRgbaDivider}` }}>
          <img src={movie.poster} alt={movie.title} style={posterImgStyle} />
        </div>

        {/* Right Column - Details & Interactions */}
        <div style={detailsColumnStyle}>
          {/* Header */}
          <div style={headerStyle}>
            <div style={{
              ...badgeStyle,
              background: themeAccentRgbaLight,
              border: `1px solid ${themeAccentRgba}`,
              color: themeAccentLight,
            }}>{badgeLabel}</div>
            <h2 style={{
              ...titleStyle,
              textShadow: `0 0 10px ${isRomcom ? 'rgba(255, 105, 180, 0.4)' : 'rgba(118, 7, 7, 0.4)'}`,
            }}>{movie.title.toUpperCase()}</h2>
            <p style={sloganStyle}>"{movie.slogan.toUpperCase()}"</p>
          </div>

          {/* Details list */}
          <div style={metaGridStyle}>
            <div style={metaRowStyle}>
              <span style={metaLabelStyle}>RELEASE DATE:</span>
              <span style={metaValueStyle}>{movie.year}</span>
            </div>
            <div style={metaRowStyle}>
              <span style={metaLabelStyle}>DIRECTOR:</span>
              <span style={metaValueStyle}>{movie.director.toUpperCase()}</span>
            </div>
            <div style={metaRowStyle}>
              <span style={metaLabelStyle}>STARRING:</span>
              <span style={metaValueStyle}>{movie.actors.toUpperCase()}</span>
            </div>
            <div style={descBoxStyle}>
              <span style={metaLabelStyle}>SYNOPSIS</span>
              <p style={descTextStyle}>{movie.description}</p>
            </div>
          </div>

          <div style={{ ...dividerStyle, background: themeAccentRgbaDivider }} />

          {/* Actions & Forms Grid */}
          <div style={interactionGridStyle}>
            {/* Left Box: Favorite & Recommend */}
            <div style={actionBoxStyle}>
              <button 
                onClick={handleToggleFavorite} 
                style={{
                  ...favoriteBtnStyle,
                  background: isFavorite ? themeAccent : 'transparent',
                  borderColor: themeAccent,
                  color: '#fff'
                }}
              >
                {isFavorite ? 'REMOVE FROM FAVORITES' : 'ADD TO FAVORITES'}
              </button>

              {/* Recommendation Form */}
              <div style={{ marginTop: '15px' }}>
                <span style={metaLabelStyle}>RECOMMEND TO FRIEND</span>
                {followedFriends.length > 0 ? (
                  <form onSubmit={handleRecommend} style={recommendFormStyle}>
                    <select
                      value={selectedFriend}
                      onChange={(e) => setSelectedFriend(e.target.value)}
                      style={{ ...selectStyle, border: `1px solid ${themeInputBorder}` }}
                    >
                      <option value="">SELECT FRIEND...</option>
                      {followedFriends.map(friend => (
                        <option key={friend} value={friend}>{friend.toUpperCase()}</option>
                      ))}
                    </select>
                    <button type="submit" style={{ ...recommendBtnStyle, background: themeAccent }}>SEND</button>
                  </form>
                ) : (
                  <p style={noticeTextStyle}>FOLLOW FRIENDS IN CINE-SOCIAL TO RECOMMEND MOVIES.</p>
                )}
                {recommendationMessage && (
                  <div style={successMessageStyle}>{recommendationMessage}</div>
                )}
              </div>
            </div>

            {/* Right Box: Rating Review Form */}
            <div style={actionBoxStyle}>
              <span style={metaLabelStyle}>SUBMIT REVIEW TO CINE-SOCIAL</span>
              <form onSubmit={handleSubmitReview} style={reviewFormStyle}>
                <div style={ratingSelectorStyle}>
                  <span style={starLabelStyle}>RATING:</span>
                  <div style={starsContainerStyle}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => setRating(star)}
                        style={{
                          ...starStyle,
                          color: star <= rating ? (isRomcom ? '#ff69b4' : '#ffd700') : '#444'
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="WRITE YOUR REVIEW HERE..."
                  maxLength={150}
                  style={{ ...textareaStyle, border: `1px solid ${themeInputBorder}` }}
                  required
                />
                
                <button type="submit" style={{ ...submitReviewBtnStyle, background: themeAccent }}>
                  POST REVIEW
                </button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const overlayStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 11000,
  background: 'rgba(0, 0, 0, 0.9)',
  backdropFilter: 'blur(20px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
};

const popupCardStyle = {
  display: 'flex',
  width: '100%',
  maxWidth: '960px',
  height: '620px',
  background: 'rgba(12, 10, 10, 0.95)',
  borderRadius: '8px',
  border: '1px solid rgba(118, 7, 7, 0.5)',
  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(118, 7, 7, 0.3)',
  overflow: 'hidden',
  position: 'relative',
};

const closeBtnStyle = {
  position: 'absolute',
  top: '20px',
  right: '20px',
  background: 'none',
  border: 'none',
  color: '#888',
  fontSize: '1.25rem',
  cursor: 'pointer',
  zIndex: 100,
  fontFamily: 'monospace',
  transition: 'color 0.2s',
};

const posterColumnStyle = {
  width: '320px',
  background: '#000',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRight: '1px solid rgba(118, 7, 7, 0.2)',
};

const posterImgStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const detailsColumnStyle = {
  flex: 1,
  padding: '30px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxSizing: 'border-box',
  overflowY: 'auto',
};

const headerStyle = {
  textAlign: 'left',
  marginBottom: '15px',
};

const badgeStyle = {
  background: 'rgba(118, 7, 7, 0.15)',
  border: '1px solid rgba(118, 7, 7, 0.5)',
  borderRadius: '4px',
  padding: '4px 10px',
  color: '#ff4b4b',
  fontSize: '0.6rem',
  fontWeight: 'bold',
  letterSpacing: '2px',
  fontFamily: 'monospace',
  width: 'fit-content',
  marginBottom: '10px',
};

const titleStyle = {
  color: '#fff',
  fontFamily: 'monospace',
  fontSize: '1.6rem',
  fontWeight: '950',
  letterSpacing: '4px',
  margin: '0 0 5px 0',
  textShadow: '0 0 10px rgba(118, 7, 7, 0.4)',
};

const sloganStyle = {
  color: '#888',
  fontSize: '0.75rem',
  fontFamily: 'monospace',
  fontStyle: 'italic',
  margin: 0,
  letterSpacing: '1px',
};

const metaGridStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const metaRowStyle = {
  display: 'flex',
  textAlign: 'left',
  fontSize: '0.75rem',
  fontFamily: 'monospace',
};

const metaLabelStyle = {
  color: '#555',
  width: '140px',
  fontWeight: 'bold',
  letterSpacing: '1px',
  display: 'block',
  marginBottom: '4px',
};

const metaValueStyle = {
  color: '#eee',
  letterSpacing: '1px',
};

const descBoxStyle = {
  textAlign: 'left',
  marginTop: '5px',
};

const descTextStyle = {
  color: '#aaa',
  fontSize: '0.75rem',
  lineHeight: '1.5',
  margin: '4px 0 0 0',
  letterSpacing: '0.5px',
  fontFamily: 'monospace',
};

const dividerStyle = {
  height: '1px',
  background: 'rgba(118, 7, 7, 0.2)',
  margin: '15px 0',
};

const interactionGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1.1fr',
  gap: '20px',
};

const actionBoxStyle = {
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'left',
  boxSizing: 'border-box',
};

const favoriteBtnStyle = {
  width: '100%',
  padding: '12px',
  border: '1px solid',
  borderRadius: '4px',
  fontSize: '0.75rem',
  fontWeight: 'bold',
  letterSpacing: '1px',
  fontFamily: 'monospace',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textAlign: 'center',
};

const recommendFormStyle = {
  display: 'flex',
  gap: '8px',
  marginTop: '4px',
};

const selectStyle = {
  flex: 1,
  background: 'rgba(0, 0, 0, 0.5)',
  border: '1px solid rgba(118, 7, 7, 0.4)',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '0.75rem',
  padding: '8px',
  fontFamily: 'monospace',
  outline: 'none',
};

const recommendBtnStyle = {
  background: '#760707',
  border: 'none',
  borderRadius: '4px',
  color: '#fff',
  padding: '8px 16px',
  fontFamily: 'monospace',
  fontWeight: 'bold',
  fontSize: '0.75rem',
  cursor: 'pointer',
};

const noticeTextStyle = {
  color: '#444',
  fontSize: '0.65rem',
  fontFamily: 'monospace',
  margin: '4px 0 0 0',
  letterSpacing: '0.5px',
};

const successMessageStyle = {
  color: '#00ff66',
  fontSize: '0.7rem',
  fontFamily: 'monospace',
  marginTop: '8px',
};

const reviewFormStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const ratingSelectorStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const starLabelStyle = {
  color: '#555',
  fontSize: '0.75rem',
  fontFamily: 'monospace',
  fontWeight: 'bold',
  letterSpacing: '1px',
};

const starsContainerStyle = {
  display: 'flex',
  gap: '4px',
};

const starStyle = {
  fontSize: '1.2rem',
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'color 0.1s ease',
};

const textareaStyle = {
  width: '100%',
  height: '70px',
  background: 'rgba(0, 0, 0, 0.5)',
  border: '1px solid rgba(118, 7, 7, 0.4)',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '0.75rem',
  padding: '8px',
  boxSizing: 'border-box',
  resize: 'none',
  outline: 'none',
  fontFamily: 'monospace',
  lineHeight: '1.4',
};

const submitReviewBtnStyle = {
  background: '#760707',
  border: 'none',
  borderRadius: '4px',
  color: '#fff',
  padding: '10px',
  fontFamily: 'monospace',
  fontWeight: 'bold',
  fontSize: '0.75rem',
  letterSpacing: '1px',
  cursor: 'pointer',
  width: '100%',
  textAlign: 'center',
};
