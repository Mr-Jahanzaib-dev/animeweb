// ⚠️ DEVELOPMENT ONLY - Disable SSL verification
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const https = require('https');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'https://your-api-domain.com';
const API_KEY = 'deadtoonszylith';

// Create HTTPS agent that ignores self-signed certificates
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

// Helper function to fetch from API
const fetchFromAPI = async (endpoint, parameters) => {
  try {
    const separator = parameters.startsWith('?') ? '' : '?';
    const url = `${API_BASE_URL}/${endpoint}${separator}${parameters}&key=${API_KEY}`;
    
    console.log('🌐 Requesting:', url);
    
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 20000,
      httpsAgent: httpsAgent
    });
    
    console.log('✅ Success! Status:', response.status);
    console.log('📦 Response data:', JSON.stringify(response.data, null, 2)); // Add this line
    
    return response.data;
  } catch (error) {
    console.error('❌ API Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    return null;
  }
};

// Helper function to organize anime data
const organizeAnime = (anime) => {
  // Extract year from release date
  let year = "";
  if (anime.anime_rel_date && anime.anime_rel_date !== "0000-00-00") {
    year = new Date(anime.anime_rel_date).getFullYear().toString();
  }
  
  return {
    id: anime.anime_id,
    deadbase_id: anime.dumy_id,
    name: anime.anime_name,
    slug: anime.slug,
    type: anime.type,
    subOrDub: anime.sub == 0 ? "SUB" : "DUB",
    overview: anime.overview,
    release: anime.anime_rel_date,
    year: year,  // Now properly extracts year
    rating: anime.rating,
    complete: anime.anime_com_date === "0000-00-00" ? null : anime.anime_com_date,
    views: anime.total_views,
    duration: anime.duration,
    episodes: anime.total_episodes,
    age: {
      id: anime.age_id,
      short_name: anime.age_name,
      description: anime.age_des
    },
    image: {
      poster: anime.poster_img,
      backdrop: anime.backdrop_img
    }
  };
};
// Routes

// Search Anime
app.get('/api/search', async (req, res) => {
  const { term, page = 1, limit = 12 } = req.query;
  
  if (!term) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  const data = await fetchFromAPI('anime/search.php', `?keyword=${term}&limit=${limit}&page=${page}`);
  
  if (!data) {
    return res.status(500).json({ error: 'Failed to fetch data' });
  }

  const response = {
    total_pages: data.total_pages || 0,
    current_page: data.current_page || 0,
    posts: data.posts ? data.posts.map(organizeAnime) : []
  };

  res.json(response);
});

// Get Anime Info by Slug
app.get('/api/anime/:slug', async (req, res) => {
  const { slug } = req.params;
  
  const data = await fetchFromAPI('anime/anime.php', `?slug=${slug}`);
  
  if (!data) {
    return res.status(404).json({ error: 'Anime not found' });
  }

  res.json(organizeAnime(data));
});

// Get Season Info
app.get('/api/anime/:id/seasons', async (req, res) => {
  const { id } = req.params;
  
  const data = await fetchFromAPI('anime/my-seasons.php', `?animeid=${id}`);
  
  if (!data || !Array.isArray(data)) {
    return res.json({ seasons_count: 0, seasons: [] });
  }

  const response = {
    seasons_count: data.length,
    seasons: data.map(season => ({
      num: season.my_season_num,
      id: season.my_season_id
    }))
  };

  res.json(response);
});

// Get Episodes
app.get('/api/episodes/:seasonId', async (req, res) => {
  const { seasonId } = req.params;
  
  const data = await fetchFromAPI('anime/episodes.php', `?seasonid=${seasonId}`);
  
  if (!data || !Array.isArray(data)) {
    return res.json([]);
  }

  const episodes = data.map(ep => ({
    id: ep.episode_id,
    number: ep.epSort,
    name: ep.episode_name,
    image: { backdrop: ep.img },
    note: ep.note
  }));

  res.json(episodes);
});

// Get Episode Links
app.get('/api/episode/:episodeId/links', async (req, res) => {
  const { episodeId } = req.params;
  
  const data = await fetchFromAPI('anime/episode-new.php', `?episodeid=${episodeId}`);
  
  if (!data) {
    return res.status(404).json({ error: 'Episode links not found' });
  }

  res.json(data);
});

// Get Popular Anime
app.get('/api/popular', async (req, res) => {
  const { duration = 'month', page = 1, limit = 12 } = req.query;
  
  const popularType = duration === 'month' ? 'popular' : 'today';
  const data = await fetchFromAPI('anime/test.php', `?sort=${popularType}&page=${page}&limit=${limit}`);
  
  if (!data) {
    return res.status(500).json({ error: 'Failed to fetch data' });
  }

  const response = {
    total_pages: data.total_pages || 0,
    current_page: data.current_page || 0,
    posts: data.posts ? data.posts.map(organizeAnime) : []
  };

  res.json(response);
});

// Get Series
app.get('/api/series', async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  
  const data = await fetchFromAPI('anime/test.php', `?sort=new&type=tv&page=${page}&limit=${limit}`);
  
  if (!data) {
    return res.status(500).json({ error: 'Failed to fetch data' });
  }

  const response = {
    total_pages: data.total_pages || 0,
    current_page: data.current_page || 0,
    posts: data.posts ? data.posts.map(organizeAnime) : []
  };

  res.json(response);
});

// Get Movies
app.get('/api/movies', async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  
  const data = await fetchFromAPI('anime/test.php', `?type=movie&sort=new&page=${page}&limit=${limit}`);
  
  if (!data) {
    return res.status(500).json({ error: 'Failed to fetch data' });
  }

  const response = {
    total_pages: data.total_pages || 0,
    current_page: data.current_page || 0,
    posts: data.posts ? data.posts.map(organizeAnime) : []
  };

  res.json(response);
});

// Get Random Anime
app.get('/api/random', async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  
  const data = await fetchFromAPI('anime/test.php', `?sort=random&page=${page}&limit=${limit}`);
  
  if (!data) {
    return res.status(500).json({ error: 'Failed to fetch data' });
  }

  const response = {
    total_pages: data.total_pages || 0,
    current_page: data.current_page || 0,
    posts: data.posts ? data.posts.map(organizeAnime) : []
  };

  res.json(response);
});

// Get Movie Links
app.get('/api/movie/:slug/links', async (req, res) => {
  const { slug } = req.params;
  
  const data = await fetchFromAPI('anime/movie.php', `?slug=${slug}&new=1`);
  
  if (!data) {
    return res.status(404).json({ error: 'Movie links not found' });
  }

  res.json(data);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend API running on http://localhost:${PORT}`);
  console.log(`⚠️  SSL verification disabled - FOR DEVELOPMENT ONLY`);
});