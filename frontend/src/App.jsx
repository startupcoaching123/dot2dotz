import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import CoreFeatures from './components/CoreFeatures';
import WhyChooseUs from './components/WhyChooseUs';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import FAQSection from './components/FAQSection';
import ReadyToShip from './components/ReadyToShip';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LocationsPage from './pages/LocationsPage';
import PTLEstimationPage from './pages/PTLEstimationPage';
import BookingSummaryPage from './pages/BookingSummaryPage';
import DashboardPage from './pages/DashboardPage';
import Footer from './components/Footer';

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
    <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[40px] h-full opacity-[0.03] pointer-events-none hidden lg:block z-0">
      <div className="w-full h-full bg-black"></div>
      <div className="absolute inset-0 flex flex-col items-center justify-around">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="w-2 h-10 bg-white"></div>
        ))}
      </div>
    </div>

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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
