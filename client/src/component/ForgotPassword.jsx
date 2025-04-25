import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email is required');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:9000/forgot-password', { email });
      toast.success('Password reset token sent. Please check your email or use the token to reset password.');
      // For testing, token is returned in response, navigate to reset page with token
      navigate('/reset-password', { state: { resetToken: response.data.resetToken } });
    } catch (error) {
      console.error('Forgot password error:', error);
      console.error('Full error response:', error.response);
      toast.error(error.response?.data?.msg || 'Failed to send reset token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white min-h-screen" style={{ backgroundColor: '#e0f7e0' }}>
      <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-6 bg-white border rounded shadow">
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          {loading ? 'Sending...' : 'Send Reset Token'}
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
