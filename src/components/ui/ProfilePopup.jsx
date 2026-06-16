import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  overlayStyle, ticketStyle, leftStubStyle, rightStubStyle, dividerStyle,
  topTearCircleStyle, bottomTearCircleStyle, dividerLineStyle, ticketHeaderStyle,
  logoWrapperStyle, vipBadgeStyle, profileGridStyle, credentialsColumnStyle,
  bioColumnStyle, bioTextareaStyle, fieldStyle, fieldLabelStyle, fieldValueStyle,
  moviesSectionStyle, movieSlotsContainerStyle, movieCardStyle, emptyMovieCardStyle,
  emptyCardNumberStyle, moviePosterStyle, moviePosterFallbackStyle, movieFallbackTitleStyle,
  movieRemoveOverlayStyle, removeBtnTextStyle, searchSectionStyle, searchFormStyle,
  movieSearchInputStyle, movieSearchBtnStyle, searchErrorStyle, searchResultsContainerStyle,
  searchResultItemStyle, searchResultPosterStyle, searchResultPosterFallbackStyle,
  searchResultDetailsStyle, searchResultTitleStyle, addMovieBtnStyle, noResultsStyle,
  barcodeContainerStyle, barcodeLinesStyle, barcodeNumberStyle, closeBtnStyle,
  viewerLabelStyle, canvasContainerStyle, photoboothFrameStyle, photoboothImageStyle,
  photoboothContainerStyle, filmStripStyle
} from '../../styles/profilePopupStyles';
import { useAppContext } from '../../contexts/AppContext';
import { api } from '../../services/api';

