import React, { useState, useEffect } from 'react';
import { Clock, Play, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AnimeCard from '../components/AnimeCard';
import { getSeries } from '../services/api';

const OngoingPage = () => {
  const [ongoingAnime, setOngoingAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('new');

  useEffect(() => {
    const fetchOngoingAnime = async () => {
      setLoading(true);
      
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      try {
        const data = await getSeries(currentPage, 18); // Fetch 18 anime per page
        
        // Get all posts
        const allPosts = data.posts || [];
        
        // Sort by rating (highest first)
        const sortedPosts = allPosts.sort((a, b) => {
          const ratingA = parseFloat(a.rating) || 0;
          const ratingB = parseFloat(b.rating) || 0;
          return ratingB - ratingA;
        });
        
        setOngoingAnime(sortedPosts);
        setTotalPages(data.total_pages || 1);
      } catch (error) {
        console.error('Error fetching ongoing anime:', error);
        setOngoingAnime([]);
      }
      setLoading(false);
    };

    fetchOngoingAnime();
  }, [currentPage, sortBy]);

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
                border: '4px solid rgba(201, 41, 41, 0.2)',
                borderTop: '4px solid #cb1a38ff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <Clock 
                size={32} 
                color="#f41212ff" 
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
              background: 'linear-gradient(135deg, #c52020ff 0%, #c92020ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Loading Ongoing Series...
            </h2>
            <p style={{ color: '#999', fontSize: '1rem' }}>
              Fetching the latest airing anime
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
                    background: '#28a745',
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

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>
      <Navbar />

      {/* Hero Banner with Top Rated Anime */}
      {ongoingAnime[0] && (
        <div style={{ 
          marginTop: '80px',
          position: 'relative',
          height: '500px',
          background: `linear-gradient(to right, rgba(10,10,10,0.95) 40%, rgba(10,10,10,0.3)), url(https://image.tmdb.org/t/p/original${ongoingAnime[0].image?.backdrop})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div className="container h-100">
            <div className="row h-100 align-items-center">
              <div className="col-lg-7">
                <div className="badge mb-3 px-3 py-2" style={{ background: '#28a745' }}>
                  <Clock size={14} className="me-1" />
                  Top Rated
                </div>
                <h1 className="display-3 fw-bold mb-3">
                  {ongoingAnime[0].name}
                </h1>
                <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
                  <span className="badge px-3 py-2" style={{ background: '#28a745' }}>
                    <Star size={14} fill="#ffc107" color="#ffc107" className="me-1" />
                    {ongoingAnime[0].rating}
                  </span>
                  <span style={{ color: '#999' }}>
                    {ongoingAnime[0].year || (ongoingAnime[0].release ? new Date(ongoingAnime[0].release).getFullYear() : 'N/A')}
                  </span>
                  <span style={{ color: '#999' }}>{ongoingAnime[0].type?.toUpperCase()}</span>
                  <span style={{ color: '#999' }}>{ongoingAnime[0].episodes} Episodes</span>
                </div>
                <p className="lead mb-4" style={{ color: '#ccc', maxWidth: '600px' }}>
                  {ongoingAnime[0].overview}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">
            <Clock size={28} className="me-2" style={{ color: '#28a745' }} />
            All Anime ({ongoingAnime.length})
          </h2>
          <select 
            className="form-select" 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ 
              background: 'rgba(255,255,255,0.1)', 
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              width: 'auto'
            }}
          >
            <option value="new">Latest Episodes</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {ongoingAnime.length > 0 ? (
          <div className="row g-4">
            {ongoingAnime.map(anime => (
              <div key={anime.id} className="col-lg-2 col-md-3 col-sm-4 col-6">
                <AnimeCard anime={anime} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <Clock size={64} style={{ color: '#666' }} />
            <h3 className="mt-3" style={{ color: '#999' }}>No ongoing anime found</h3>
            <p style={{ color: '#666' }}>Check back later for new episodes!</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-5 gap-2">
            <button
              className="btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              style={{
                background: currentPage === 1 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
                color: currentPage === 1 ? '#666' : '#fff',
                border: 'none',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              « Previous
            </button>
            
            {/* Page Numbers */}
            {[...Array(Math.min(5, totalPages))].map((_, idx) => {
              const pageNum = currentPage > 3 ? currentPage - 2 + idx : idx + 1;
              if (pageNum > totalPages) return null;
              
              return (
                <button
                  key={pageNum}
                  className="btn"
                  onClick={() => setCurrentPage(pageNum)}
                  style={{
                    background: currentPage === pageNum ? '#e50914' : 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    border: 'none',
                    minWidth: '40px'
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              className="btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              style={{
                background: currentPage === totalPages ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
                color: currentPage === totalPages ? '#666' : '#fff',
                border: 'none',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              Next »
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OngoingPage;