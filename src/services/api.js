import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Search Anime
export const searchAnime = async (term, page = 1, limit = 12) => {
  try {
    const response = await api.get('/search', {
      params: { term, page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};

// Get Anime Info by Slug
export const getAnimeInfo = async (slug) => {
  try {
    const response = await api.get(`/anime/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Get anime info error:', error);
    throw error;
  }
};

// Get Season Info
export const getSeasonInfo = async (animeId) => {
  try {
    const response = await api.get(`/anime/${animeId}/seasons`);
    return response.data;
  } catch (error) {
    console.error('Get season info error:', error);
    throw error;
  }
};

// Get Episodes
export const getEpisodes = async (seasonId) => {
  try {
    const response = await api.get(`/episodes/${seasonId}`);
    return response.data;
  } catch (error) {
    console.error('Get episodes error:', error);
    throw error;
  }
};

// Get Episode Links
export const getEpisodeLinks = async (episodeId) => {
  try {
    const response = await api.get(`/episode/${episodeId}/links`);
    return response.data;
  } catch (error) {
    console.error('Get episode links error:', error);
    throw error;
  }
};

// Get Popular Anime
export const getPopularAnime = async (duration = 'month', page = 1, limit = 12) => {
  try {
    const response = await api.get('/popular', {
      params: { duration, page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Get popular anime error:', error);
    throw error;
  }
};

// Get Series (TV Shows)
export const getSeries = async (page = 1, limit = 12) => {
  try {
    const response = await api.get('/series', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Get series error:', error);
    throw error;
  }
};

// Get Movies
export const getMovies = async (page = 1, limit = 12) => {
  try {
    const response = await api.get('/movies', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Get movies error:', error);
    throw error;
  }
};

// Get Random Anime
export const getRandomAnime = async (page = 1, limit = 12) => {
  try {
    const response = await api.get('/random', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Get random anime error:', error);
    throw error;
  }
};

// Get Movie Links
export const getMovieLinks = async (slug) => {
  try {
    const response = await api.get(`/movie/${slug}/links`);
    return response.data;
  } catch (error) {
    console.error('Get movie links error:', error);
    throw error;
  }
};

// Default export
export default {
  searchAnime,
  getAnimeInfo,
  getSeasonInfo,
  getEpisodes,
  getEpisodeLinks,
  getPopularAnime,
  getSeries,
  getMovies,
  getRandomAnime,
  getMovieLinks,
};