export default function ProfilePopup({ user, config, setUser, onClose }) {
  const { setGlobalAlert } = useAppContext();

  // asset URLs loaded from the API
  const [avatarAssets, setAvatarAssets] = useState({});
  const [filmStripUrl, setFilmStripUrl] = useState(null);

  // fetch avatar PFP images and film strip from the assets API
  useEffect(() => {
    api.getAssets('images/avatarsPFP')
      .then(res => {
        const assets = res.assets || [];
        const map = {};
        assets.forEach(a => {
          // e.g. "images/avatarsPFP_pinkCowboyAvatar.png" → key "pinkcowboyavatar"
          const fileName = a.name.split('_').slice(1).join('_').replace(/\.\w+$/, '').toLowerCase();
          map[fileName] = a.url;
        });
        setAvatarAssets(map);
      })
      .catch(err => console.error('Failed to load avatar assets:', err));

    // fetch the film strip decoration image
    api.getAssets('images/filmStrip')
      .then(res => {
        const assets = res.assets || [];
        if (assets.length > 0) {
          setFilmStripUrl(assets[0].url);
        }
      })
      .catch(err => console.error('Failed to load film strip:', err));
  }, []);

  // figure out which avatar PFP to use based on config
  const getAvatarUrl = (cfg) => {
    if (cfg?.skin === 'pink') {
      if (cfg.acc === 'cowboy') return avatarAssets['pinkcowboyavatar'] || null;
      return avatarAssets['pinkavatar'] || null;
    } else if (cfg?.skin === 'green') {
      if (cfg.acc === 'cowboy') return avatarAssets['greencowboyavatar'] || null;
      return avatarAssets['greenavatar'] || null;
    }
    return avatarAssets['baseavatar'] || null;
  };

  // state for searching movies on IMDb
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hoveredMovieId, setHoveredMovieId] = useState(null);

  // generate a fake ticket number using the email so it looks legit
  const ticketNo = user.email
    ? `CV-${Math.abs(user.email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0))}-X`
    : 'CV-9823-A';

  // hit the keyless IMDb search endpoint to find movies
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
    } catch {
      setSearchError('Error loading movies. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddMovie = async (movie) => {
    const currentMovies = user.topMovies || [];
    if (currentMovies.length >= 5) {
      setGlobalAlert('YOU CAN ONLY SELECT UP TO 5 TOP MOVIES.');
      return;
    }
    if (currentMovies.some(m => m.id === movie.id)) {
      setGlobalAlert('THIS MOVIE IS ALREADY IN YOUR TOP 5.');
      return;
    }
    
    const newMovies = [...currentMovies, movie];
    try {
      await api.updateTopMovies(newMovies.map(m => m.id));
      setUser(prev => ({
        ...prev,
        topMovies: newMovies
      }));
    } catch (err) {
      setGlobalAlert('FAILED TO SAVE TOP MOVIE. NOTE: CURRENTLY ONLY MOVIES IN THE DB CAN BE ADDED TO TOP 5.');
    }
  };

  const handleRemoveMovie = async (movieId) => {
    const currentMovies = user.topMovies || [];
    const newMovies = currentMovies.filter(m => m.id !== movieId);
    try {
      await api.updateTopMovies(newMovies.map(m => m.id));
      setUser(prev => ({
        ...prev,
        topMovies: newMovies
      }));
    } catch (err) {
      setGlobalAlert('FAILED TO UPDATE TOP MOVIES: ' + err.message.toUpperCase());
    }
  };

  const handleBioChange = (e) => {
    const val = e.target.value;
    setUser(prev => ({
      ...prev,
      bio: val
    }));
  };


  const topMovies = user.topMovies || [];
  const movieSlots = Array.from({ length: 5 }, (_, i) => topMovies[i] || null);

  return (
    <div style={overlayStyle}>
      {/* custom scrollbar overrides to keep that black and red cinema vibe going */}
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
        {/* left side of the tear-off ticket where all the bio and movies sit */}
        <div style={leftStubStyle}>
          {/* ticket header */}
          <div style={ticketHeaderStyle}>
            <div style={logoWrapperStyle}>
              CINE-VERSE IDENTITY PASS
            </div>
            <span style={vipBadgeStyle}>VIP ADMIT ONE</span>
          </div>

          {/* grid layout for the profile stats and bio box */}
          <div style={profileGridStyle}>
            {/* digital credentials and follower counts */}
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

            {/* bio text area so the user can flex their cinephile identity */}
            <div style={bioColumnStyle}>
              <span style={fieldLabelStyle}>IDENTITY BIO</span>
              <textarea
                value={user.bio || ''}
                onChange={handleBioChange}
                onBlur={async (e) => {
                  try {
                    await api.updateProfile({ bio: e.target.value });
                  } catch (err) {
                    setGlobalAlert('FAILED TO SAVE BIO: ' + err.message.toUpperCase());
                  }
                }}
                placeholder="ENTER YOUR CINEPHILE BIO HERE..."
                maxLength={200}
                style={bioTextareaStyle}
              />
            </div>
          </div>

          {/* top 5 movie display section */}
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
                      {movie.poster_url || movie.poster ? (
                        <img
                          src={movie.poster_url || movie.poster}
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

          {/* imdb search section to add to the top 5 list */}
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

          {/* cool barcode representation at the bottom to sell the ticket look */}
          <div style={barcodeContainerStyle}>
            <div style={barcodeLinesStyle} />
            <div style={barcodeNumberStyle}>{ticketNo}</div>
          </div>
        </div>

        {/* the perforated divider to make it look like a real tear-off ticket */}
        <div style={dividerStyle}>
          <div style={topTearCircleStyle} />
          <div style={dividerLineStyle} />
          <div style={bottomTearCircleStyle} />
        </div>

        {/* right side of the ticket showing the photobooth profile picture */}
        <div style={rightStubStyle}>
          {/* easy close button */}
          <button onClick={onClose} style={closeBtnStyle}>
            X
          </button>

          <div style={viewerLabelStyle}>PROFILE PICTURE</div>

          <div style={{ ...canvasContainerStyle, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={photoboothContainerStyle}>
              {filmStripUrl && (
                <img src={filmStripUrl} alt="film strip" style={filmStripStyle} />
              )}
              
              <div style={photoboothFrameStyle}>
                {getAvatarUrl(config) ? (
                  <img 
                    src={getAvatarUrl(config)} 
                    alt="Avatar Profile" 
                    style={photoboothImageStyle} 
                  />
                ) : (
                  <div style={{
                    ...photoboothImageStyle,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(118, 7, 7, 0.2)',
                    color: '#760707',
                    fontSize: '0.7rem',
                    letterSpacing: '1px',
                    fontFamily: 'monospace',
                  }}>
                    LOADING...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
