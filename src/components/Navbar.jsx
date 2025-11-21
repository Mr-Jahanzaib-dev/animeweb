import React, { useState, useEffect } from 'react';
import { Search, Home, Clock, CheckCircle, Film, Sparkles, Grid, Play, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', name: 'Home', icon: Home, path: '/' },
    { id: 'ongoing', name: 'Ongoing', icon: Clock, path: '/ongoing' },
    { id: 'completed', name: 'Completed', icon: CheckCircle, path: '/completed' },
    { id: 'movies', name: 'Movies', icon: Film, path: '/movies' },
    { id: 'marvel', name: 'Marvel', icon: Sparkles, path: '/marvel' },
    { id: 'genre', name: 'Genre', icon: Grid, path: '/genre' }
  ];

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? 'rgba(10, 10, 10, 0.98)' : 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.5)' : 'none'
      }}>
        <div className="container-fluid px-4">
          <nav className="navbar navbar-expand-lg navbar-dark py-3">
            <Link to="/" className="navbar-brand d-flex align-items-center" style={{ fontSize: '1.5rem', fontWeight: '700', textDecoration: 'none', color: '#fff' }}>
              <Play size={28} className="me-2" style={{ fill: '#e50914', color: '#e50914' }} />
              <span>ToonVerse</span>
              <span style={{ color: '#e50914' }}>Haven</span>
            </Link>

            <button 
              className="navbar-toggler border-0" 
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ boxShadow: 'none' }}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
              <ul className="navbar-nav ms-4 me-auto">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.id} className="nav-item">
                      <Link 
                        to={item.path}
                        className="nav-link px-3"
                        style={{ 
                          color: isActive ? '#e50914' : '#fff',
                          fontWeight: isActive ? '600' : '400',
                          position: 'relative',
                          textDecoration: 'none'
                        }}
                      >
                        <Icon size={16} className="me-2 d-inline" />
                        {item.name}
                        {isActive && (
                          <div style={{
                            position: 'absolute',
                            bottom: '-8px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '40px',
                            height: '3px',
                            background: '#e50914',
                            borderRadius: '3px'
                          }} />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="d-flex align-items-center">
                <div className="position-relative me-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search anime..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '20px',
                      padding: '8px 40px 8px 16px',
                      color: '#fff',
                      width: '250px'
                    }}
                  />
                  <Search size={18} style={{ 
                    position: 'absolute', 
                    right: '15px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#999'
                  }} />
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <style>{`
        @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');
        .nav-link:hover { color: #e50914 !important; }
        input::placeholder { color: #666; }
        input:focus { outline: none; border-color: #e50914; }
      `}</style>
    </>
  );
};

export default Navbar;