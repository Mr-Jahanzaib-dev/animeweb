import React from 'react';
import { Grid } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const GenrePage = () => {
  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>
      <Navbar />
      <div className="container" style={{ marginTop: '150px', paddingBottom: '100px' }}>
        <h1 className="display-3 fw-bold mb-3">
          <Grid size={50} className="me-3" style={{ color: '#e50914' }} />
          Browse by Genre
        </h1>
        <p className="lead">Coming Soon...</p>
      </div>
      <Footer />
    </div>
  );
};

export default GenrePage;