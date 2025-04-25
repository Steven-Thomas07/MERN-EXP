import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [resetToken, setResetToken] = useState(location.state?.resetToken || '');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resetToken || !newPassword) {
      toast.error('Token and new password are required');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:9000/reset-password', { resetToken, newPassword });
      toast.success(response.data.msg);
      navigate('/login');
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(error.response?.data?.msg || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white min-h-screen" style={{ backgroundColor: '#e0f7e0' }}>
      <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-6 bg-white border rounded shadow">
        <input
          type="text"
          placeholder="Enter reset token"
          value={resetToken}
          onChange={(e) => setResetToken(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          style={{ backgroundColor: '#d3d3d3' }}
        />
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
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
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
