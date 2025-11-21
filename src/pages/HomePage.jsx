import React, { useState, useEffect } from 'react';
import { Play, TrendingUp, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AnimeCard from '../components/AnimeCard';
import { getPopularAnime, getSeries } from '../services/api';

const HomePage = () => {
  const [popularAnime, setPopularAnime] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log('🔍 Fetching popular anime...'); // Debug log
      
      try {
        const popular = await getPopularAnime('month', 1, 18); // Fetch 18 popular anime
        
        console.log('📦 API Response:', popular); // Debug log
        console.log('📊 Posts:', popular.posts); // Debug log
        
        // Sort by rating (highest first) to show top anime at the beginning
        const sortedPosts = (popular.posts || []).sort((a, b) => {
          const ratingA = parseFloat(a.rating) || 0;
          const ratingB = parseFloat(b.rating) || 0;
          return ratingB - ratingA;
        });
        
        setPopularAnime(sortedPosts);
      } catch (error) {
        console.error('Error fetching popular anime:', error);
        setPopularAnime([]);
      }
      
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>
        <Navbar />
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: 'calc(100vh - 80px)',
          marginTop: '80px'
        }}>
          <div style={{ textAlign: 'center' }}>
            {/* Animated Logo/Icon */}
            <div style={{
              position: 'relative',
              marginBottom: '30px',
              display: 'inline-block'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                border: '4px solid rgba(229, 9, 20, 0.2)',
                borderTop: '4px solid #e50914',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <Play 
                size={32} 
                fill="#e50914" 
                color="#e50914" 
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  animation: 'pulse 2s ease-in-out infinite'
                }}
              />
            </div>

            {/* Loading Text */}
            <h2 style={{ 
              fontSize: '1.8rem', 
              fontWeight: '600',
              marginBottom: '10px',
              background: 'linear-gradient(135deg, #e50914 0%, #ff1744 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Loading Anime...
            </h2>
            <p style={{ color: '#999', fontSize: '1rem' }}>
              Preparing the best content for you
            </p>

            {/* Loading Dots */}
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              justifyContent: 'center', 
              marginTop: '20px' 
            }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '12px',
                    height: '12px',
                    background: '#e50914',
                    borderRadius: '50%',
                    animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 0.7; transform: translate(-50%, -50%) scale(0.95); }
          }

          @keyframes bounce {
            0%, 80%, 100% { 
              transform: scale(0);
              opacity: 0.5;
            }
            40% { 
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
  }

  const featuredAnime = popularAnime[0] || {};

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>
      <Navbar />

      {/* Hero Section */}
      {featuredAnime.name && (
        <div style={{ 
          marginTop: '80px',
          position: 'relative',
          height: '600px',
          background: `linear-gradient(to right, rgba(10,10,10,1) 30%, rgba(10,10,10,0.3)), url(https://image.tmdb.org/t/p/original${featuredAnime.image?.backdrop})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div className="container h-100">
            <div className="row h-100 align-items-center">
              <div className="col-lg-6">
                <div className="badge mb-3 px-3 py-2" style={{ background: '#e50914' }}>
                  <TrendingUp size={14} className="me-1" />
                  Trending #1
                </div>
                <h1 className="display-3 fw-bold mb-3">
                  {featuredAnime.name}
                </h1>
                <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
                  <span className="badge px-3 py-2" style={{ background: '#e50914' }}>
                    <Star size={14} fill="#ffc107" color="#ffc107" className="me-1" />
                    {featuredAnime.rating}
                  </span>
                  <span style={{ color: '#999' }}>
                    {featuredAnime.year || (featuredAnime.release ? new Date(featuredAnime.release).getFullYear() : 'N/A')}
                  </span>
                  <span style={{ color: '#999' }}>{featuredAnime.type?.toUpperCase()}</span>
                  <span style={{ color: '#999' }}>{featuredAnime.episodes} Episodes</span>
                </div>
                <p className="lead mb-4" style={{ color: '#ccc', maxWidth: '500px' }}>
                  {featuredAnime.overview}
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <button className="btn btn-lg px-5" style={{ 
                    background: '#e50914', 
                    border: 'none',
                    color: '#fff',
                    fontWeight: '600'
                  }}>
                    <Play size={20} className="me-2" fill="#fff" />
                    Watch Now
                  </button>
                  <Link to={`/anime/${featuredAnime.slug}`} className="btn btn-lg btn-outline-light px-4" style={{ textDecoration: 'none' }}>
                    More Info
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trending Section */}
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">
            <TrendingUp size={28} className="me-2" style={{ color: '#e50914' }} />
            Trending Now
          </h2>
        </div>

        <div className="row g-4">
          {popularAnime.map(anime => (
            <div key={anime.id} className="col-lg-2 col-md-3 col-sm-4 col-6">
              <AnimeCard anime={anime} />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-5">
          <Link 
            to="/ongoing" 
            className="btn btn-lg px-5 py-3"
            style={{ 
              background: 'linear-gradient(135deg, #e50914 0%, #ff1744 100%)', 
              border: 'none',
              color: '#fff',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 15px rgba(229, 9, 20, 0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(229, 9, 20, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(229, 9, 20, 0.3)';
            }}
          >
            Load More Anime
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;