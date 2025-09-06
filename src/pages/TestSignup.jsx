import { useState } from 'react';
import { axiosInstance } from '../lib/axios';

function TestSignup() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const testDbConnection = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const response = await axiosInstance.get('/db-test');
      setResult(response.data);
    } catch (err) {
      console.error('Error testing DB:', err);
      setError({
        message: err.message,
        details: err.response?.data || 'No details available'
      });
    } finally {
      setLoading(false);
    }
  };

  const testSignup = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const response = await axiosInstance.post('/test/signup', formData);
      setResult(response.data);
    } catch (err) {
      console.error('Error in test signup:', err);
      setError({
        message: err.message,
        details: err.response?.data || 'No details available'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-xl mt-10">
      <h2 className="text-2xl font-bold text-white mb-6">Backend Connection Tests</h2>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-3">Test Database Connection</h3>
        <button 
          onClick={testDbConnection}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Testing...' : 'Test DB Connection'}
        </button>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-3">Test User Signup</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded"
            />
          </div>
          <button 
            onClick={testSignup}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition w-full"
            disabled={loading}
          >
            {loading ? 'Testing...' : 'Test Signup'}
          </button>
        </div>
      </div>
      
      {result && (
        <div className="mt-6 p-4 bg-gray-700 rounded">
          <h4 className="text-white font-semibold mb-2">Result:</h4>
          <pre className="text-green-400 overflow-auto max-h-60 text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      
      {error && (
        <div className="mt-6 p-4 bg-gray-700 rounded">
          <h4 className="text-white font-semibold mb-2">Error:</h4>
          <p className="text-red-400">{error.message}</p>
          <pre className="text-red-300 overflow-auto max-h-60 text-sm mt-2">
            {JSON.stringify(error.details, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default TestSignup;
