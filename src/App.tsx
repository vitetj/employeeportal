import { Suspense, lazy, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const TimeTracking = lazy(() => import('./pages/TimeTracking'));
const LeaveManagement = lazy(() => import('./pages/LeaveManagement'));
const RecuperationTime = lazy(() => import('./pages/RecuperationTime'));
const Bookings = lazy(() => import('./pages/Bookings'));
const Expenses = lazy(() => import('./pages/Expenses'));
const Tools = lazy(() => import('./pages/Tools'));
const Equipment = lazy(() => import('./pages/Equipment'));
const MobilePlan = lazy(() => import('./pages/MobilePlan'));
const Directory = lazy(() => import('./pages/Directory'));
const Antispam = lazy(() => import('./pages/Antispam'));
const Documents = lazy(() => import('./pages/Documents'));
const TicketSystem = lazy(() => import('./pages/TicketSystem'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Auto-login for demo

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!isLoggedIn) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Login onLogin={() => setIsLoggedIn(true)} />
      </Suspense>
    );
  }

  return (
    <AuthProvider>
      <DataProvider>
        <div className="app-container">
          <Header toggleSidebar={toggleSidebar} />
          <Sidebar isOpen={sidebarOpen} />
          <main className={`main-content ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/time-tracking" element={<TimeTracking />} />
                <Route path="/leave-management" element={<LeaveManagement />} />
                <Route path="/recuperation" element={<RecuperationTime />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/tools" element={<Tools />} />
                <Route path="/equipment" element={<Equipment />} />
                <Route path="/mobile" element={<MobilePlan />} />
                <Route path="/directory" element={<Directory />} />
                <Route path="/antispam" element={<Antispam />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/tickets" element={<TicketSystem />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;