import React, { Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import Avatar, { MODEL_OFFSETS } from '../3d/Avatar';

export default function ProfilePopup({ user, config, setUser, onClose, onEditAvatar }) {
  // Load accessories for the 3D Avatar render
  const { scene: cowboy } = useGLTF('/models/cowboy_hat.glb');
  const { scene: glasses } = useGLTF('/models/cinema_glasses.glb');
  const { scene: hair } = useGLTF('/models/monroe_hair.glb');
  const accessories = { cowboy, glasses, hair };

  // Search states for IMDb API
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hoveredMovieId, setHoveredMovieId] = useState(null);

  // Generate a random ticket number based on the email
  const ticketNo = user.email
    ? `CV-${Math.abs(user.email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0))}-X`
    : 'CV-9823-A';

  // Search movies from the keyless IMDb search endpoint
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    try {
      const res = await fetch(`https://imdb.iamidiotareyoutoo.com/search?q=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error('API Request Failed');
      const data = await res.json();
      if (data.ok && data.description) {
        const mapped = data.description.map(item => ({
          id: item["#IMDB_ID"] || Math.random().toString(),
          title: item["#TITLE"] || 'Unknown Title',
          year: item["#YEAR"] || 'N/A',
          poster: item["#IMG_POSTER"] || null
        }));
        setSearchResults(mapped);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      setSearchError('Error loading movies. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddMovie = (movie) => {
    const currentMovies = user.topMovies || [];
    if (currentMovies.length >= 5) {
      alert('You can only select up to 5 top movies.');
      return;
    }
    if (currentMovies.some(m => m.id === movie.id)) {
      alert('This movie is already in your Top 5.');
      return;
    }
    setUser(prev => ({
      ...prev,
      topMovies: [...(prev.topMovies || []), movie]
    }));
  };

  const handleRemoveMovie = (movieId) => {
    setUser(prev => ({
      ...prev,
      topMovies: (prev.topMovies || []).filter(m => m.id !== movieId)
    }));
  };

  const handleBioChange = (e) => {
    const val = e.target.value;
    setUser(prev => ({
      ...prev,
      bio: val
    }));
  };

  // Resolve model path and retrieve its customizer offsets to dynamically neutralize them
  let modelPath = '/models/base_avatar.glb';
  if (config?.skin === 'pink') {
    if (config.acc === 'cowboy') {
      modelPath = '/models/cowboy pink.glb';
    } else {
      modelPath = '/models/pink.glb';
    }
  } else if (config?.skin === 'green') {
    if (config.acc === 'cowboy') {
      modelPath = '/models/cowboy green.glb';
    } else {
      modelPath = '/models/green.glb';
    }
  }

  const activeOffsets = MODEL_OFFSETS[modelPath] || { position: [0, 0, 0], scale: 2.5 };
  
  // Set desired world target coordinates for the avatar inside the ticket stub preview
  // targetX = 0.5 (shifts right inside the ticket's canvas box)
  // targetY = -0.8 (aligns the upper body nicely to the camera)
  // targetZ = 0 (centers along depth)
  const targetX = 0.5;
  const targetY = -0.8;
  const targetZ = 0;

  const parentPosX = targetX - (activeOffsets.position[0] ?? 0);
  const parentPosY = targetY - (activeOffsets.position[1] ?? 0);
  const parentPosZ = targetZ - (activeOffsets.position[2] ?? 0);

  const topMovies = user.topMovies || [];
  const movieSlots = Array.from({ length: 5 }, (_, i) => topMovies[i] || null);

  return (
    <div style={overlayStyle}>
      {/* Scrollbar overrides to color the slider track black and the thumb red */}
      <style>{`
        .movie-slider-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .movie-slider-scrollbar::-webkit-scrollbar-track {
          background: #000000;
          border-radius: 3px;
        }
        .movie-slider-scrollbar::-webkit-scrollbar-thumb {
          background: #760707;
          border-radius: 3px;
        }
        .movie-slider-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a50f0f;
        }
      `}</style>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={ticketStyle}
      >
        {/* Tear-off Ticket Left Stub (Details, Bio, Top Movies) */}
        <div style={leftStubStyle}>
          {/* Header */}
          <div style={ticketHeaderStyle}>
            <div style={logoWrapperStyle}>
              CINE-VERSE IDENTITY PASS
            </div>
            <span style={vipBadgeStyle}>VIP ADMIT ONE</span>
          </div>

          {/* Grid Layout for Profile Details and Bio */}
          <div style={profileGridStyle}>
            {/* Credentials & Followers */}
            <div style={credentialsColumnStyle}>
              <div style={fieldStyle}>
                <span style={fieldLabelStyle}>HOLDER NICKNAME</span>
                <span style={fieldValueStyle}>{user.nickname || 'ANONYMOUS'}</span>
              </div>

              <div style={fieldStyle}>
                <span style={fieldLabelStyle}>DIGITAL CREDENTIALS</span>
                <span style={{ ...fieldValueStyle, fontSize: '0.85rem' }}>{user.email || 'guest@cineverse.com'}</span>
              </div>

              <div style={fieldStyle}>
                <span style={fieldLabelStyle}>FOLLOWING</span>
                <span style={{ ...fieldValueStyle, fontSize: '0.75rem', color: '#c61a1a', letterSpacing: '1px' }}>
                  {user.following && user.following.length > 0
                    ? user.following.join(', ').toUpperCase()
                    : 'NO USERS FOLLOWED YET'}
                </span>
              </div>
            </div>

            {/* Bio Editor */}
            <div style={bioColumnStyle}>
              <span style={fieldLabelStyle}>IDENTITY BIO</span>
              <textarea
                value={user.bio || ''}
                onChange={handleBioChange}
                placeholder="ENTER YOUR CINEPHILE BIO HERE..."
                maxLength={200}
                style={bioTextareaStyle}
              />
            </div>
          </div>

          {/* Top 5 Movies Section */}
          <div style={moviesSectionStyle}>
            <span style={fieldLabelStyle}>TOP 5 FAVORITE MOVIES</span>
            <div style={movieSlotsContainerStyle}>
              {movieSlots.map((movie, index) => {
                if (movie) {
                  return (
                    <div
                      key={movie.id}
                      style={movieCardStyle}
                      onMouseEnter={() => setHoveredMovieId(movie.id)}
                      onMouseLeave={() => setHoveredMovieId(null)}
                    >
                      {movie.poster ? (
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          referrerPolicy="no-referrer"
                          style={moviePosterStyle}
                        />
                      ) : (
                        <div style={moviePosterFallbackStyle}>
                          <span style={movieFallbackTitleStyle}>{movie.title}</span>
                        </div>
                      )}
                      {hoveredMovieId === movie.id && (
                        <div style={movieRemoveOverlayStyle} onClick={() => handleRemoveMovie(movie.id)}>
                          <span style={removeBtnTextStyle}>REMOVE</span>
                        </div>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div key={index} style={emptyMovieCardStyle}>
                      <span style={emptyCardNumberStyle}>{index + 1}</span>
                    </div>
                  );
                }
              })}
            </div>
          </div>

          {/* IMDb Search Section */}
          <div style={searchSectionStyle}>
            <form onSubmit={handleSearch} style={searchFormStyle}>
              <input
                type="text"
                placeholder="SEARCH IMDB TO ADD TO TOP 5..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={movieSearchInputStyle}
              />
              <button type="submit" disabled={isSearching} style={movieSearchBtnStyle}>
                {isSearching ? 'SEARCHING...' : 'SEARCH'}
              </button>
            </form>

            {searchError && <div style={searchErrorStyle}>{searchError}</div>}

            <div className="movie-slider-scrollbar" style={searchResultsContainerStyle}>
              {searchResults.length > 0 ? (
                searchResults.map(movie => (
                  <div key={movie.id} style={searchResultItemStyle}>
                    {movie.poster ? (
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        referrerPolicy="no-referrer"
                        style={searchResultPosterStyle}
                      />
                    ) : (
                      <div style={searchResultPosterFallbackStyle}>M</div>
                    )}
                    <div style={searchResultDetailsStyle}>
                      <div style={searchResultTitleStyle}>{movie.title} ({movie.year})</div>
                      <button
                        onClick={() => handleAddMovie(movie)}
                        style={addMovieBtnStyle}
                      >
                        + ADD
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                !isSearching && searchQuery.trim() !== '' && (
                  <div style={noResultsStyle}>NO MOVIES FOUND</div>
                )
              )}
            </div>
          </div>

          {/* Barcode representation */}
          <div style={barcodeContainerStyle}>
            <div style={barcodeLinesStyle} />
            <div style={barcodeNumberStyle}>{ticketNo}</div>
          </div>
        </div>

        {/* Ticket Divider with tear-off circles */}
        <div style={dividerStyle}>
          <div style={topTearCircleStyle} />
          <div style={dividerLineStyle} />
          <div style={bottomTearCircleStyle} />
        </div>

        {/* Tear-off Ticket Right Stub (3D Viewer) */}
        <div style={rightStubStyle}>
          {/* Close button */}
          <button onClick={onClose} style={closeBtnStyle}>
            X
          </button>

          <div style={viewerLabelStyle}>3D MODEL PREVIEW</div>

          <div style={canvasContainerStyle}>
            <Canvas camera={{ position: [0, 0.9, 1.65], fov: 38 }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.8} />
                <pointLight position={[5, 5, 5]} intensity={1.5} color="#760707" />
                <pointLight position={[-5, -5, -5]} intensity={0.5} color="#00d4ff" />
                <group position={[parentPosX, parentPosY, parentPosZ]} rotation={[-0.05, 0, 0]}>
                  <Avatar config={config} accessories={accessories} isPreview={true} />
                </group>
                <OrbitControls
                  enableZoom={true}
                  enablePan={false}
                  minDistance={1.0}
                  maxDistance={3.5}
                  maxPolarAngle={Math.PI / 1.8}
                  minPolarAngle={Math.PI / 3}
                />
              </Suspense>
            </Canvas>
          </div>

          <button
            onClick={() => {
              onClose();
              onEditAvatar && onEditAvatar();
            }}
            style={editAvatarBtnStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(118, 7, 7, 0.15)';
              e.currentTarget.style.transform = 'scale(1.03)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            CUSTOMIZE AVATAR
          </button>

          <div style={dragNoticeStyle}>-- DRAG TO ROTATE --</div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Inline CSS Styles ────────────────────────────────────────────────────────
const overlayStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 10000,
  background: 'rgba(0, 0, 0, 0.85)',
  backdropFilter: 'blur(15px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
};

const ticketStyle = {
  display: 'flex',
  width: '100%',
  maxWidth: '920px',
  height: '580px',
  background: 'rgba(15, 15, 18, 0.8)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(118, 7, 7, 0.25)',
  overflow: 'hidden',
  position: 'relative',
};

const leftStubStyle = {
  flex: '1',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxSizing: 'border-box',
};

const rightStubStyle = {
  width: '320px',
  background: 'rgba(255, 255, 255, 0.01)',
  borderLeft: '1px dashed rgba(255, 255, 255, 0.08)',
  padding: '24px 20px',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'relative',
};

const dividerStyle = {
  position: 'relative',
  width: '1px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const topTearCircleStyle = {
  position: 'absolute',
  top: '-15px',
  left: '-15px',
  width: '30px',
  height: '30px',
  background: 'rgba(0,0,0,1)',
  borderRadius: '50%',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)',
  zIndex: 10,
};

const bottomTearCircleStyle = {
  position: 'absolute',
  bottom: '-15px',
  left: '-15px',
  width: '30px',
  height: '30px',
  background: 'rgba(0,0,0,1)',
  borderRadius: '50%',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)',
  zIndex: 10,
};

const dividerLineStyle = {
  height: '100%',
  borderRight: '1px dashed rgba(255, 255, 255, 0.15)',
};

const ticketHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  paddingBottom: '10px',
};

const logoWrapperStyle = {
  color: '#fff',
  fontFamily: 'monospace',
  fontSize: '0.85rem',
  fontWeight: 'bold',
  letterSpacing: '2px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

const vipBadgeStyle = {
  background: 'rgba(118, 7, 7, 0.15)',
  border: '1px solid rgba(118, 7, 7, 0.4)',
  borderRadius: '4px',
  padding: '4px 10px',
  color: '#c61a1a',
  fontSize: '0.65rem',
  fontWeight: 'bold',
  letterSpacing: '1px',
  fontFamily: 'monospace',
};

const profileGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
  margin: '12px 0',
};

const credentialsColumnStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const bioColumnStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  textAlign: 'left',
};

const bioTextareaStyle = {
  width: '100%',
  height: '110px',
  background: 'rgba(0, 0, 0, 0.4)',
  border: '1px solid rgba(118, 7, 7, 0.4)',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '0.75rem',
  padding: '10px',
  boxSizing: 'border-box',
  resize: 'none',
  outline: 'none',
  fontFamily: 'monospace',
  lineHeight: '1.4',
  letterSpacing: '0.5px',
};

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  textAlign: 'left',
};

const fieldLabelStyle = {
  color: '#555',
  fontSize: '0.6rem',
  fontWeight: 'bold',
  letterSpacing: '1.5px',
  fontFamily: 'monospace',
};

const fieldValueStyle = {
  color: '#fff',
  fontSize: '0.9rem',
  fontWeight: 'bold',
  letterSpacing: '1.5px',
  fontFamily: 'monospace',
};

const moviesSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  textAlign: 'left',
};

const movieSlotsContainerStyle = {
  display: 'flex',
  gap: '10px',
  margin: '4px 0',
};

const movieCardStyle = {
  position: 'relative',
  width: '72px',
  height: '108px',
  borderRadius: '6px',
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  background: 'rgba(0, 0, 0, 0.5)',
  cursor: 'pointer',
  boxSizing: 'border-box',
};

const emptyMovieCardStyle = {
  width: '72px',
  height: '108px',
  borderRadius: '6px',
  border: '1px dashed rgba(118, 7, 7, 0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0, 0, 0, 0.2)',
  boxSizing: 'border-box',
};

const emptyCardNumberStyle = {
  fontFamily: 'monospace',
  fontSize: '0.9rem',
  color: '#333',
  fontWeight: 'bold',
};

const moviePosterStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const moviePosterFallbackStyle = {
  width: '100%',
  height: '100%',
  background: 'linear-gradient(135deg, #1f1f2e 0%, #11111a 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px',
  boxSizing: 'border-box',
};

const movieFallbackTitleStyle = {
  fontFamily: 'monospace',
  fontSize: '0.55rem',
  color: '#aaa',
  textAlign: 'center',
  lineHeight: '1.2',
};

const movieRemoveOverlayStyle = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(118, 7, 7, 0.95)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'opacity 0.2s ease',
};

const removeBtnTextStyle = {
  color: '#fff',
  fontSize: '0.65rem',
  fontWeight: 'bold',
  fontFamily: 'monospace',
  letterSpacing: '1px',
};

const searchSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  marginTop: '10px',
};

const searchFormStyle = {
  display: 'flex',
  gap: '8px',
};

const movieSearchInputStyle = {
  flex: '1',
  background: 'rgba(0, 0, 0, 0.6)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '4px',
  padding: '8px 12px',
  color: '#fff',
  fontSize: '0.75rem',
  fontFamily: 'monospace',
  outline: 'none',
  letterSpacing: '0.5px',
};

const movieSearchBtnStyle = {
  background: '#760707',
  border: 'none',
  borderRadius: '4px',
  color: '#fff',
  padding: '8px 16px',
  fontFamily: 'monospace',
  fontWeight: 'bold',
  fontSize: '0.75rem',
  letterSpacing: '1px',
  cursor: 'pointer',
};

const searchErrorStyle = {
  color: '#ff4b4b',
  fontSize: '0.7rem',
  fontFamily: 'monospace',
  textAlign: 'left',
};

const searchResultsContainerStyle = {
  display: 'flex',
  gap: '10px',
  overflowX: 'auto',
  paddingBottom: '8px',
  minHeight: '80px',
  maxHeight: '90px',
  alignItems: 'center',
  width: '100%',
  maxWidth: '520px',
  boxSizing: 'border-box',
};

const searchResultItemStyle = {
  flex: '0 0 160px',
  height: '74px',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '4px',
  display: 'flex',
  gap: '8px',
  padding: '4px',
  boxSizing: 'border-box',
  textAlign: 'left',
};

const searchResultPosterStyle = {
  width: '42px',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '2px',
};

const searchResultPosterFallbackStyle = {
  width: '42px',
  height: '100%',
  background: '#1a1a24',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.7rem',
  color: '#555',
  fontFamily: 'monospace',
  borderRadius: '2px',
};

const searchResultDetailsStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  flex: '1',
  overflow: 'hidden',
};

const searchResultTitleStyle = {
  color: '#fff',
  fontSize: '0.6rem',
  fontWeight: 'bold',
  fontFamily: 'monospace',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const addMovieBtnStyle = {
  background: 'rgba(118, 7, 7, 0.2)',
  border: '1px solid rgba(118, 7, 7, 0.5)',
  borderRadius: '2px',
  color: '#c61a1a',
  fontSize: '0.55rem',
  padding: '2px 6px',
  fontFamily: 'monospace',
  fontWeight: 'bold',
  cursor: 'pointer',
  textAlign: 'center',
  width: 'fit-content',
};

const noResultsStyle = {
  color: '#444',
  fontSize: '0.7rem',
  fontFamily: 'monospace',
  width: '100%',
  textAlign: 'center',
};

const barcodeContainerStyle = {
  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  paddingTop: '10px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
};

const barcodeLinesStyle = {
  width: '100%',
  height: '30px',
  backgroundImage: 'repeating-linear-gradient(90deg, #fff, #fff 1px, transparent 1px, transparent 6px, #fff 6px, #fff 8px, transparent 8px, transparent 12px, #fff 12px, #fff 13px, transparent 13px, transparent 18px, #fff 18px, #fff 22px, transparent 22px, transparent 24px)',
  opacity: 0.6,
};

const barcodeNumberStyle = {
  color: '#444',
  fontSize: '0.55rem',
  letterSpacing: '4px',
  fontFamily: 'monospace',
};

const closeBtnStyle = {
  position: 'absolute',
  top: '15px',
  right: '15px',
  zIndex: 100,
  background: 'none',
  border: 'none',
  color: '#666',
  fontSize: '1.1rem',
  cursor: 'pointer',
  transition: 'color 0.2s',
  padding: '5px',
};

const viewerLabelStyle = {
  color: '#555',
  fontSize: '0.6rem',
  fontWeight: 'bold',
  letterSpacing: '2px',
  fontFamily: 'monospace',
  marginBottom: '10px',
};

const canvasContainerStyle = {
  width: '100%',
  height: '420px',
  background: 'radial-gradient(circle, rgba(118, 7, 7, 0.12) 0%, transparent 80%)',
  borderRadius: '8px',
  border: '1px solid rgba(255, 255, 255, 0.02)',
  overflow: 'hidden',
};

const dragNoticeStyle = {
  color: '#444',
  fontSize: '0.55rem',
  letterSpacing: '2px',
  fontFamily: 'monospace',
  marginTop: '10px',
};

const editAvatarBtnStyle = {
  width: '100%',
  padding: '10px',
  background: 'transparent',
  border: '1px solid rgba(118, 7, 7, 0.5)',
  borderRadius: '4px',
  color: '#c61a1a',
  fontWeight: 'bold',
  fontFamily: 'monospace',
  fontSize: '0.75rem',
  letterSpacing: '1.5px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  marginTop: '10px',
  boxSizing: 'border-box',
};
