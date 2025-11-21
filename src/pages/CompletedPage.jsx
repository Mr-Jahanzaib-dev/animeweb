import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AnimeCard from '../components/AnimeCard';
import { getSeries } from '../services/api';

const CompletedPage = () => {
  const [completedAnime, setCompletedAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCompletedAnime = async () => {
      setLoading(true);
      const data = await getSeries(currentPage, 12);
      
      // Filter only completed anime
      const completed = data.posts.filter(anime => anime.complete !== null);
      
      setCompletedAnime(completed);
      setTotalPages(data.total_pages);
      setLoading(false);
    };

    fetchCompletedAnime();
  }, [currentPage]);

  if (loading) {
    return (
      <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>
        <Navbar />
        <div className="container text-center" style={{ marginTop: '200px' }}>
          <h2>Loading completed series...</h2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>
      <Navbar />

      <div style={{ 
        marginTop: '80px', 
        padding: '60px 0', 
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5f7e 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div className="container">
          <h1 className="display-4 fw-bold mb-3">
            <CheckCircle size={40} className="me-3" style={{ color: '#4CAF50' }} />
            Completed Anime Series
          </h1>
          <p className="lead" style={{ color: '#ccc' }}>
            Watch complete anime series anytime! All episodes available.
          </p>
        </div>
      </div>

      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">
            All Completed Series ({completedAnime.length})
          </h2>
        </div>

        <div className="row g-4">
          {completedAnime.map(anime => (
            <div key={anime.id} className="col-lg-3 col-md-4 col-sm-6">
              <AnimeCard anime={{
                id: anime.slug,
                title: anime.name,
                season: anime.year,
                image: anime.image?.poster,
                rating: anime.rating,
                dubbed: anime.subOrDub,
                languages: anime.type,
                status: 'completed'
              }} />
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-5 gap-2">
            <button
              className="btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: 'none'
              }}
            >
              Previous
            </button>
            <span className="btn" style={{ background: '#e50914', color: '#fff', border: 'none' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: 'none'
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CompletedPage;