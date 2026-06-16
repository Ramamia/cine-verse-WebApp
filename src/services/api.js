const API_BASE_URL = 'http://localhost:3000/api';

const getHeaders = () => {
  const token = localStorage.getItem('cineverse_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const api = {
  // Auth
  register: async (email, password, nickname) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, nickname }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  // Users
  getProfile: async () => {
    const res = await fetch(`${API_BASE_URL}/users/me`, {
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch profile');
    }
    return res.json();
  },

  updateProfile: async (data) => {
    const res = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update profile');
    }
    return res.json();
  },

  updateTopMovies: async (movieIds) => {
    const res = await fetch(`${API_BASE_URL}/users/top-movies`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ movie_ids: movieIds }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update top movies');
    }
    return res.json();
  },

  toggleFollow: async (id) => {
    const res = await fetch(`${API_BASE_URL}/users/follow/${id}`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to toggle follow');
    }
    return res.json();
  },

  // Movies
  getMovies: async (genre) => {
    let url = `${API_BASE_URL}/movies`;
    if (genre) url += `?genre=${genre}`;
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch movies');
    }
    return res.json();
  },

  // Reviews
  getReviews: async () => {
    const res = await fetch(`${API_BASE_URL}/reviews`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch reviews');
    }
    return res.json();
  },

  postReview: async (movieId, rating, comment) => {
    const res = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ movie_id: movieId, rating, comment }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to post review');
    }
    return res.json();
  },

  // Assets
  getAssets: async (prefix) => {
    let url = `${API_BASE_URL}/assets`;
    if (prefix) url += `?prefix=${encodeURIComponent(prefix)}`;
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch assets');
    }
    return res.json();
  },

  // kept for backward compat — just calls getAssets with prefix
  getAssetsByCategory: async (prefix) => {
    let url = `${API_BASE_URL}/assets`;
    if (prefix) url += `?prefix=${encodeURIComponent(prefix)}`;
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch assets');
    }
    return res.json();
  },
};
