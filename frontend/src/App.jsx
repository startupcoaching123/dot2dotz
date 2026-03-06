import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import Hero from './components/Hero';
import AboutPage from './pages/AboutPage';
import ServicesSection from './components/ServicesSection';
import CoreFeatures from './components/CoreFeatures';
import WhyChooseUs from './components/WhyChooseUs';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import FAQSection from './components/FAQSection';
import ReadyToShip from './components/ReadyToShip';
import ContactPage from './pages/ContactPage';
import LocationsPage from './pages/LocationsPage';
import PTLEstimationPage from './pages/PTLEstimationPage';
import BookingSummaryPage from './pages/BookingSummaryPage';
import DashboardPage from './pages/DashboardPage';
import Login from './pages/Login/LoginFTL';

// ScrollToTop component to handle view resetting on route change
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash (e.g., #company), scroll to that element
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Otherwise scroll to top
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};


const Home = () => (
  <div className="relative">
    {/* Background Road Element */}

    <Hero />
    <WhyChooseUs />
    <CoreFeatures />
    <ServicesSection />
    <HowItWorks />
    <Testimonials />
    <FAQSection />
    <ReadyToShip />
  </div>
);


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-red-600 selection:text-white overflow-x-hidden">
          <ScrollToTop />
          <Navbar />
          <main className="flex-grow relative">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/locations" element={<LocationsPage />} />
              <Route path="/ptl-estimate" element={<PTLEstimationPage />} />
              <Route path="/booking-summary" element={<BookingSummaryPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/login/client-ftl" element={<Login />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
