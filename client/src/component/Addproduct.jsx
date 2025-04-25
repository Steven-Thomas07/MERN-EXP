import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Addproduct.css';

function AddProduct() {
  const [name, setName] = useState('');
  const [phno, setPhno] = useState('');
  const [category, setCategory] = useState('');
  const [qty, setQty] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phno || !category || !qty) {
      toast.error('All fields are required');
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost:9001/addproduct',
        { name, phno: Number(phno), category, qty: Number(qty) },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success(response.data.message);
      setName('');
      setPhno('');
      setCategory('');
      setQty('');
    } catch (err) {
      console.error('Add product error:', err);
      toast.error(err.response?.data?.msg || 'Failed to add product');
    }
  };

  return (
    <div className="form-wrapper bg-hero-pattern">
      <div className="form-container max-w-md mx-auto">
        <h2 className="form-title">Register a New Flower</h2>
        <button
          onClick={handleLogout}
          className="text-blue-500 underline underline-offset-4 text-lg px-3 py-1.5 cursor-pointer"
        >
          Logout
        </button>
        <form onSubmit={handleSubmit}>
          <label className="text-lg">
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-lg w-full p-2 border rounded"
              required
            />
          </label>
          <br />
          <label className="text-lg">
            Phone No:
            <input
              type="number"
              value={phno}
              onChange={(e) => setPhno(e.target.value)}
              className="text-lg w-full p-2 border rounded"
              required
            />
          </label>
          <br />
          <label className="text-lg">
            Category:
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-lg w-full p-2 border rounded"
              required
            >
              <option value="">Select</option>
              <option value="Roses">Roses</option>
              <option value="Lilies">Lilies</option>
              <option value="Tulips">Tulips</option>
            </select>
          </label>
          <br />
          <label className="text-lg">
            Stock Quantity:
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="text-lg w-full p-2 border rounded"
              required
            />
          </label>
          <br />
          <button type="submit" className="submit-button text-lg bg-black text-white p-2 w-full rounded">
            Add Flower
          </button>
          <Link to="/view-products" className="text-blue-500 cursor-pointer block mt-2">
            View the stock
          </Link>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
