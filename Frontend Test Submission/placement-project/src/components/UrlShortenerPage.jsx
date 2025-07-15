import React, { useState } from 'react';
import axios from 'axios';

const UrlShortenerPage = () => {
  const [urls, setUrls] = useState([{ url: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const handleAddUrl = () => {
    if (urls.length < 5) {
      setUrls([...urls, { url: '', validity: '', shortcode: '' }]);
    }
  };

  const handleChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validUrls = urls.filter(url => url.url.trim() !== '');
      const promises = validUrls.map(({ url, validity, shortcode }) =>
        axios.post('http://localhost:5000/shorturls', {
          url,
          validity: validity || 30,
          shortcode: shortcode || undefined
        })
      );

      const responses = await Promise.all(promises);
      setResults(responses.map(res => res.data));
      setAlert({
        show: true,
        message: 'URLs shortened successfully!',
        type: 'success'
      });

      // Store shortcodes in localStorage for statistics page
      const shortCodes = responses.map(res => {
        const shortLink = new URL(res.data.shortLink);
        return shortLink.pathname.slice(1);
      });
      const existingCodes = JSON.parse(localStorage.getItem('shortCodes') || '[]');
      localStorage.setItem('shortCodes', JSON.stringify([...new Set([...existingCodes, ...shortCodes])]));
    } catch (error) {
      setAlert({
        show: true,
        message: error.response?.data?.error || 'An error occurred',
        type: 'error'
      });
    }

    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 6000);
  };

  return (
    <div className="form-container fade-in">
      <h2 className="form-title">URL Shortener</h2>

      {alert.show && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="url-form">
        {urls.map((url, index) => (
          <div key={index} className="form-group">
            <div className="input-group">
              <label className="input-label" htmlFor={`url-${index}`}>URL</label>
              <input
                id={`url-${index}`}
                className="input-field"
                type="url"
                value={url.url}
                onChange={(e) => handleChange(index, 'url', e.target.value)}
                placeholder="Enter URL to shorten"
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor={`validity-${index}`}>Validity (minutes)</label>
              <input
                id={`validity-${index}`}
                className="input-field"
                type="number"
                value={url.validity}
                onChange={(e) => handleChange(index, 'validity', e.target.value)}
                placeholder="30"
              />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor={`shortcode-${index}`}>Custom Shortcode</label>
              <input
                id={`shortcode-${index}`}
                className="input-field"
                type="text"
                value={url.shortcode}
                onChange={(e) => handleChange(index, 'shortcode', e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>
        ))}

        <div className="button-group">
          {urls.length < 5 && (
            <button
              type="button"
              className="button button-outline"
              onClick={handleAddUrl}
            >
              Add Another URL
            </button>
          )}
          <button type="submit" className="button button-primary">
            Shorten URLs
          </button>
        </div>
      </form>

      {results.length > 0 && (
        <div className="results-container fade-in">
          <h3 className="form-title">Shortened URLs</h3>
          {results.map((result, index) => (
            <div key={index} className="result-item">
              <a
                href={result.shortLink}
                target="_blank"
                rel="noopener noreferrer"
                className="short-url"
              >
                {result.shortLink}
              </a>
              <p className="expiry-text">
                Expires: {new Date(result.expiry).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UrlShortenerPage;
