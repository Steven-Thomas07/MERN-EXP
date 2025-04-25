import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="p-6 bg-green-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-green-900">Florist Management System</h1>
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
        <p className="text-lg mb-4 text-center">Welcome to the Florist Management System Dashboard.</p>
        <div className="flex flex-col space-y-4">
          <Link
            to="/view-products"
            className="text-center bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
          >
            View Product Stock
          </Link>
          <Link
            to="/add-product"
            className="text-center bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          >
            Add New Product
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
