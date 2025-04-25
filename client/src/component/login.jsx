import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!email || !password) {
      setError('Email and password are required');
      setLoading(false);
      toast.error('Email and password are required');
      return;
    }
    try {
      console.log('Login request:', { email: email.toLowerCase(), password }); // Debug request
      const response = await axios.post('http://localhost:9001/login-florist', { email: email.toLowerCase(), password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      onLogin({ user, token });
      toast.success('Login successful');
      navigate('/');
    } catch (err) {
      console.error('Login error response:', err.response?.data || err);
      const errorMsg = err.response?.data?.msg || 'Login failed';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white min-h-screen" style={{ backgroundColor: '#e0f7e0' }}>
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-6 bg-white border rounded shadow">
        <input
          type="email"
          placeholder="Email ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          style={{ backgroundColor: '#d3d3d3' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          style={{ backgroundColor: '#000000', color: '#ffffff' }}
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 bg-indigo-900 text-white rounded hover:bg-indigo-800 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        <div className="mt-4 text-center">
          New User?{' '}
          <Link to="/register" className="text-blue-500 underline">
            Sign Up
          </Link>
        </div>
        <div className="mt-2 text-center">
          <Link to="/forgot-password" className="text-red-600 underline">
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;