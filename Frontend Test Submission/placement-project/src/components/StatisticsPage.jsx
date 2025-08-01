import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';

const UrlRow = ({ url, isOpen, toggleOpen }) => (
  <div className="stats-row">
    <div className="stats-main" onClick={toggleOpen}>
      <button className="toggle-button">
        {isOpen ? '▼' : '▶'}
      </button>
      <div className="stats-content">
        <div className="url-info">
          <span className="short-code">{url.shortCode}</span>
          <a href={url.originalUrl} target="_blank" rel="noopener noreferrer" className="original-url">
            {url.originalUrl}
          </a>
        </div>
        <div className="stats-meta">
          <span>Created: {format(new Date(url.createdAt), 'PPpp')}</span>
          <span>Expires: {format(new Date(url.expiryDate), 'PPpp')}</span>
          <span className="click-count">Clicks: {url.totalClicks}</span>
        </div>
      </div>
    </div>
    
    {isOpen && (
      <div className="click-history fade-in">
        <h4>Click History</h4>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Source</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {url.clicks.map((click, index) => (
                <tr key={index}>
                  <td>{format(new Date(click.timestamp), 'PPpp')}</td>
                  <td>{click.referrer}</td>
                  <td>{click.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
);

const StatisticsPage = () => {
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState('');
  const [openRows, setOpenRows] = useState(new Set());

  const toggleRow = (index) => {
    const newOpenRows = new Set(openRows);
    if (newOpenRows.has(index)) {
      newOpenRows.delete(index);
    } else {
      newOpenRows.add(index);
    }
    setOpenRows(newOpenRows);
  };

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const shortCodes = JSON.parse(localStorage.getItem('shortCodes') || '[]');
        const promises = shortCodes.map(code =>
          axios.get(`https://two200270130136.onrender.com/shorturls/${code}`)
        );
        const responses = await Promise.all(promises);
        setUrls(responses.map(res => res.data));
      } catch (err) {
        setError('Failed to fetch URL statistics');
      }
    };

    fetchUrls();
  }, []);

  return (
    <div className="stats-container fade-in">
      <h2 className="stats-title">URL Statistics</h2>

      {error ? (
        <div className="alert alert-error">{error}</div>
      ) : urls.length === 0 ? (
        <div className="no-data">No shortened URLs found</div>
      ) : (
        <div className="stats-list">
          {urls.map((url, index) => (
            <UrlRow
              key={index}
              url={url}
              isOpen={openRows.has(index)}
              toggleOpen={() => toggleRow(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StatisticsPage;
