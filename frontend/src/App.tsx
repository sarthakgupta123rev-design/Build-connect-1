import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';
import { BookingProvider } from './context/BookingContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { WorkerProfilePage } from './pages/WorkerProfilePage';
import { ComparePage } from './pages/ComparePage';
import { BookingPage } from './pages/BookingPage';
import { BookingSuccessPage } from './pages/BookingSuccessPage';
import { BookingsListPage } from './pages/BookingsListPage';
import { ReviewPage } from './pages/ReviewPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { WorkerDashboardPage } from './pages/WorkerDashboardPage';
import { WorkerProfileEditPage } from './pages/WorkerProfileEditPage';
import { WorkerJobsPage } from './pages/WorkerJobsPage';
import { WorkerEarningsPage } from './pages/WorkerEarningsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <AuthProvider>
      <CompareProvider>
        <BookingProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-[#090d16] text-gray-100 selection:bg-cyan-500 selection:text-slate-950">
              <Navbar />

              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/customer" element={<CustomerDashboardPage />} />
                  <Route path="/workers" element={<MarketplacePage />} />
                  <Route path="/workers/:id" element={<WorkerProfilePage />} />
                  <Route path="/compare" element={<ComparePage />} />
                  <Route path="/booking" element={<BookingPage />} />
                  <Route path="/booking/success" element={<BookingSuccessPage />} />
                  <Route path="/bookings" element={<BookingsListPage />} />
                  <Route path="/reviews" element={<ReviewPage />} />
                  
                  {/* Worker Suite */}
                  <Route path="/worker-dashboard" element={<WorkerDashboardPage />} />
                  <Route path="/worker-profile" element={<WorkerProfileEditPage />} />
                  <Route path="/worker/jobs" element={<WorkerJobsPage />} />
                  <Route path="/worker/jobs/:id" element={<WorkerJobsPage />} />
                  <Route path="/worker/earnings" element={<WorkerEarningsPage />} />

                  {/* Settings */}
                  <Route path="/settings" element={<SettingsPage />} />

                  {/* Catch-all 404 fallback */}
                  <Route path="*" element={<LandingPage />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </Router>
        </BookingProvider>
      </CompareProvider>
    </AuthProvider>
  );
}

export default App;
