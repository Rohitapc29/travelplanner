import React, { useState } from 'react';
import { fetchAllAttractions, testAPIs } from '../services/attractionsApi';

const APITester = () => {
  const [results, setResults] = useState('');
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    setResults('Testing APIs...\n');
    
    try {
      // Test general APIs
      await testAPIs();
      
      // Test specific city
      const attractions = await fetchAllAttractions('delhi');
      setResults(prev => prev + `\nDelhi attractions: ${JSON.stringify(attractions, null, 2)}`);
      
    } catch (error) {
      setResults(prev => prev + `\nError: ${error.message}`);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>API Tester</h3>
      <button onClick={runTest} disabled={loading} style={{background: '#007bff', color: 'white', padding: '10px', border: 'none', borderRadius: '4px'}}>
        {loading ? 'Testing...' : 'Test APIs'}
      </button>
      
      <pre style={{ background: '#f5f5f5', padding: '10px', marginTop: '10px', whiteSpace: 'pre-wrap', fontSize: '12px' }}>
        {results}
      </pre>
    </div>
  );
};

export default APITester;