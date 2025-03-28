import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [number, setNumber] = useState('');
  const [submittedNumber, setSubmittedNumber] = useState(null); // New state for submitted value
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateSum = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!number || isNaN(number) || number < 1) {
      setError('Please enter a valid natural number (1 or higher)');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setSubmittedNumber(number); // Store the submitted number
    
    try {
      const response = await axios.post(
        'http://127.0.0.1:8888/api/v1/sum',
        { upto: parseInt(number) },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while calculating the sum');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Number Sum Calculator</h1>
      </header>
      
      <main className="app-main">
        <form onSubmit={calculateSum} className="sum-form">
          <div className="form-group">
            <label htmlFor="number-input" className="form-label">
              Enter a natural number:
            </label>
            <input
              type="number"
              id="number-input"
              className="form-input"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              min="1"
              required
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            className="submit-button"
            disabled={loading || !number || number < 1}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Calculating...
              </>
            ) : (
              'Calculate Sum'
            )}
          </button>
        </form>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {result?.success && (
          <div className="result-container">
            <h2 className="result-title">Calculation Result</h2>
            <p className="result-text">
              The sum of all numbers from 1 to {submittedNumber} is: {/* Use submittedNumber here */}
              <span className="result-value"> {result.value}</span>
            </p>
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <p>FastAPI + React Sum Calculator</p>
      </footer>
    </div>
  );
}

export default App;