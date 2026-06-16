import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [globalAlert, setGlobalAlert] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [movies, setMovies] = useState([]);
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [romcomMovies, setRomcomMovies] = useState([]);
  const [scifiMovies, setScifiMovies] = useState([]);

  const [config, setConfig] = useState({ acc: null, hair: null, skin: 'baseAvatar.png' });
  const [user, setUser] = useState({
    id: null,
    nickname: '',
    email: '',
    bio: '',
    topMovies: [],
    following: [],
  });

  const [feedItems, setFeedItems] = useState([]);

  useEffect(() => {
    const handleAlert = (e) => setGlobalAlert(e.detail);
    window.addEventListener('show-alert', handleAlert);
    return () => window.removeEventListener('show-alert', handleAlert);
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const [moviesRes, reviewsRes] = await Promise.all([
          api.getMovies(),
          api.getReviews()
        ]);
        
        const allMovies = moviesRes.movies || [];
        setMovies(allMovies);
        setHorrorMovies(allMovies.filter(m => m.genre === 'horror'));
        setRomcomMovies(allMovies.filter(m => m.genre === 'romcom'));
        setScifiMovies(allMovies.filter(m => m.genre === 'scifi'));

        setFeedItems(reviewsRes.reviews || []);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }

      if (localStorage.getItem('cineverse_token')) {
        try {
          const profileRes = await api.getProfile();
          const u = profileRes.user;
          setUser({
            id: u.id,
            nickname: u.nickname,
            email: u.email,
            bio: u.bio || '',
            topMovies: u.top_movies || [],
            following: u.followers || [],
          });
          setConfig({
            skin: u.avatar_skin || 'baseAvatar.png',
            acc: u.avatar_acc || null,
            hair: null
          });
        } catch (err) {
          console.error('Failed to fetch profile (token might be invalid):', err);
          localStorage.removeItem('cineverse_token');
        }
      }
    };
    
    initializeData();
  }, []);

  const value = {
    isLoading, setIsLoading,
    searchError, setSearchError,
    globalAlert, setGlobalAlert,
    isProfileOpen, setIsProfileOpen,
    selectedMovie, setSelectedMovie,
    config, setConfig,
    user, setUser,
    feedItems, setFeedItems,
    movies, horrorMovies, romcomMovies, scifiMovies
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
