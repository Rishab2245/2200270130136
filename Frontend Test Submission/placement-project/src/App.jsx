import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import UrlShortenerPage from './components/UrlShortenerPage';
import StatisticsPage from './components/StatisticsPage';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="header">          <nav className="nav-container">
            <h1 className="logo">Brevity</h1>
            <div className="nav-links">
              <Link to="/" className="nav-link">Create</Link>
              <Link to="/stats" className="nav-link">Analytics</Link>
            </div>
          </nav>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<UrlShortenerPage />} />
          <Route path="/stats" element={<StatisticsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
