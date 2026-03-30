import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
import FTLEstimationPage from './pages/FullLoad/FTLEstimationPage';
import FTLFormPage from './pages/FullLoad/FTLFormPage';
import BookingSummaryPage from './pages/BookingSummaryPage';
import DashboardPage from './pages/DashboardPage';
import FullLoadPage from './pages/FullLoad/FullLoadPage';
import PartialLoadPage from './pages/PartialLoadPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoginPage from './pages/Login/LoginPage';
import ForgotPasswordPage from './pages/Login/ForgotPasswordPage';
import ResetPasswordPage from './pages/Login/ResetPasswordPage';
import SignUpPage from './pages/Registration/SignUpPage';
import SuperAdminDashboard from './pages/dashboards/superadmin/SuperAdminDashboard';
import AdminOperationalDashboard from './pages/dashboards/operations/AdminOperationalDashboard';
import ClientManagementPage from './pages/dashboards/superadmin/ClientManagementPage';
import VendorManagementPage from './pages/dashboards/superadmin/VendorManagementPage';
import VehicleManagementPage from './pages/dashboards/superadmin/VehicleManagementPage';
import AdminFinanceDashboard from './pages/dashboards/finance/AdminFinanceDashboard';
import ClientOwnerDashboard from './pages/dashboards/client/ClientOwnerDashboard';   
import ClientDashboard from './pages/dashboards/client/ClientDashboard';
import EnhancedClientDashboard from './pages/dashboards/client/EnhancedClientDashboard';
import ClientStaffDashboard from './pages/dashboards/client/ClientStaffDashboard';
import ShipmentTrackingPage from './pages/dashboards/client/ShipmentTrackingPage';
import ClientProfilePage from './pages/dashboards/client/ClientProfilePage';
import LeadsManagement from './pages/dashboards/client/LeadsManagement';
import VendorDashboard from './pages/dashboards/vendor/VendorDashboard';
import VendorStaffDashboard from './pages/dashboards/vendor/VendorStaffDashboard';
import DriverManagementPage from './pages/dashboards/vendor/DriverManagementPage';
import ClientRegistrationPage from './pages/Registration/ClientRegistrationPage';
import VendorRegister from './pages/Registration/VendorRegister';
import PaymentSlabsManagement from './pages/dashboards/superadmin/PaymentSlabsManagement';
import LeadManagementPage from './pages/dashboards/superadmin/LeadManagementPage';
import VendorLoadsPage from './pages/dashboards/vendor/VendorLoadsPage';
import VendorRoutesPage from './pages/dashboards/vendor/VendorRoutesPage';
import VendorFleetPage from './pages/dashboards/vendor/VendorFleetPage';
import PaymentSuccess from './pages/dashboards/shared/PaymentSuccess';
import PaymentFailure from './pages/dashboards/shared/PaymentFailure';

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
    {/* <CoreFeatures /> */}
    <ServicesSection />
    <HowItWorks />
    <Testimonials />
    <FAQSection />
    <ReadyToShip />
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/forgot-password') ||
    location.pathname.startsWith('/reset-password') ||
    location.pathname.startsWith('/signup') ||
    location.pathname.startsWith('/clients/register') ||
    location.pathname.startsWith('/vendors/register');
  const isDashboardPage = location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-red-600 selection:text-white overflow-x-hidden">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/services/full-load" element={<FullLoadPage />} />
          <Route path="/services/partial-load" element={<PartialLoadPage />} />
          <Route path="/ptl-estimate" element={<PTLEstimationPage />} />
          <Route path="/ftl-estimate" element={<FTLEstimationPage />} />
          <Route path="/services/full-load-form" element={<FTLFormPage />} />
          <Route path="/booking-summary" element={<BookingSummaryPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/super-admin" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/super-admin/users" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <ClientManagementPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/super-admin/vendors" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <VendorManagementPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/super-admin/vehicles" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <VehicleManagementPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/super-admin/payment-slabs" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <PaymentSlabsManagement />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/super-admin/leads" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <LeadManagementPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/admin-operational" element={
            <ProtectedRoute allowedRoles={['ADMIN_OPERATIONAL']}>
              <AdminOperationalDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/admin-finance" element={
            <ProtectedRoute allowedRoles={['ADMIN_FINANCE']}>
              <AdminFinanceDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/client" element={
            <ProtectedRoute allowedRoles={['CLIENT', 'CLIENT_OWNER']}>
              <EnhancedClientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/client/classic" element={
            <ProtectedRoute allowedRoles={['CLIENT', 'CLIENT_OWNER']}>
              <ClientOwnerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/client/leads" element={
            <ProtectedRoute allowedRoles={['CLIENT', 'CLIENT_OWNER', 'CLIENT_STAFF']}>
              <LeadsManagement />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/client/track" element={
            <ProtectedRoute allowedRoles={['CLIENT', 'CLIENT_OWNER', 'CLIENT_STAFF']}>
              <ShipmentTrackingPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/client/shipments" element={
            <ProtectedRoute allowedRoles={['CLIENT', 'CLIENT_OWNER', 'CLIENT_STAFF']}>
              <ShipmentTrackingPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/client/profile" element={
            <ProtectedRoute allowedRoles={['CLIENT', 'CLIENT_OWNER', 'CLIENT_STAFF']}>
              <ClientProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/client-staff" element={
            <ClientStaffDashboard />
          } />
          <Route path="/dashboard/vendor" element={
            <ProtectedRoute allowedRoles={['VENDOR', 'VENDOR_OWNER']}>
              <VendorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/vendor/drivers" element={
            <ProtectedRoute allowedRoles={['VENDOR', 'VENDOR_OWNER']}>
              <DriverManagementPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/vendor/loads" element={
            <ProtectedRoute allowedRoles={['VENDOR', 'VENDOR_OWNER']}>
              <VendorLoadsPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/vendor/fleet" element={
            <ProtectedRoute allowedRoles={['VENDOR', 'VENDOR_OWNER']}>
              <VendorFleetPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/vendor/routes" element={
            <ProtectedRoute allowedRoles={['VENDOR', 'VENDOR_OWNER']}>
              <VendorRoutesPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/vendor-staff" element={
            <ProtectedRoute allowedRoles={['VENDOR_STAFF']}>
              <VendorStaffDashboard />
            </ProtectedRoute>
          } />
          <Route path="/login/:type" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/clients/register" element={<ClientRegistrationPage />} />
          <Route path="/vendors/register" element={<VendorRegister />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/payment/success/:leadId" element={<PaymentSuccess />} />
          <Route path="/payment/failure/:leadId" element={<PaymentFailure />} />
          <Route path="/dashboard/client/quotes" element={<Navigate to="/dashboard/client/leads" replace />} />
        </Routes>
      </main>
      {!isAuthPage && !isDashboardPage && <Footer />}
    </div>
  );
};

import { ToastProvider } from './components/Toast/Toast';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
