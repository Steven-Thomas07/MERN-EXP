import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

// Components
import Header from './component/Header';
import Footer from './component/Footer';
import Login from './component/login';
import RegisterForm from './RegisterForm';
import Register from './component/register';
import Dashboard from './component/Dashboard'; // New component for florist dashboard
import AddProduct from './component/Addproduct';
import ViewProduct from './component/viewproduct';
import EditProduct from './component/editproduct';
import ForgotPassword from './component/ForgotPassword';
import ResetPassword from './component/ResetPassword';

function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Validate token on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await axios.get('http://localhost:9001/validate', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Token validation response:', response.data);
      // Only update user state if different to prevent infinite loop
      setUser((prevUser) => {
        const newUser = response.data.user;
        if (JSON.stringify(prevUser) !== JSON.stringify(newUser)) {
          return newUser;
        }
        return prevUser;
      });
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Token validation failed:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData.user);
    localStorage.setItem('token', userData.token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-green-50">
        <p className="text-green-600">Loading...</p>
      </div>
    );
  }

  if (!loading) {
    return (
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-green-50">
          <Header onLogout={handleLogout} user={user} />
          <main className="flex-grow p-6">
            <Routes>
              {/* Public Routes */}
              <Route
                path="/login"
                element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />}
              />
              <Route
                path="/register"
                element={!user ? <Register /> : <Navigate to="/dashboard" />}
              />
              <Route
                path="/forgot-password"
                element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" />}
              />
              <Route
                path="/reset-password"
                element={!user ? <ResetPassword /> : <Navigate to="/dashboard" />}
              />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  user ? (
                    <Dashboard products={products} setProducts={setProducts} />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/add-product"
                element={user ? <AddProduct /> : <Navigate to="/login" />}
              />
              <Route
                path="/view-products"
                element={user ? <ViewProduct products={products} /> : <Navigate to="/login" />}
              />
              <Route
                path="/edit-product/:id"
                element={user ? <EditProduct /> : <Navigate to="/login" />}
              />

              {/* Default Redirect */}
              <Route
                path="/"
                element={<Navigate to={user ? '/dashboard' : '/login'} />}
              />
            </Routes>
          </main>
          <Footer />
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          transition={Bounce}
          theme="colored"
        />
      </BrowserRouter>
    );
  }
}

export default App;