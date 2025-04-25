import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Register() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!name || !password || !email || !phone || !location) {
      setError('All fields are required');
      setLoading(false);
      toast.error('All fields are required');
      return;
    }
    try {
      console.log('Register request:', { name, email: email.toLowerCase(), phone, location, password }); // Debug request
      const response = await axios.post('http://localhost:9001/register-florist', { name, password, email: email.toLowerCase(), phone, location });
      localStorage.setItem('token', response.data.token);
      toast.success(response.data.msg);
      navigate('/login');
    } catch (err) {
      console.error('Register error response:', err.response?.data || err);
      const errorMsg = err.response?.data?.msg || 'Registration failed';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white min-h-screen" style={{ backgroundColor: '#e0f7e0' }}>
      <h2 className="text-2xl font-bold mb-6">Register</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-6 bg-white border rounded shadow">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          style={{ backgroundColor: '#000000', color: '#ffffff' }}
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
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          style={{ backgroundColor: '#d3d3d3' }}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          style={{ backgroundColor: '#d3d3d3' }}
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 bg-indigo-900 text-white rounded hover:bg-indigo-800 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        <div className="mt-4 text-center">
          Existing User?{' '}
          <Link to="/login" className="text-blue-500 underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;