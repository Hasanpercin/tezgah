
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Index from './pages/Index';
import AboutUs from './pages/AboutUs';
import Menu from './pages/Menu';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Reservation from './pages/Reservation';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminCMS from './pages/AdminCMS';
import MyReservations from './pages/MyReservations';
import NotFound from './pages/NotFound';
import Loyalty from './pages/Loyalty';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/reservation" element={<Reservation />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-reservations" element={<MyReservations />} />
              <Route path="/admin" element={<AdminCMS />} />
              <Route path="/loyalty" element={<Loyalty />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
          <Toaster position="bottom-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
