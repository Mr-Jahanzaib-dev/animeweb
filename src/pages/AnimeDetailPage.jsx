import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Calendar, Play, Download, ChevronDown, ChevronUp, Tv } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getAnimeInfo, getSeasonInfo, getEpisodes } from '../services/api';

const AnimeDetailPage = () => {
  const { id } = useParams(); // This is actually the slug
  const navigate = useNavigate();
  const [animeData, setAnimeData] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllEpisodes, setShowAllEpisodes] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  // Helper to build TMDB image URLs
  const getImageUrl = (path, size = 'w500') => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return `https://image.tmdb.org/t/p/${size}${path}`;
    return `https://dbase.deaddrive.icu/${path}`;
  };

  useEffect(() => {
    const fetchAnimeData = async () => {
      setLoading(true);
      
      try {
        // Fetch anime info by slug (id in URL is actually slug)
        const anime = await getAnimeInfo(id);
        
        if (anime) {
          setAnimeData(anime);
          
          // Fetch seasons
          const seasonData = await getSeasonInfo(anime.id);
          setSeasons(seasonData.seasons || []);
          
          // If seasons exist, fetch episodes for the first season
          if (seasonData.seasons && seasonData.seasons.length > 0) {
            const episodeData = await getEpisodes(seasonData.seasons[0].id);
            setEpisodes(episodeData || []);
          }
        }
      } catch (error) {
        console.error('Error fetching anime data:', error);
      }
      
      setLoading(false);
    };

    fetchAnimeData();
  }, [id]);

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
              Loading Anime Details...
            </h2>
            <p style={{ color: '#999', fontSize: '1rem' }}>
              Fetching information about this anime
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

  if (!animeData) {
    return (
      <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>
        <Navbar />
        <div className="container text-center" style={{ marginTop: '200px' }}>
          <h2>Anime not found</h2>
          <p style={{ color: '#999' }}>The anime you're looking for doesn't exist or has been removed.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>
      <Navbar />

      {/* Cover Image Banner */}
      <div style={{
        marginTop: '80px',
        height: '400px',
        background: `linear-gradient(to bottom, rgba(10,10,10,0.3), rgba(10,10,10,1)), url(${getImageUrl(animeData.image?.backdrop, 'original')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} />

      <div className="container" style={{ marginTop: '-200px', position: 'relative', zIndex: 10 }}>
        <div className="row">
          {/* Anime Poster */}
          <div className="col-lg-3 col-md-4 mb-4">
            <div style={{
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              border: '3px solid rgba(229, 9, 20, 0.3)'
            }}>
              <img 
                src={getImageUrl(animeData.image?.poster)} 
                alt={animeData.name} 
                style={{ width: '100%', display: 'block' }}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="450"%3E%3Crect fill="%23222" width="300" height="450"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>

            {/* Download Button */}
            <button 
              className="btn w-100 mt-3 py-3" 
              onClick={() => navigate(`/watch/${id}/${episodes[0]?.id || ''}`)}
              style={{
                background: 'linear-gradient(135deg, #e50914 0%, #ff1744 100%)',
                border: 'none',
                color: '#fff',
                fontWeight: '600',
                fontSize: '1.1rem',
                borderRadius: '10px',
                boxShadow: '0 4px 15px rgba(229, 9, 20, 0.4)'
              }}
            >
              <Play size={20} className="me-2" />
              Watch Now
            </button>

            {/* Quick Info Box */}
            <div className="mt-4 p-3" style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h6 className="fw-bold mb-3" style={{ color: '#e50914' }}>Quick Info</h6>
              <div className="mb-2">
                <small style={{ color: '#999' }}>Status:</small>
                <div>
                  <span className={`badge ms-2 ${animeData.complete ? 'bg-secondary' : 'bg-success'}`}>
                    {animeData.complete ? 'Completed' : 'Ongoing'}
                  </span>
                </div>
              </div>
              <div className="mb-2">
                <small style={{ color: '#999' }}>Episodes:</small>
                <div className="text-white">{animeData.episodes || 'N/A'}</div>
              </div>
              <div className="mb-2">
                <small style={{ color: '#999' }}>Rating:</small>
                <div>
                  <Star size={14} fill="#ffc107" color="#ffc107" className="me-1" />
                  <span className="text-white">{animeData.rating || 'N/A'}</span>
                </div>
              </div>
              <div className="mb-2">
                <small style={{ color: '#999' }}>Type:</small>
                <div className="text-white">{animeData.type?.toUpperCase()}</div>
              </div>
              <div>
                <small style={{ color: '#999' }}>Year:</small>
                <div className="text-white">
                  {animeData.year || (animeData.release ? new Date(animeData.release).getFullYear() : 'N/A')}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9 col-md-8">
            <div className="p-4" style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              {/* Title and Info */}
              <h1 className="display-5 fw-bold mb-3">
                {animeData.name}
              </h1>
              <p className="lead mb-4" style={{ color: '#ccc' }}>
                {animeData.subOrDub} | {animeData.type?.toUpperCase()}
              </p>

              <div className="d-flex flex-wrap gap-3 mb-4">
                <div className="d-flex align-items-center">
                  <Calendar size={18} className="me-2" style={{ color: '#e50914' }} />
                  <span>{animeData.year || (animeData.release ? new Date(animeData.release).getFullYear() : 'N/A')}</span>
                </div>
                <div className="d-flex align-items-center">
                  <Tv size={18} className="me-2" style={{ color: '#e50914' }} />
                  <span>{animeData.episodes || 'N/A'} Episodes</span>
                </div>
                <div className="d-flex align-items-center">
                  <Clock size={18} className="me-2" style={{ color: '#e50914' }} />
                  <span>{animeData.complete ? 'Completed' : 'Ongoing'}</span>
                </div>
                <div className="d-flex align-items-center">
                  <Star size={18} fill="#ffc107" color="#ffc107" className="me-2" />
                  <span className="fw-bold">{animeData.rating}</span>
                </div>
              </div>

              {/* Duration */}
              {animeData.duration && (
                <div className="mb-4">
                  <h6 className="fw-bold mb-2" style={{ color: '#e50914' }}>Duration:</h6>
                  <span className="badge px-3 py-2" style={{ background: 'rgba(229, 9, 20, 0.2)', color: '#fff' }}>
                    {animeData.duration} min/ep
                  </span>
                </div>
              )}

              {/* Age Rating */}
              {animeData.age && animeData.age.short_name && (
                <div className="mb-4">
                  <h6 className="fw-bold mb-2" style={{ color: '#e50914' }}>Age Rating:</h6>
                  <span className="badge bg-warning text-dark px-3 py-2">
                    {animeData.age.short_name}
                  </span>
                  {animeData.age.description && (
                    <small className="ms-2" style={{ color: '#999' }}>
                      {animeData.age.description}
                    </small>
                  )}
                </div>
              )}

              {/* Seasons */}
              {seasons.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-bold mb-2" style={{ color: '#e50914' }}>Seasons ({seasons.length}):</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {seasons.map((season, idx) => (
                      <span key={idx} className="badge bg-secondary px-3 py-2">
                        Season {season.num}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="mb-4">
                <div className="d-flex gap-2 mb-3 flex-wrap">
                  {['info', 'storyline', 'episodes'].map(tab => (
                    <button
                      key={tab}
                      className="btn"
                      onClick={() => setActiveTab(tab)}
                      style={{
                        background: activeTab === tab ? '#e50914' : 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        border: 'none',
                        fontWeight: activeTab === tab ? '600' : '400',
                        textTransform: 'capitalize'
                      }}
                    >
                      {tab === 'info' ? 'Series Info' : tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-4" style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '10px',
                  minHeight: '200px'
                }}>
                  {activeTab === 'info' && (
                    <div>
                      <h5 className="fw-bold mb-3">Series Information</h5>
                      <ul style={{ color: '#ccc', lineHeight: '2' }}>
                        <li><strong>Full Name:</strong> {animeData.name}</li>
                        <li><strong>Rating:</strong> {animeData.rating}</li>
                        <li><strong>Type:</strong> {animeData.type?.toUpperCase()}</li>
                        <li><strong>Episodes:</strong> {animeData.episodes || 'N/A'}</li>
                        <li><strong>Year:</strong> {animeData.year || (animeData.release ? new Date(animeData.release).getFullYear() : 'N/A')}</li>
                        <li><strong>Release Date:</strong> {animeData.release}</li>
                        {animeData.complete && <li><strong>Completed:</strong> {animeData.complete}</li>}
                        <li><strong>Views:</strong> {animeData.views?.toLocaleString()}</li>
                        <li><strong>Sub/Dub:</strong> {animeData.subOrDub}</li>
                      </ul>
                    </div>
                  )}

                  {activeTab === 'storyline' && (
                    <div>
                      <h5 className="fw-bold mb-3">Storyline</h5>
                      <p style={{ color: '#ccc', lineHeight: '1.8' }}>
                        {animeData.overview || 'No description available.'}
                      </p>
                    </div>
                  )}

                  {activeTab === 'episodes' && (
                    <div>
                      <h5 className="fw-bold mb-3">Episode List ({episodes.length})</h5>
                      {episodes.length > 0 ? (
                        <>
                          <div className="row g-3">
                            {(showAllEpisodes ? episodes : episodes.slice(0, 6)).map((episode) => (
                              <div key={episode.id} className="col-md-6">
                                <div className="p-3" style={{
                                  background: 'rgba(255,255,255,0.05)',
                                  borderRadius: '8px',
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  transition: 'all 0.3s',
                                  cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = '#e50914';
                                  e.currentTarget.style.background = 'rgba(229, 9, 20, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                }}>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      <div className="fw-bold">Episode {episode.number}</div>
                                      <small style={{ color: '#999' }}>{episode.name}</small>
                                      {episode.note && (
                                        <div><small style={{ color: '#ffc107' }}>{episode.note}</small></div>
                                      )}
                                    </div>
                                    <div className="text-end">
                                      <button 
                                        className="btn btn-sm" 
                                        onClick={() => navigate(`/watch/${id}/${episode.id}`)}
                                        style={{
                                          background: '#e50914',
                                          color: '#fff',
                                          border: 'none',
                                          padding: '6px 16px'
                                        }}
                                      >
                                        <Play size={14} className="me-1" />
                                        Watch
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {episodes.length > 6 && (
                            <button
                              className="btn w-100 mt-3"
                              onClick={() => setShowAllEpisodes(!showAllEpisodes)}
                              style={{
                                background: 'rgba(255,255,255,0.1)',
                                color: '#fff',
                                border: '1px solid rgba(255,255,255,0.2)'
                              }}
                            >
                              {showAllEpisodes ? (
                                <><ChevronUp size={18} className="me-2" /> Show Less</>
                              ) : (
                                <><ChevronDown size={18} className="me-2" /> Show All Episodes ({episodes.length})</>
                              )}
                            </button>
                          )}
                        </>
                      ) : (
                        <p style={{ color: '#999' }}>No episodes available</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Download Section */}
              <div className="p-4" style={{
                background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.1) 0%, rgba(255, 23, 68, 0.1) 100%)',
                borderRadius: '10px',
                border: '1px solid rgba(229, 9, 20, 0.3)'
              }}>
                <h5 className="fw-bold mb-3" style={{ color: '#e50914' }}>Download / Watch</h5>
                <div className="d-flex flex-wrap gap-3">
                  <button 
                    className="btn btn-lg px-4" 
                    onClick={() => navigate(`/watch/${id}/${episodes[0]?.id || ''}`)}
                    style={{
                      background: '#e50914',
                      color: '#fff',
                      border: 'none',
                      fontWeight: '600'
                    }}
                  >
                    <Play size={18} className="me-2" />
                    Watch Online
                  </button>
                  <button className="btn btn-lg px-4" style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.2)',
                    fontWeight: '600'
                  }}>
                    <Download size={18} className="me-2" />
                    Download All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AnimeDetailPage;