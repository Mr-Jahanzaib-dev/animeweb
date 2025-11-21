import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import OngoingPage from './pages/OngoingPage';
import CompletedPage from './pages/CompletedPage';
import MoviesPage from './pages/MoviesPage';
import MarvelPage from './pages/MarvelPage';
import GenrePage from './pages/GenrePage';
import AnimeDetailPage from './pages/AnimeDetailPage';
import WatchPage from './pages/WatchPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ongoing" element={<OngoingPage />} />
        <Route path="/completed" element={<CompletedPage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/marvel" element={<MarvelPage />} />
        <Route path="/genre" element={<GenrePage />} />
        <Route path="/anime/:id" element={<AnimeDetailPage />} />
        <Route path="/watch/:slug/:episodeId" element={<WatchPage />} />
      </Routes>
    </Router>
  );
}

export default App;