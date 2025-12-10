import React, { useState, useEffect, useRef } from 'react';
import { Search, Home, Clock, CheckCircle, Film, Sparkles, Grid, Play, Menu, X, Loader2 } from 'lucide-react';

// Mock searchAnime function for demo
const searchAnime = async (query, page = 1, limit = 5) => {
  // Simulated API response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        posts: [
          {
            id: 1,
            name: 'Attack on Titan',
            slug: 'attack-on-titan',
            type: 'TV Series',
            year: 2013,
            rating: '9.0',
            image: { poster: '/placeholder1.jpg' }
          },
          {
            id: 2,
            name: 'Demon Slayer',
            slug: 'demon-slayer',
            type: 'TV Series',
            year: 2019,
            rating: '8.7',
            image: { poster: '/placeholder2.jpg' }
          }
        ]
      });
    }, 300);
  });
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  
  const searchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const mobileSuggestionsRef = useRef(null);
  const debounceTimerRef = useRef(null);

  const getPosterUrl = (anime) => {
    if (!anime || !anime.image) return null;
    const posterPath = anime.image.poster;
    if (!posterPath || posterPath === '' || posterPath === 'null') return null;
    if (posterPath.startsWith('http://') || posterPath.startsWith('https://')) return posterPath;
    if (posterPath.startsWith('/')) return `https://image.tmdb.org/t/p/w500${posterPath}`;
    return null;
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target) &&
        mobileSuggestionsRef.current &&
        !mobileSuggestionsRef.current.contains(event.target) &&
        mobileSearchInputRef.current &&
        !mobileSearchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      setSuggestionsLoading(true);
      
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(async () => {
        try {
          const data = await searchAnime(searchQuery, 1, 5);
          if (data && data.posts) {
            setSuggestions(data.posts);
            setShowSuggestions(true);
          }
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        } finally {
          setSuggestionsLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSuggestionsLoading(false);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      setMenuOpen(false);
      console.log('Search:', searchQuery);
      // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSuggestionClick = (anime) => {
    setShowSuggestions(false);
    setSearchQuery('');
    setMenuOpen(false);
    console.log('Navigate to:', anime.slug);
    // navigate(`/anime/${anime.slug}`);
  };

  const navItems = [
    { id: 'home', name: 'Home', icon: Home, path: '/' },
    { id: 'ongoing', name: 'Ongoing', icon: Clock, path: '/ongoing' },
    { id: 'completed', name: 'Completed', icon: CheckCircle, path: '/completed' },
    { id: 'movies', name: 'Movies', icon: Film, path: '/movies' },
    { id: 'marvel', name: 'Marvel', icon: Sparkles, path: '/marvel' },
    { id: 'genre', name: 'Genre', icon: Grid, path: '/genre' }
  ];

  const renderSuggestionImage = (anime, size = { width: 50, height: 75 }) => {
    const imageUrl = getPosterUrl(anime);
    
    if (imageUrl) {
      return (
        <img
          src={imageUrl}
          alt={anime.name}
          style={{
            width: `${size.width}px`,
            height: `${size.height}px`,
            objectFit: 'cover',
            borderRadius: size.width === 40 ? '4px' : '6px',
            marginRight: size.width === 40 ? '10px' : '12px',
            background: '#1a1a1a',
            flexShrink: 0
          }}
          loading="lazy"
        />
      );
    }
    
    return (
      <div style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
        background: 'linear-gradient(135deg, #333 0%, #1a1a1a 100%)',
        borderRadius: size.width === 40 ? '4px' : '6px',
        marginRight: size.width === 40 ? '10px' : '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666',
        flexShrink: 0
      }}>
        <Film size={16} />
      </div>
    );
  };

  const SuggestionsDropdown = ({ isMobile = false }) => {
    const ref = isMobile ? mobileSuggestionsRef : suggestionsRef;
    
    return (
      <div
        ref={ref}
        style={{
          position: 'absolute',
          top: '100%',
          left: isMobile ? 0 : 'auto',
          right: isMobile ? 0 : '1rem',
          marginTop: '8px',
          width: isMobile ? '100%' : 'min(350px, 90vw)',
          background: 'rgba(20, 20, 20, 0.98)',
          borderRadius: '8px',
          border: '1px solid rgba(229, 9, 20, 0.3)',
          maxHeight: isMobile ? '60vh' : '400px',
          overflowY: 'auto',
          zIndex: 1001,
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
        }}
      >
        {suggestionsLoading ? (
          <div style={{ padding: isMobile ? '20px' : '30px', textAlign: 'center' }}>
            <Loader2 size={isMobile ? 24 : 32} color="#e50914" className="spinning" />
          </div>
        ) : suggestions.length > 0 ? (
          suggestions.map((anime) => (
            <div
              key={anime.id}
              onClick={() => handleSuggestionClick(anime)}
              className="suggestion-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: isMobile ? '10px' : '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              {renderSuggestionImage(anime, isMobile ? { width: 40, height: 60 } : { width: 50, height: 75 })}
              <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                <div style={{
                  fontWeight: '600',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  marginBottom: '2px',
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {anime.name}
                </div>
                <div style={{
                  fontSize: isMobile ? '0.75rem' : '0.85rem',
                  color: '#999'
                }}>
                  {anime.type} {anime.year && `• ${anime.year}`} {anime.rating && !isMobile && `• ⭐ ${anime.rating}`}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: isMobile ? '20px' : '30px', textAlign: 'center', color: '#666', fontSize: '0.85rem' }}>
            No results found
          </div>
        )}
      </div>
    );
  };

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
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 clamp(12px, 3vw, 24px)'
        }}>
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'clamp(12px, 2vh, 16px) 0',
            gap: 'clamp(8px, 2vw, 16px)'
          }}>
            {/* Logo */}
            <a 
              href="/" 
              onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}
              style={{ 
                display: 'flex',
                alignItems: 'center',
                fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                fontWeight: '700',
                textDecoration: 'none',
                color: '#fff',
                flexShrink: 0,
                gap: '8px'
              }}
            >
              <Play size={window.innerWidth < 768 ? 24 : 28} style={{ fill: '#e50914', color: '#e50914' }} />
              <span className="logo-text">Dead<span style={{ color: '#e50914' }}>Anime</span></span>
            </a>

            {/* Desktop Navigation */}
            <ul className="desktop-nav">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <a 
                      href={item.path}
                      onClick={(e) => { e.preventDefault(); setActiveTab(item.id); }}
                      className={isActive ? 'active' : ''}
                      style={{ 
                        color: isActive ? '#e50914' : '#fff',
                        fontWeight: isActive ? '600' : '400',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        position: 'relative'
                      }}
                    >
                      <Icon size={16} />
                      {item.name}
                      {isActive && (
                        <div style={{
                          position: 'absolute',
                          bottom: '-4px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '40px',
                          height: '3px',
                          background: '#e50914',
                          borderRadius: '3px'
                        }} />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* Desktop Search */}
            <div className="desktop-search">
              <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '20px',
                    padding: '8px 40px 8px 16px',
                    color: '#fff',
                    width: '100%',
                    fontSize: '0.9rem'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#999',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Search size={18} />
                </button>
              </form>
              {showSuggestions && <SuggestionsDropdown />}
            </div>

            {/* Mobile/Tablet Actions */}
            <div className="mobile-actions">
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          {/* Mobile Search */}
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
            <form onSubmit={handleSearchSubmit}>
              <div style={{ position: 'relative' }}>
                <input
                  ref={mobileSearchInputRef}
                  type="text"
                  placeholder="Search anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '20px',
                    padding: '10px 40px 10px 16px',
                    color: '#fff',
                    width: '100%',
                    fontSize: '1rem'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#999',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Search size={20} />
                </button>
              </div>
            </form>
            {showSuggestions && <SuggestionsDropdown isMobile={true} />}
          </div>

          {/* Mobile Navigation */}
          <ul style={{ listStyle: 'none', padding: '8px 0', margin: 0 }}>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <a 
                    href={item.path}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(item.id);
                      setMenuOpen(false);
                    }}
                    style={{ 
                      color: isActive ? '#e50914' : '#fff',
                      fontWeight: isActive ? '600' : '400',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 20px',
                      transition: 'all 0.3s ease',
                      background: isActive ? 'rgba(229, 9, 20, 0.1)' : 'transparent'
                    }}
                  >
                    <Icon size={20} />
                    <span style={{ fontSize: '1rem' }}>{item.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </header>

      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          background: #0a0a0a;
          color: #fff;
          padding-top: 80px;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .spinning {
          animation: spin 1s linear infinite;
        }

        input::placeholder { 
          color: #666; 
        }
        
        input:focus { 
          outline: none; 
          border-color: #e50914 !important; 
          box-shadow: 0 0 0 0.2rem rgba(229, 9, 20, 0.25);
        }

        .suggestion-item:hover {
          background: rgba(229, 9, 20, 0.1) !important;
        }

        /* Desktop Navigation - Hidden on mobile/tablet */
        .desktop-nav {
          display: none;
          list-style: none;
          padding: 0;
          margin: 0;
          gap: 4px;
          flex: 1;
          max-width: 600px;
        }

        .desktop-nav li a:hover {
          background: rgba(229, 9, 20, 0.1);
        }

        /* Desktop Search - Hidden on mobile/tablet */
        .desktop-search {
          display: none;
          position: relative;
          width: 250px;
          flex-shrink: 0;
        }

        /* Mobile Actions - Visible on mobile/tablet */
        .mobile-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Mobile Menu */
        .mobile-menu {
          position: fixed;
          top: 100%;
          left: 0;
          right: 0;
          background: rgba(10, 10, 10, 0.98);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease, opacity 0.3s ease;
          opacity: 0;
          z-index: 999;
        }

        .mobile-menu.open {
          max-height: calc(100vh - 80px);
          opacity: 1;
          overflow-y: auto;
        }

        .mobile-menu ul li a:hover {
          background: rgba(229, 9, 20, 0.05);
        }

        /* Tablet (768px - 1023px) */
        @media (min-width: 768px) and (max-width: 1023px) {
          .logo-text {
            display: inline !important;
          }

          .desktop-search {
            display: block;
            width: 200px;
          }

          body {
            padding-top: 70px;
          }
        }

        /* Desktop (1024px+) */
        @media (min-width: 1024px) {
          .desktop-nav {
            display: flex;
          }

          .desktop-search {
            display: block;
          }

          .mobile-actions {
            display: none;
          }

          .mobile-menu {
            display: none;
          }

          .logo-text {
            display: inline !important;
          }
        }

        /* Small mobile (< 375px) */
        @media (max-width: 374px) {
          .logo-text {
            font-size: 1.1rem !important;
          }
        }

        /* Medium mobile and up */
        @media (min-width: 480px) {
          .desktop-search {
            width: 220px;
          }
        }

        /* Large screens */
        @media (min-width: 1200px) {
          .desktop-search {
            width: 280px;
          }
        }

        /* Smooth scrollbar for mobile menu */
        .mobile-menu::-webkit-scrollbar {
          width: 6px;
        }

        .mobile-menu::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
        }

        .mobile-menu::-webkit-scrollbar-thumb {
          background: rgba(229, 9, 20, 0.5);
          border-radius: 3px;
        }

        /* Custom scrollbar for suggestions */
        div[style*="overflowY"]::-webkit-scrollbar {
          width: 6px;
        }

        div[style*="overflowY"]::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
        }

        div[style*="overflowY"]::-webkit-scrollbar-thumb {
          background: rgba(229, 9, 20, 0.5);
          border-radius: 3px;
        }
      `}</style>

      {/* Demo Content */}
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1 style={{ margin: '40px 0 20px' }}>Responsive Navbar Demo</h1>
        <p style={{ color: '#999', maxWidth: '600px', margin: '0 auto 40px' }}>
          Try resizing your browser window or testing on different devices. 
          The navbar adapts to mobile (768px), tablet (768px - 1023px), and desktop (1024px+) screens.
        </p>
        <div style={{ height: '150vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#666' }}>Scroll to test sticky navbar with backdrop blur effect</p>
        </div>
      </div>
    </>
  );
};

export default Navbar;