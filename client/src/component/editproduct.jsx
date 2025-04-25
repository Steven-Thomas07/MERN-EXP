import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './AddProduct.css';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phno, setPhno] = useState('');
  const [category, setCategory] = useState('');
  const [qty, setQty] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:9000/findproduct/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const { name, phno, category, qty } = response.data;
      setName(name);
      setPhno(phno);
      setCategory(category);
      setQty(qty);
    } catch (error) {
      console.error('Fetch product error:', error);
      setError(error.response?.data?.msg || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    if (!name || !phno || !category || !qty) {
      toast.error('All fields are required');
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:9000/editproduct/${id}`,
        { name, phno: Number(phno), category, qty: Number(qty) },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success(response.data.message);
      navigate('/viewproduct');
    } catch (error) {
      console.error('Update product error:', error);
      toast.error(error.response?.data?.msg || 'Failed to update product');
    }
  };

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-6">{error}</div>;
  }

  return (
    <div className="form-wrapper bg-hero-pattern">
      <div className="form-container max-w-md mx-auto">
        <h2 className="form-title">Edit Flower Stock</h2>
        <form onSubmit={updateProduct}>
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
            Update
          </button>
          <Link to="/view-products" className="text-blue-500 cursor-pointer block mt-2">
            View the stock
          </Link>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;