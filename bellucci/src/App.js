import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ClosetPage from './pages/ClosetPage';
import CartPage from './pages/CartPage';
import TrendsPage from './pages/TrendsPage';
import ProfilePage from './pages/ProfilePage';
import ContactPage from './pages/ContactPage';
import SellerRegisterPage from './pages/SellerRegisterPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import SellerProductsPage from './pages/SellerProductsPage';
import SellerAddProductPage from './pages/SellerAddProductPage';
import SellerOrdersPage from './pages/SellerOrdersPage';
import ProtectedRoute from './ProtectedRoute';
import SellerProtectedRoute from './SellerProtectedRoute';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/seller-register" element={<SellerRegisterPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/closet"
          element={
            <ProtectedRoute>
              <ClosetPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trends"
          element={
            <ProtectedRoute>
              <TrendsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller-dashboard"
          element={
            <SellerProtectedRoute>
              <SellerDashboardPage />
            </SellerProtectedRoute>
          }
        />
        <Route
  path="/seller-products"
  element={
    <SellerProtectedRoute>
      <SellerProductsPage />
    </SellerProtectedRoute>
  }
/>
<Route
  path="/seller-add-product"
  element={
    <SellerProtectedRoute>
      <SellerAddProductPage />
    </SellerProtectedRoute>
  }
/>
<Route
  path="/seller-orders"
  element={
    <SellerProtectedRoute>
      <SellerOrdersPage />
    </SellerProtectedRoute>
  }
/>
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <ContactPage />
           </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;